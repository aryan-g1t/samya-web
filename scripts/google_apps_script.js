/**
 * SĀMYA: RESEARCH SURVEY WEBHOOK
 * Google Apps Script backend for receiving survey responses from https://www.samyaglobal.com
 *
 * HOW TO INSTALL IN 2 MINUTES:
 * 1. Open Google Sheets (create a new sheet named "Sāmya Research Responses")
 * 2. Click "Extensions" > "Apps Script" in the top menu
 * 3. Delete any default code, paste this entire file, and click Save (Ctrl+S / Cmd+S)
 * 4. Click "Deploy" > "New deployment"
 * 5. Under "Select type", choose "Web app"
 * 6. Set Description: "Sāmya Survey Webhook"
 * 7. Set "Execute as": "Me"
 * 8. Set "Who has access": "Anyone" (Required so your website visitors can submit)
 * 9. Click "Deploy" and Authorize access when prompted
 * 10. Copy the Web app URL (starts with https://script.google.com/macros/s/...)
 */

// Headers defining the 20 columns
const HEADERS = [
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

function setupSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#76022E"); // Sāmya Wine
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Arial");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    // Wait up to 30 seconds for concurrent requests
    lock.waitLock(30000);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheet(sheet);

    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter || {};
    }

    const row = [
      data.timestamp || new Date().toISOString(),
      data.participantId || "SAM-" + Math.floor(100000 + Math.random() * 900000),
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.optInUpdates ? "Yes" : "No",
      data.state || "",
      data.pastExperience || "",
      Array.isArray(data.biggestChallenges) ? data.biggestChallenges.join(", ") : (data.biggestChallenges || ""),
      data.skinToneDepth || "",
      data.undertone || "",
      data.seasonalShift || "",
      data.testingInterest || "",
      data.stageCompleted || "Full Profile",
      data.currentBrandAndShade || "",
      data.neckVsFace || "",
      Array.isArray(data.simplifiedMatchNeeds) ? data.simplifiedMatchNeeds.join(", ") : (data.simplifiedMatchNeeds || ""),
      data.skinStatusNow || "",
      data.selectionConfidence || "",
      data.city || "",
      data.sampleTestingConsent || ""
    ];

    sheet.appendRow(row);
    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      participantId: row[1],
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "Sāmya Survey Webhook",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
