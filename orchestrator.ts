import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import { chromium } from '@playwright/test';

import config from './playwright.config';

import { generateTests } from './agents/generator';
import { validateTests } from './agents/validator';
import { humanApproval } from './human/approval';
import { generateAutomation } from './agents/automation';
import { analyzeFailure } from './agents/analysis';
import { healAutomation } from './agents/healAutomation';
import { generateNavigationPlan } from './agents/navigationPlanner';

import { startMCPObserver, domTimeline } from './agents/mcpObserver';

// ==============================
// HELPERS
// ==============================

function cleanCodeBlock(code: string) {
  if (!code) return '';

  return code
    .replace(/```typescript/g, '')
    .replace(/```ts/g, '')
    .replace(/```javascript/g, '')
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}

function toStringSafe(data: any) {
  try {
    const content = typeof data === 'string' ? data : data?.code || JSON.stringify(data, null, 2);

    return cleanCodeBlock(content);
  } catch (err) {
    console.log('❌ Failed converting content:', err);

    return '';
  }
}

function writeFileSafe(filePath: string, content: string) {
  try {
    fs.mkdirSync(path.dirname(filePath), {
      recursive: true,
    });

    fs.writeFileSync(filePath, cleanCodeBlock(content), 'utf-8');

    console.log(`✅ File written: ${filePath}`);
  } catch (err) {
    console.log(`❌ Failed writing file: ${filePath}`);

    console.log(err);
  }
}

// ==============================
// METHOD EXTRACTION
// ==============================

function extractMethods(code: string) {
  const methods: string[] = [];

  const regex = /async\s+([a-zA-Z0-9_]+)\s*\(/g;

  let match;

  while ((match = regex.exec(code))) {
    methods.push(match[1]);
  }

  return methods;
}

// ==============================
// UPDATE SPEC METHODS
// ==============================

function updateSpecMethods(oldCode: string, newCode: string, targetSpec?: string) {
  const testsDir = './playwright/tests';

  if (!fs.existsSync(testsDir)) {
    return;
  }

  const oldMethods = extractMethods(oldCode);

  const newMethods = extractMethods(newCode);

  const files = targetSpec ? [targetSpec] : fs.readdirSync(testsDir);

  for (const file of files) {
    const fullPath = path.join(testsDir, file);

    if (!fs.existsSync(fullPath)) {
      continue;
    }

    let spec = fs.readFileSync(fullPath, 'utf-8');

    oldMethods.forEach((oldMethod, index) => {
      const newMethod = newMethods[index];

      if (!newMethod || oldMethod === newMethod) {
        return;
      }

      console.log(`♻️ Updating spec method: ${oldMethod} → ${newMethod}`);

      spec = spec.replace(new RegExp(`\\.${oldMethod}\\(`, 'g'), `.${newMethod}(`);
    });

    fs.writeFileSync(fullPath, spec, 'utf-8');
  }
}

// ==============================
// MERGE PAGE METHODS
// ==============================

function mergePageContent(existingCode: string, newCode: string) {
  try {
    const existingMethods = extractMethods(existingCode);

    const methodRegex = /async\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{[\s\S]*?\n\s*\}/g;

    const methodsToAdd: string[] = [];

    let match;

    while ((match = methodRegex.exec(newCode))) {
      const methodBlock = match[0];

      const nameMatch = methodBlock.match(/async\s+([a-zA-Z0-9_]+)\s*\(/);

      if (!nameMatch) continue;

      const methodName = nameMatch[1];

      if (!existingMethods.includes(methodName)) {
        methodsToAdd.push(methodBlock);
      }
    }

    if (methodsToAdd.length === 0) {
      return existingCode;
    }

    const insertIndex = existingCode.lastIndexOf('}');

    if (insertIndex === -1) {
      return existingCode;
    }

    return `
${existingCode.slice(0, insertIndex)}

  /* ===== AI GENERATED METHODS ===== */

${methodsToAdd.join('\n\n')}

}
`.trim();
  } catch (err) {
    console.log('❌ Failed merging page:', err);

    return existingCode;
  }
}

// ==============================
// PAGE WRITER
// ==============================

function writeOrMergePage(filePath: string, content: string) {
  const cleaned = cleanCodeBlock(content);

  if (!fs.existsSync(filePath)) {
    writeFileSafe(filePath, cleaned);

    console.log(`🆕 Created new page: ${path.basename(filePath)}`);

    return;
  }

  const existingCode = fs.readFileSync(filePath, 'utf-8');

  const mergedCode = mergePageContent(existingCode, cleaned);

  writeFileSafe(filePath, mergedCode);

  console.log(`♻️ Updated existing page: ${path.basename(filePath)}`);
}

// ==============================
// UNIQUE SPEC FILE
// ==============================

function generateUniqueSpecName(originalName: string) {
  const ext = path.extname(originalName);

  const base = path.basename(originalName, ext);

  let finalName = originalName;

  let counter = 1;

  while (fs.existsSync(`./playwright/tests/${finalName}`)) {
    finalName = `${base}-${counter}${ext}`;

    counter++;
  }

  return finalName;
}

// ==============================
// FAILED PAGE DETECTION
// ==============================

function getFailedPageFromLogs(logs: string) {
  const matches = [...logs.matchAll(/playwright[\\/]+pages[\\/]+([^\\/"'\s]+\.ts)/gi)];

  const pages = matches.map((m) => m[1]).filter((name) => !name.toLowerCase().includes('basepage'));

  if (pages.length === 0) {
    throw new Error('❌ Failed page not found in logs');
  }

  return pages[0];
}

// ==============================
// GENERATION
// ==============================

async function generateWithValidation(input: string, max = 3) {
  let lastError: any;

  for (let i = 0; i < max; i++) {
    try {
      console.log(`🚀 Generation attempt ${i + 1}`);

      const automation = await generateAutomation(input);

      // DEBUG
      console.log('🧠 RAW AI RESPONSE:\n', JSON.stringify(automation, null, 2));

      // ==============================
      // BASIC VALIDATION
      // ==============================

      if (!automation) {
        throw new Error('AI returned empty response');
      }

      if (!automation.pages || !Array.isArray(automation.pages)) {
        throw new Error('Pages missing in AI response');
      }

      if (automation.pages.length === 0) {
        throw new Error('No pages generated');
      }

      // ==============================
      // Ensure BasePage exists
      // ==============================

      const hasBasePage = automation.pages.some((p: any) =>
        p.fileName?.toLowerCase().includes('basepage')
      );

      if (!hasBasePage) {
        console.log('⚠️ Injecting default BasePage');

        automation.pages.unshift({
          fileName: 'BasePage.ts',
          code: `
        import { Page, Locator } from '@playwright/test';

        export class BasePage {

          constructor(
            protected page: Page
          ) {}

          async click(locator: Locator) {
            await locator.click();
          }

          async fill(
            locator: Locator,
            value: string
          ) {
            await locator.fill(value);
          }

          async waitForElement(
            locator: Locator
          ) {
            await locator.waitFor({
              state: 'visible'
            });
          }
        }
        `,
        });
      }

      // ==============================
      // FIX PAGE INHERITANCE
      // ==============================

      automation.pages = automation.pages.map((p: any) => {
        if (p.fileName.toLowerCase().includes('basepage')) {
          return p;
        }

        if (!p.code.includes('extends BasePage')) {
          console.log(`⚠️ Fixing inheritance in ${p.fileName}`);

          p.code = p.code.replace(/export class (\w+)/, 'export class $1 extends BasePage');

          if (!p.code.includes('from \'./BasePage\'')) {
            p.code = 'import { BasePage } from \'./BasePage\';\n\n' + p.code;
          }
        }

        return p;
      });

      // ==============================
      // Ensure constants
      // ==============================

      if (!automation.constants) {
        automation.constants = [];
      }

      // ==============================
      // Ensure test exists
      // ==============================

      if (!automation.test) {
        throw new Error('Test file missing');
      }

      console.log('✅ Framework validation passed');

      return automation;
    } catch (err) {
      lastError = err;

      console.log(`⚠️ Generation attempt ${i + 1} failed`);

      console.log(err);
    }
  }

  throw new Error(`❌ Failed generating framework\n${lastError}`);
}

// ==============================
// WRITE FILES
// ==============================

async function writeAutomationFiles(automation: any) {
  let generatedSpec = '';

  // Pages
  for (const page of automation.pages || []) {
    const filePath = `./playwright/pages/${page.fileName}`;

    writeOrMergePage(filePath, toStringSafe(page.code));
  }

  // Test
  if (automation.test) {
    const uniqueName = generateUniqueSpecName(automation.test.fileName || 'generated.spec.ts');

    generatedSpec = uniqueName;

    writeFileSafe(`./playwright/tests/${uniqueName}`, toStringSafe(automation.test.code));

    console.log(`🧪 Test created: ${uniqueName}`);
  }

  // Constants
  for (const constant of automation.constants || []) {
    writeFileSafe(`./playwright/constants/${constant.fileName}`, toStringSafe(constant.code));
  }

  return {
    generatedSpec,
  };
}

// ==============================
// BUILD DOM TIMELINE
// ==============================

async function buildDOMTimeline(navigationPlan: any) {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  const context = await browser.newContext({
    viewport: null,
  });

  const page = await context.newPage();

  await startMCPObserver(page);

  const baseURL = config.use?.baseURL || '';

  try {
    const startUrl = `${baseURL}${navigationPlan.startUrl || ''}`;

    console.log(`🚀 Opening: ${startUrl}`);

    await page.goto(startUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForLoadState('networkidle');

    for (const step of navigationPlan.steps || []) {
      try {
        console.log(`🚀 Executing Step: ${JSON.stringify(step)}`);

        switch (step.action) {
        case 'fill': {
          const locator = page.locator(step.selector || 'input').first();

          await locator.waitFor({
            state: 'visible',
            timeout: 10000,
          });

          await locator.fill(step.value || '');

          break;
        }

        case 'press': {
          await page.keyboard.press(step.key || 'Enter');

          break;
        }

        case 'click': {
          let locator;

          if (step.role && step.name) {
            locator = page.getByRole(step.role, {
              name: step.name,
            });
          } else if (step.text) {
            locator = page.getByText(step.text);
          } else if (step.selector) {
            locator = page.locator(step.selector);
          }

          if (!locator) {
            continue;
          }

          const first = locator.first();

          await first.waitFor({
            state: 'visible',
            timeout: 10000,
          });

          await first.click();

          break;
        }

        case 'navigate': {
          const url = `${baseURL}${step.url}`;

          await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
          });

          break;
        }
        }

        await page.waitForTimeout(2000);
      } catch (err) {
        console.log(`❌ Step Failed: ${JSON.stringify(step)}`);

        console.log(err);
      }
    }
  } catch (err) {
    console.log('❌ Timeline build failed:', err);
  } finally {
    await browser.close();
  }

  return domTimeline;
}

// ==============================
// RUN TESTS
// ==============================

async function runPlaywrightTests(specFile: string) {
  try {
    execSync(`npx playwright test ./playwright/tests/${specFile} --reporter=json > report.json`, {
      stdio: 'inherit',
    });

    return {
      passed: true,
      logs: '',
    };
  } catch {
    const logs = fs.existsSync('report.json') ? fs.readFileSync('report.json', 'utf-8') : '';

    return {
      passed: false,
      logs,
    };
  }
}

// ==============================
// HEALING
// ==============================

async function healFramework(logs: string, timeline: any[], specFile: string) {
  const analysis = await analyzeFailure(logs);

  console.log('\n🧠 AI ANALYSIS:\n', analysis);

  const failedPage = getFailedPageFromLogs(logs);

  const fullPath = `./playwright/pages/${failedPage}`;

  const currentPageCode = fs.readFileSync(fullPath, 'utf-8');

  const healedPage = await healAutomation(logs, analysis, timeline, currentPageCode, failedPage);

  const cleanedHealedPage = cleanCodeBlock(healedPage);

  // Update spec methods automatically
  updateSpecMethods(currentPageCode, cleanedHealedPage, specFile);

  writeFileSafe(fullPath, cleanedHealedPage);

  console.log(`✅ Healed page: ${failedPage}`);
}

// ==============================
// EXISTING PAGES
// ==============================

function readExistingPages() {
  const pagesDir = './playwright/pages';

  if (!fs.existsSync(pagesDir)) {
    return [];
  }

  return fs.readdirSync(pagesDir).map((file) => {
    const fullPath = path.join(pagesDir, file);

    return {
      fileName: file,
      code: fs.readFileSync(fullPath, 'utf-8'),
    };
  });
}

// ==============================
// MAIN FLOW
// ==============================

async function run() {
  const promptPath = path.resolve('prompts/manualTest.prompt.txt');

  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  const manual = await generateTests(promptTemplate);

  const validated = await validateTests(manual);

  const approved = await humanApproval(validated);

  if (!approved) {
    console.log('❌ Rejected by human');

    return;
  }

  const plan = await generateNavigationPlan(validated);

  const timeline = await buildDOMTimeline(plan);

  const existingPages = readExistingPages();

  const enrichedInput = `
TEST CASE:
${validated}

EXISTING FRAMEWORK:
${JSON.stringify(existingPages, null, 2)}

RULES:
- Reuse existing pages if relevant
- Do NOT duplicate methods
- Add ONLY missing methods
- Create NEW spec file only
- Do NOT modify existing specs
- Use existing pages if possible

DOM TIMELINE:
${JSON.stringify(timeline, null, 2)}

IMPORTANT:
- Use Playwright TS
- Use BasePage
- Use constants
- Use unique locators only
`;

  const automation = await generateWithValidation(enrichedInput);

  const generatedFiles = await writeAutomationFiles(automation);

  console.log('✅ Automation generated');

  let result = await runPlaywrightTests(generatedFiles.generatedSpec);

  let retries = 1;

  while (!result.passed && retries > 0) {
    console.log(`⚠️ Healing retries left: ${retries}`);

    await healFramework(result.logs, timeline, generatedFiles.generatedSpec);

    result = await runPlaywrightTests(generatedFiles.generatedSpec);

    retries--;
  }

  if (result.passed) {
    console.log('✅ Tests passed successfully');
  } else {
    console.log('❌ Failed after max retries');
  }
}

run();
