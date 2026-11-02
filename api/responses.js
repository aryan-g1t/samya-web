import { list } from '@vercel/blob';

const CSV_HEADERS = [
  "Timestamp",
  "Participant ID",
  "Full Name",
  "Email",
  "Phone Number",
  "Opt-in Updates",
  "State / Territory",
  "Past Experience",
  "Biggest Challenges",
  "Skin Tone Depth",
  "Undertone",
  "Seasonal Shift",
  "Testing Interest",
  "Completion Status",
  "Current Brand & Shade",
  "Neck vs Face Match",
  "Match Priorities",
  "Skin Tone Right Now",
  "Selection Confidence",
  "City / Town",
  "Sample Testing Consent"
];

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { blobs } = await list({ prefix: 'submissions/' });

    // Fetch and parse all blobs concurrently
    const records = await Promise.all(
      blobs.map(async (b) => {
        try {
          const resp = await fetch(b.url);
          return await resp.json();
        } catch {
          return null;
        }
      })
    );

    const validRecords = records.filter(Boolean).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const format = req.query?.format || 'csv';

    if (format === 'json') {
      return res.status(200).json({
        total: validRecords.length,
        submissions: validRecords
      });
    }

    // Format as CSV
    const rows = [
      CSV_HEADERS.map(escapeCsvField).join(',')
    ];

    for (const r of validRecords) {
      const row = [
        r.timestamp,
        r.participantId,
        r.fullName,
        r.email,
        r.phone,
        r.optInUpdates,
        r.state,
        r.pastExperience,
        r.biggestChallenges,
        r.skinToneDepth,
        r.undertone,
        r.seasonalShift,
        r.testingInterest,
        r.stageCompleted,
        r.currentBrandAndShade,
        r.neckVsFace,
        r.simplifiedMatchNeeds,
        r.skinStatusNow,
        r.selectionConfidence,
        r.city,
        r.sampleTestingConsent
      ];
      rows.push(row.map(escapeCsvField).join(','));
    }

    const csvContent = rows.join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="samya_research_responses.csv"');
    return res.status(200).send(csvContent);

  } catch (error) {
    console.error('Error fetching responses:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal Server Error'
    });
  }
}
