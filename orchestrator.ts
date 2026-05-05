import { generateTests } from './agents/generator';
import { validateTests } from './agents/validator';
import { humanApproval } from './human/approval';
import { generateAutomation } from './agents/automation';
import { analyzeFailure } from './agents/analysis';

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

async function run() {

const requirement = `
Navigate to https://www.1mg.com/labs

Test Scenario:
1. Search for "CBC"
2. Click on search button
3. Select first item from dropdown
4. Validate navigation by checking:
  - "CBC (Complete Blood Count)" text is visible
  - "Book Now" button is visible
5. If any popup appears on any screen, close it
`;

const manual = await generateTests(requirement);
const validated = await validateTests(manual);

const approved = await humanApproval(validated);
if (!approved) return console.log("Rejected by human");

const automation = await generateAutomation(validated);

console.log("Automation Output:", automation);

function toStringSafe(data: any) {
  if (typeof data === 'string') return data;
  if (data?.code) return data.code;
  return JSON.stringify(data, null, 2);
}

// ✅ Write pages
if (automation.pages && Array.isArray(automation.pages)) {
  for (const page of automation.pages) {
    const filePath = `./playwright/pages/${page.fileName}`;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, toStringSafe(page.code));
  }
}

// ✅ Write test
let testFileName = "generated.spec.ts";

if (automation.test) {
  testFileName = automation.test.fileName || testFileName;
  const testPath = `./playwright/tests/${testFileName}`;
  fs.mkdirSync(path.dirname(testPath), { recursive: true });
  fs.writeFileSync(testPath, toStringSafe(automation.test.code));
}

console.log("✅ Automation generated.");

// ==============================
// 🧪 RUN PLAYWRIGHT TESTS
// ==============================

let logs = "";

try {
  execSync(`npx playwright test --reporter=json > report.json`, {
    stdio: "inherit",
  });
  console.log("✅ Tests passed");
} catch (error) {
  console.log("❌ Tests failed");

  // Read logs
  if (fs.existsSync("report.json")) {
    logs = fs.readFileSync("report.json", "utf-8");
  }

  // ==============================
  // 🧠 AI ANALYSIS
  // ==============================
  const analysis = await analyzeFailure(logs);

  console.log("\n🧠 AI ANALYSIS:\n", analysis);

  // ==============================
  // 📊 SAVE FOR ALLURE
  // ==============================
  const allureDir = "./allure-results";
  fs.mkdirSync(allureDir, { recursive: true });

  fs.writeFileSync(
    `${allureDir}/ai-analysis.txt`,
    analysis
  );

  console.log("📊 AI analysis saved to Allure");
}

}

run();