import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sāmya: Live Data Access Guide</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    :root {
      --porcelain: #F5EFE8;
      --plum: #1B0516;
      --warm-white: #FCF9F5;
      --line: #DCD0D3;
      --muted: #6E5D68;
      --wine: #76022E;
      --yellow: #F5C928;
      --purple: #7114AC;
      --serif: 'Cormorant Garamond', Georgia, serif;
      --sans: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
      --mono: 'JetBrains Mono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--sans);
      color: var(--plum);
      background: #FFFFFF;
      font-size: 13px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding: 40px 50px;
    }

    .page {
      max-width: 800px;
      margin: 0 auto;
    }

    /* Header */
    .header {
      border-bottom: 2px solid var(--wine);
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .brand-eyebrow {
      font-family: var(--sans);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: var(--wine);
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    h1 {
      font-family: var(--serif);
      font-size: 32px;
      font-weight: 700;
      color: var(--plum);
      line-height: 1.15;
    }

    h1 em {
      color: var(--wine);
      font-style: italic;
    }

    .meta-tag {
      font-size: 11px;
      color: var(--muted);
      text-align: right;
    }

    .meta-tag strong {
      color: var(--plum);
    }

    /* Spectrum Ribbon */
    .spectrum-bar {
      height: 3px;
      width: 100%;
      background: linear-gradient(90deg, #76022E 0%, #7114AC 25%, #E40485 50%, #F5C928 75%, #00AEBD 100%);
      border-radius: 2px;
      margin-bottom: 32px;
    }

    /* Section Cards */
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }

    .section-title {
      font-family: var(--serif);
      font-size: 22px;
      font-weight: 700;
      color: var(--plum);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .number-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--wine);
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      font-family: var(--sans);
    }

    .card {
      background: var(--warm-white);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 20px 24px;
      margin-bottom: 16px;
    }

    .card-featured {
      background: #FAF5F0;
      border: 1.5px solid var(--wine);
    }

    .card-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--wine);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    p {
      margin-bottom: 12px;
      color: #3B2E36;
    }

    p:last-child {
      margin-bottom: 0;
    }

    /* Steps List */
    ol.steps {
      padding-left: 20px;
      margin: 12px 0;
    }

    ol.steps li {
      margin-bottom: 10px;
      color: #3B2E36;
    }

    ol.steps li strong {
      color: var(--plum);
    }

    /* Formula Box */
    .formula-box {
      background: #FFFFFF;
      border: 1.5px dashed var(--wine);
      border-radius: 10px;
      padding: 14px 18px;
      margin: 12px 0;
      font-family: var(--mono);
      font-size: 12px;
      color: var(--wine);
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(118, 2, 46, 0.04);
    }

    .formula-badge {
      background: var(--wine);
      color: #FFFFFF;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: var(--sans);
      letter-spacing: 0.05em;
    }

    /* Link Block */
    .link-pill {
      display: inline-block;
      background: #FFFFFF;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 8px 14px;
      font-family: var(--mono);
      font-size: 12px;
      color: var(--purple);
      text-decoration: none;
      font-weight: 500;
      margin: 6px 0;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 11px;
    }

    th {
      background: var(--wine);
      color: #FFFFFF;
      text-align: left;
      padding: 8px 12px;
      font-weight: 600;
      font-size: 11px;
      letter-spacing: 0.05em;
    }

    th:first-child { border-top-left-radius: 6px; }
    th:last-child { border-top-right-radius: 6px; }

    td {
      padding: 7px 12px;
      border-bottom: 1px solid var(--line);
      color: #3B2E36;
    }

    tr:nth-child(even) td {
      background: rgba(245, 239, 232, 0.4);
    }

    .badge-col {
      font-family: var(--mono);
      font-weight: 600;
      color: var(--wine);
    }

    /* Note Box */
    .tip-box {
      background: #FCF5E3;
      border-left: 4px solid var(--yellow);
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin-top: 14px;
      font-size: 12px;
      color: #5C4A11;
    }

    .tip-box strong {
      color: #3A2F08;
    }

    .footer {
      border-top: 1px solid var(--line);
      padding-top: 16px;
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <p class="brand-eyebrow">Sāmya: Beauty-Tech Platform</p>
        <h1>How to View Your <em>Live Survey Data</em></h1>
      </div>
      <div class="meta-tag">
        <p><strong>Status:</strong> Active & Live</p>
        <p><strong>Domain:</strong> samyaglobal.com</p>
        <p><strong>Document Ver:</strong> 1.0 (Production)</p>
      </div>
    </div>

    <div class="spectrum-bar"></div>

    <!-- Intro -->
    <p style="font-size: 14px; margin-bottom: 24px;">
      This operational guide outlines how the Sāmya founding and research team can access, monitor, and synchronize live research survey responses collected from participants on <a href="https://www.samyaglobal.com" style="color: var(--wine); font-weight: 600; text-decoration: none;">www.samyaglobal.com</a>.
    </p>

    <!-- SECTION 1 -->
    <div class="section">
      <h2 class="section-title"><span class="number-badge">1</span> Method 1: Instant Google Sheets Live Sync (Recommended)</h2>
      <div class="card card-featured">
        <p class="card-title">Real-Time Cloud Synchronization</p>
        <p>You can connect your Google Sheet to the live database in 5 seconds without installing any plugins, scripts, or add-ons. Google Sheets will automatically pull all 21 columns and refresh as participants complete their profiles.</p>
        
        <ol class="steps">
          <li>Open any Google Sheet (or create a new one at <strong>sheets.new</strong>).</li>
          <li>Click into cell <strong>A1</strong> (top-left corner).</li>
          <li>Paste the following exact formula and press <strong>Enter</strong>:</li>
        </ol>

        <div class="formula-box">
          <span>=IMPORTDATA("https://www.samyaglobal.com/api/responses")</span>
          <span class="formula-badge">PASTE IN A1</span>
        </div>

        <div class="tip-box">
          <strong>Pro-Tip for the Team:</strong> Create a separate second tab in your Google Sheet (e.g., named <em>"Analysis"</em> or <em>"Outreach Queue"</em>) that references these rows with <code>=QUERY()</code> or <code>=FILTER()</code> so you can assign shade-testing kit tracking statuses without disrupting incoming raw responses.
        </div>
      </div>
    </div>

    <!-- SECTION 2 -->
    <div class="section">
      <h2 class="section-title"><span class="number-badge">2</span> Method 2: Direct Spreadsheet Download (.CSV)</h2>
      <div class="card">
        <p class="card-title">Offline Analysis & Excel / Numbers Export</p>
        <p>If you prefer opening the dataset in Microsoft Excel, Apple Numbers, or uploading into a CRM:</p>
        <div style="margin: 12px 0;">
          <a class="link-pill" href="https://www.samyaglobal.com/api/responses" target="_blank">
            📥 https://www.samyaglobal.com/api/responses
          </a>
        </div>
        <p>Clicking this link automatically downloads the latest snapshot formatted as <code>samya_research_responses.csv</code> with proper UTF-8 character encoding.</p>
      </div>
    </div>

    <!-- SECTION 3 -->
    <div class="section">
      <h2 class="section-title"><span class="number-badge">3</span> Method 3: Live Developer JSON API</h2>
      <div class="card">
        <p class="card-title">Programmatic Access</p>
        <p>For custom analytics dashboards, database ingest pipelines, or automated email triggers:</p>
        <div style="margin: 12px 0;">
          <a class="link-pill" href="https://www.samyaglobal.com/api/responses?format=json" target="_blank">
            ⚡ https://www.samyaglobal.com/api/responses?format=json
          </a>
        </div>
        <p>Returns a standardized JSON payload with total record count and an array of individual participant objects sorted in reverse-chronological order.</p>
      </div>
    </div>

    <!-- SECTION 4 -->
    <div class="section">
      <h2 class="section-title"><span class="number-badge">4</span> Data Schema: 21 Captured Fields</h2>
      <div class="card">
        <p>Every submission captures structured data across the entire 18-screen participant journey:</p>
        <table>
          <thead>
            <tr>
              <th style="width: 45px;">Col</th>
              <th>Field Name</th>
              <th>Survey Source</th>
              <th>Example Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="badge-col">A</td>
              <td><strong>Timestamp</strong></td>
              <td>System Generated</td>
              <td>2026-11-03T04:48:21Z</td>
            </tr>
            <tr>
              <td class="badge-col">B</td>
              <td><strong>Participant ID</strong></td>
              <td>System Generated</td>
              <td>SAM-967934</td>
            </tr>
            <tr>
              <td class="badge-col">C</td>
              <td><strong>Full Name</strong></td>
              <td>Screen 2: Registration</td>
              <td>Aanya Sharma</td>
            </tr>
            <tr>
              <td class="badge-col">D</td>
              <td><strong>Email</strong></td>
              <td>Screen 2: Registration</td>
              <td>aanya@example.com</td>
            </tr>
            <tr>
              <td class="badge-col">E</td>
              <td><strong>Phone Number</strong></td>
              <td>Screen 2: Registration</td>
              <td>+91 98765 43210</td>
            </tr>
            <tr>
              <td class="badge-col">F</td>
              <td><strong>Opt-in Updates</strong></td>
              <td>Screen 2: Registration</td>
              <td>Yes / No</td>
            </tr>
            <tr>
              <td class="badge-col">G</td>
              <td><strong>State / Territory</strong></td>
              <td>Screen 3: Geography</td>
              <td>Maharashtra</td>
            </tr>
            <tr>
              <td class="badge-col">H</td>
              <td><strong>Past Experience</strong></td>
              <td>Screen 4: Pain Point</td>
              <td>Closest available shade but not right</td>
            </tr>
            <tr>
              <td class="badge-col">I</td>
              <td><strong>Biggest Challenges</strong></td>
              <td>Screen 5: Multi-chips</td>
              <td>Oxidation; Undertone mismatch</td>
            </tr>
            <tr>
              <td class="badge-col">J</td>
              <td><strong>Skin Tone Depth</strong></td>
              <td>Screen 6: Tone Tile</td>
              <td>300 / Medium Deep</td>
            </tr>
            <tr>
              <td class="badge-col">K</td>
              <td><strong>Undertone</strong></td>
              <td>Screen 7: Undertone</td>
              <td>Warm (Golden, yellow, peachy)</td>
            </tr>
            <tr>
              <td class="badge-col">L</td>
              <td><strong>Seasonal Shift</strong></td>
              <td>Screen 8: Shifts</td>
              <td>Yes, noticeably across seasons</td>
            </tr>
            <tr>
              <td class="badge-col">M</td>
              <td><strong>Testing Interest</strong></td>
              <td>Screen 9: Intent</td>
              <td>Yes, I'd love to test samples</td>
            </tr>
            <tr>
              <td class="badge-col">N</td>
              <td><strong>Completion Status</strong></td>
              <td>Screen 10 / 18</td>
              <td>Full Profile / Initial Experience</td>
            </tr>
            <tr>
              <td class="badge-col">O</td>
              <td><strong>Current Brand</strong></td>
              <td>Screen 11: Products</td>
              <td>MAC NC40, Maybelline 228</td>
            </tr>
            <tr>
              <td class="badge-col">P</td>
              <td><strong>Neck vs Face Match</strong></td>
              <td>Screen 12: Visual</td>
              <td>Face is slightly darker than neck</td>
            </tr>
            <tr>
              <td class="badge-col">Q</td>
              <td><strong>Match Priorities</strong></td>
              <td>Screen 13: Multi-chips</td>
              <td>At-home testing; No oxidation</td>
            </tr>
            <tr>
              <td class="badge-col">R</td>
              <td><strong>Skin Status Now</strong></td>
              <td>Screen 14: Sunlight</td>
              <td>Standard depth / More tanned</td>
            </tr>
            <tr>
              <td class="badge-col">S</td>
              <td><strong>Confidence</strong></td>
              <td>Screen 15: Accuracy</td>
              <td>Very confident / Guessing</td>
            </tr>
            <tr>
              <td class="badge-col">T</td>
              <td><strong>City / Town</strong></td>
              <td>Screen 16: Logistics</td>
              <td>Mumbai</td>
            </tr>
            <tr>
              <td class="badge-col">U</td>
              <td><strong>Testing Consent</strong></td>
              <td>Screen 17: Agreement</td>
              <td>Yes, happy to test and share feedback</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <span>Sāmya: Beauty-Tech Venture · Complexion Discovery Platform</span>
      <span>Confidential & Proprietary · https://www.samyaglobal.com</span>
    </div>
  </div>
</body>
</html>
`;

async function generatePdf() {
  const outputPath = path.resolve('Samya_Live_Data_Guide.pdf');
  console.log('Launching browser to render PDF...');

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('Generating PDF: ' + outputPath);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '15mm',
      right: '15mm'
    }
  });

  await browser.close();
  console.log('PDF generated successfully!');
}

generatePdf().catch(console.error);

