const payload = {
  fullName: "Aanya Sharma",
  email: "aanya@example.com",
  phone: "+91 98765 43210",
  optInUpdates: true,
  state: "Maharashtra",
  city: "Mumbai",
  pastExperience: "I bought the closest available shade, but it wasn't quite right.",
  biggestChallenges: ["The shade looks different after wearing it.", "Difficult to identify my undertone"],
  skinToneDepth: "300 / Medium Deep",
  undertone: "Warm (Golden, yellow, peachy undertones)",
  seasonalShift: "Yes, noticeably across seasons",
  testingInterest: "Yes, I'd love to test samples on my skin",
  stageCompleted: "Full Profile",
  currentBrandAndShade: "MAC NC40",
  neckVsFace: "My face is slightly darker than my neck",
  simplifiedMatchNeeds: ["Testing at home in natural light", "A formula that doesn't oxidize darker"],
  skinStatusNow: "About average / my standard depth",
  selectionConfidence: "Very confident",
  sampleTestingConsent: "Yes, I am happy to test and share honest feedback"
};

async function test() {
  console.log("Submitting test payload to https://www.samyaglobal.com/api/submit...");
  const res = await fetch("https://www.samyaglobal.com/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log("Submit Response:", data);

  console.log("\nFetching live CSV from https://www.samyaglobal.com/api/responses...");
  const csvRes = await fetch("https://www.samyaglobal.com/api/responses");
  const csvText = await csvRes.text();
  console.log("CSV Preview:\n", csvText);
}

test().catch(console.error);
