import { put } from '@vercel/blob';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const rawData = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const participantId = rawData.participantId || ('SAM-' + Math.floor(100000 + Math.random() * 900000));
    const timestamp = rawData.timestamp || new Date().toISOString();

    const record = {
      timestamp,
      participantId,
      fullName: rawData.fullName || '',
      email: rawData.email || '',
      phone: rawData.phone || '',
      optInUpdates: rawData.optInUpdates ? 'Yes' : 'No',
      state: rawData.state || '',
      pastExperience: rawData.pastExperience || '',
      biggestChallenges: Array.isArray(rawData.biggestChallenges) ? rawData.biggestChallenges.join('; ') : (rawData.biggestChallenges || ''),
      skinToneDepth: rawData.skinToneDepth || '',
      undertone: rawData.undertone || '',
      seasonalShift: rawData.seasonalShift || '',
      testingInterest: rawData.testingInterest || '',
      stageCompleted: rawData.stageCompleted || 'Full Profile',
      currentBrandAndShade: rawData.currentBrandAndShade || '',
      neckVsFace: rawData.neckVsFace || '',
      simplifiedMatchNeeds: Array.isArray(rawData.simplifiedMatchNeeds) ? rawData.simplifiedMatchNeeds.join('; ') : (rawData.simplifiedMatchNeeds || ''),
      skinStatusNow: rawData.skinStatusNow || '',
      selectionConfidence: rawData.selectionConfidence || '',
      city: rawData.city || '',
      sampleTestingConsent: rawData.sampleTestingConsent || ''
    };

    // Save individual response file in Vercel Blob
    const blobKey = `submissions/${Date.now()}_${participantId}.json`;
    const blob = await put(blobKey, JSON.stringify(record, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });

    return res.status(200).json({
      status: 'success',
      participantId,
      blobUrl: blob.url
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal Server Error'
    });
  }
}
