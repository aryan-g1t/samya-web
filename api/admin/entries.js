import { list } from '@vercel/blob';
import { getAuthenticatedUser } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Auth Guard
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required' });
  }

  try {
    const { blobs } = await list({ prefix: 'submissions/' });

    const rawRecords = await Promise.all(
      blobs.map(async (b) => {
        try {
          const resp = await fetch(b.url);
          const data = await resp.json();
          return {
            ...data,
            blobPath: b.pathname,
            blobUrl: b.url,
            uploadedAt: b.uploadedAt
          };
        } catch {
          return null;
        }
      })
    );

    const allEntries = rawRecords.filter(Boolean);

    // Compute Executive KPI Stats
    const stats = {
      total: allEntries.length,
      fullProfiles: allEntries.filter(e => e.stageCompleted === 'Full Profile').length,
      initialMilestones: allEntries.filter(e => e.stageCompleted !== 'Full Profile').length,
      kitCandidates: allEntries.filter(e => {
        const consent = String(e.sampleTestingConsent || '').toLowerCase();
        const interest = String(e.testingInterest || '').toLowerCase();
        return consent.includes('yes') || interest.includes('yes');
      }).length,
      depthDistribution: {
        fair: allEntries.filter(e => String(e.skinToneDepth || '').toLowerCase().includes('fair')).length,
        medium: allEntries.filter(e => {
          const d = String(e.skinToneDepth || '').toLowerCase();
          return d.includes('medium') && !d.includes('deep');
        }).length,
        rich: allEntries.filter(e => {
          const d = String(e.skinToneDepth || '').toLowerCase();
          return d.includes('rich') || d.includes('medium deep');
        }).length,
        deep: allEntries.filter(e => {
          const d = String(e.skinToneDepth || '').toLowerCase();
          return d.includes('deep') && !d.includes('medium deep');
        }).length,
        other: 0
      }
    };
    stats.depthDistribution.other = stats.total - (
      stats.depthDistribution.fair +
      stats.depthDistribution.medium +
      stats.depthDistribution.rich +
      stats.depthDistribution.deep
    );

    // Apply Search Query Filter
    const search = (req.query.search || '').trim().toLowerCase();
    const depthFilter = (req.query.depth || '').trim().toLowerCase();
    const kitFilter = (req.query.kitStatus || '').trim().toLowerCase();
    const completionFilter = (req.query.completion || '').trim().toLowerCase();
    const sortBy = (req.query.sort || 'newest').trim().toLowerCase();

    let filtered = allEntries.filter(item => {
      // Search matches
      if (search) {
        const hay = [
          item.participantId,
          item.fullName,
          item.email,
          item.phone,
          item.city,
          item.state,
          item.currentBrandAndShade
        ].filter(Boolean).join(' ').toLowerCase();

        if (!hay.includes(search)) return false;
      }

      // Depth filter
      if (depthFilter && depthFilter !== 'all') {
        const itemDepth = String(item.skinToneDepth || '').toLowerCase();
        if (!itemDepth.includes(depthFilter)) return false;
      }

      // Kit Status filter
      if (kitFilter && kitFilter !== 'all') {
        const status = String(item.kitStatus || 'pending').toLowerCase();
        if (status !== kitFilter) return false;
      }

      // Completion filter
      if (completionFilter && completionFilter !== 'all') {
        const comp = String(item.stageCompleted || '').toLowerCase();
        if (completionFilter === 'full' && !comp.includes('full')) return false;
        if (completionFilter === 'milestone' && comp.includes('full')) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (sortBy === 'name') {
        return String(a.fullName || '').localeCompare(String(b.fullName || ''));
      }
      // default: newest
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return res.status(200).json({
      status: 'success',
      stats,
      total: allEntries.length,
      filteredCount: filtered.length,
      entries: filtered
    });

  } catch (error) {
    console.error('Error fetching admin entries:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
