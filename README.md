# AI Playwright Self-Healing Framework

An AI-powered Playwright automation framework that can:

- Generate automation from manual test cases
- Reuse existing framework code
- Create Page Object Models automatically
- Heal broken locators
- Synchronize spec methods automatically
- Merge new methods into existing pages
- Run selective healing on failed pages only

---

# Features

## AI Test Generation

Generate:

- Playwright tests
- Page Object Models
- Constants
- Navigation flows

from plain English/manual test cases.

---

## Self-Healing Automation

When a test fails:

1. Framework analyzes failure logs
2. Detects failed page automatically
3. Regenerates ONLY broken page
4. Updates spec methods if method names changed
5. Re-runs failed spec

---

## Smart Spec Synchronization

If healing changes method names:

Before:

```ts
page.searchProduct();
```

After healing:

```ts
page.searchLabTest();
```

Spec files are automatically updated.

---

## Incremental Framework Generation

Framework intelligently reuses existing pages.

It will:

- merge missing methods
- avoid duplicate pages
- preserve existing code
- create only new spec files

---

## Smart Page Merging

Existing POM files are never overwritten blindly.

Framework:

- appends only missing methods
- skips duplicate methods
- preserves custom logic

---

## Selective Healing

Healing runs ONLY on:

- newly generated spec
- failed page object

Existing tests remain untouched.

---

## Automatic Validation

Framework auto-fixes:

- missing BasePage
- missing inheritance
- malformed AI structure
- invalid responses
- missing constants

before failing generation.

---

# Existing Framework Reuse

The framework reads existing pages before generation.

Behavior:

- Existing methods are preserved
- Missing methods are merged
- Duplicate methods are skipped
- Existing specs are untouched
- Only new specs are generated

---

# Selective Spec Execution

Framework runs ONLY newly generated specs during healing.

Example:

```bash
npx playwright test tests/newFeature.spec.ts
```

---

# Method Synchronization

When healing changes methods, all related spec files are automatically updated.

---

# Intelligent Failed Page Detection

Framework extracts failed page automatically from Playwright logs.

Only the failed page is healed.

---

# DOM Timeline System

Framework captures:

- page structure
- locators
- labels
- text
- roles
- placeholders

during runtime navigation.

This improves locator healing accuracy.

---

# AI Safety Rules

Framework prevents AI from:

- overwriting unrelated pages
- deleting methods
- renaming files randomly
- regenerating entire framework

---

# Project Structure

```text
playwright/
├── pages/
├── tests/
├── constants/
├── recordings/
```

---

# Installation

## Clone Repository

```bash
git clone <repo-url>
cd playwright-ai-framework
```

---

## Install Dependencies

```bash
npm install
```

---

## Install Playwright Browsers

```bash
npx playwright install
```

---

# Environment Setup

Create `.env`

```env
GOOGLE_API_KEY=your_api_key
```

---

# Run Framework

```bash
npm run start
```

---

# AI Workflow

```text
Manual Test Case
       ↓
AI Test Generation
       ↓
Navigation Planning
       ↓
DOM Timeline Capture
       ↓
Framework Generation
       ↓
Playwright Execution
       ↓
Failure Analysis
       ↓
Selective Healing
       ↓
Re-run Failed Spec
```

---

# Healing Workflow

```text
Test Failure
   ↓
Analyze Failure
   ↓
Detect Failed Page
   ↓
Heal ONLY Failed Page
   ↓
Update Spec Methods
   ↓
Re-run Failed Spec
```

---

# Supported Locator Strategies

Framework prefers:

- `getByRole()`
- `getByLabel()`
- `getByTestId()`
- `locator().filter()`

Framework avoids:

- `nth-child`
- generic div locators
- unstable CSS chains
- broad `getByText()`

---

# Troubleshooting

## Error: Failed page not found in logs

Cause:

- Playwright stack trace missing page reference

Fix:

- ensure failures occur inside POM methods
- avoid direct locators inside specs

---

## Error: Failed generating framework

Cause:

- malformed AI response

Fix:

- retry generation
- validate Gemini API key
- check AI response structure

---

# Recommended Practices

Use:

- data-testid
- accessible labels
- semantic HTML
- stable IDs

Avoid:

- nth-child
- random CSS classes
- dynamic XPath
- broad text selectors

---

# Scripts

## Start Framework

```bash
npm run start
```

## Run Playwright Tests

```bash
npx playwright test
```

---

# Technologies Used

- Playwright
- TypeScript
- Gemini AI
- MCP Observer
- Node.js

---

# Future Roadmap

- multi-page healing
- visual AI healing
- screenshot diff healing
- flaky test detection
- CI/CD integration

---

# License

MIT
