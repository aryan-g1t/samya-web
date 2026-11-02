import { put, del, list } from '@vercel/blob';
import { getAuthenticatedUser } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Auth Guard
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

  try {
    // -------------------------------------------------------------
    // POST: CREATE MANUAL RECORD
    // -------------------------------------------------------------
    if (req.method === 'POST') {
      const participantId = body.participantId || ('SAM-' + Math.floor(100000 + Math.random() * 900000));
      const record = {
        timestamp: new Date().toISOString(),
        participantId,
        fullName: body.fullName || 'Manual Entry',
        email: body.email || '',
        phone: body.phone || '',
        optInUpdates: body.optInUpdates ? 'Yes' : 'No',
        state: body.state || '',
        city: body.city || '',
        pastExperience: body.pastExperience || '',
        biggestChallenges: body.biggestChallenges || '',
        skinToneDepth: body.skinToneDepth || 'Unknown',
        undertone: body.undertone || '',
        seasonalShift: body.seasonalShift || '',
        testingInterest: body.testingInterest || 'Yes',
        stageCompleted: body.stageCompleted || 'Full Profile',
        currentBrandAndShade: body.currentBrandAndShade || '',
        neckVsFace: body.neckVsFace || '',
        simplifiedMatchNeeds: body.simplifiedMatchNeeds || '',
        skinStatusNow: body.skinStatusNow || '',
        selectionConfidence: body.selectionConfidence || '',
        sampleTestingConsent: body.sampleTestingConsent || 'Yes',
        kitStatus: body.kitStatus || 'Pending',
        internalNotes: body.internalNotes || '',
        createdBy: user.username,
        updatedAt: new Date().toISOString()
      };

      const blobKey = `submissions/${Date.now()}_${participantId}.json`;
      const blob = await put(blobKey, JSON.stringify(record, null, 2), {
        access: 'public',
        contentType: 'application/json'
      });

      return res.status(201).json({
        status: 'success',
        message: 'Record created successfully',
        entry: record,
        blobUrl: blob.url
      });
    }

    // -------------------------------------------------------------
    // PUT: UPDATE EXISTING RECORD
    // -------------------------------------------------------------
    if (req.method === 'PUT') {
      const participantId = body.participantId;
      if (!participantId) {
        return res.status(400).json({ error: 'Missing required field: participantId' });
      }

      // Find blob for this participant
      const { blobs } = await list({ prefix: 'submissions/' });
      let targetBlob = null;
      let existingRecord = null;

      for (const b of blobs) {
        if (b.pathname.includes(participantId)) {
          targetBlob = b;
          try {
            const resp = await fetch(b.url);
            existingRecord = await resp.json();
          } catch {}
          break;
        }
      }

      if (!targetBlob || !existingRecord) {
        return res.status(404).json({ error: `Record with ID ${participantId} not found` });
      }

      // Merge updates
      const updatedRecord = {
        ...existingRecord,
        ...body.updates,
        participantId: existingRecord.participantId, // protect ID
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: user.username
      };

      // Overwrite blob
      const updatedBlob = await put(targetBlob.pathname, JSON.stringify(updatedRecord, null, 2), {
        access: 'public',
        contentType: 'application/json'
      });

      return res.status(200).json({
        status: 'success',
        message: 'Record updated successfully',
        entry: updatedRecord,
        blobUrl: updatedBlob.url
      });
    }

    // -------------------------------------------------------------
    // DELETE: REMOVE RECORD
    // -------------------------------------------------------------
    if (req.method === 'DELETE') {
      const participantId = body.participantId;
      if (!participantId) {
        return res.status(400).json({ error: 'Missing required field: participantId' });
      }

      const { blobs } = await list({ prefix: 'submissions/' });
      const matchedBlobs = blobs.filter(b => b.pathname.includes(participantId));

      if (matchedBlobs.length === 0) {
        return res.status(404).json({ error: `Record with ID ${participantId} not found` });
      }

      for (const b of matchedBlobs) {
        await del(b.url);
      }

      return res.status(200).json({
        status: 'success',
        message: `Record ${participantId} successfully removed`,
        deletedCount: matchedBlobs.length
      });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (error) {
    console.error('Error handling entry CRUD:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
