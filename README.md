# AI Playwright Self-Healing Framework

# An AI-powered Playwright automation framework capable of:

- Generating Playwright automation from manual test cases
- Executing browser steps using Playwright MCP
- Capturing real DOM locator intelligence
- Creating reusable Page Object Models
- Reusing existing framework components
- Automatically healing broken locators
- Updating spec methods during healing
- Running selective healing on failed pages only

==================================================
# ARCHITECTURE FLOW
==================================================

Manual Test
    ↓
Validation Agent
    ↓
Navigation Planner
    ↓
MCP Browser Execution
    ↓
DOM Timeline Capture
    ↓
Automation Generator
    ↓
Playwright Execution
    ↓
Failure Analysis
    ↓
Self Healing
    ↓
Spec Synchronization

==================================================
# FEATURES
==================================================

# AI Test Generation

Generate:
- Playwright tests
- Page Object Models
- Constants
- Navigation flows
- Assertions
- Reusable methods

from plain English/manual test cases.

==================================================
# MCP BROWSER EXECUTION
==================================================

# Before generating automation:

1. AI creates navigation plan
2. Playwright MCP executes steps
3. Framework captures:
   - real locators
   - DOM structure
   - roles
   - labels
   - placeholders
   - test IDs
4. AI uses real browser intelligence for generation

This drastically improves locator quality.

==================================================
# DOM TIMELINE INTELLIGENCE
==================================================

# Framework captures:

{
  action: "click",

  element: {
    role: "button",
    text: "Login",
    testId: "login-btn",
    placeholder: null,
    label: null,
    css: "button.submit-btn",
    xpath: "//button[text()='Login']"
  }
}

This allows AI to generate stable Playwright locators.

==================================================
# LOCATOR PRIORITY RULES
==================================================

# Framework always prefers:

1. getByTestId()
2. getByRole()
3. getByLabel()
4. getByPlaceholder()
5. locator('#id')
6. locator('.class')
7. xpath as last fallback

# Avoided selectors:

- nth-child
- absolute xpath
- generic div selectors
- weak getByText()

==================================================
# SMART PAGE REUSE
==================================================

# Framework:
- reuses existing pages
- merges only missing methods
- avoids duplicate code
- creates new pages only if required

==================================================
# SMART SPEC SYNCHRONIZATION
==================================================

If healing changes method names:

Before:
page.searchProduct()

After healing:
page.searchForProduct()

Framework automatically updates:
- generated spec file
- healed spec references

No manual changes required.

==================================================
# SELECTIVE HEALING
==================================================

# When a test fails:

Framework:
1. analyzes Playwright logs
2. detects failed page
3. heals ONLY failed page
4. updates locators
5. synchronizes spec methods
6. reruns failed spec

Existing pages remain untouched.

==================================================
# FAILURE ANALYSIS AI
==================================================

# AI analyzes:
- selector failures
- timing issues
- assertions
- navigation failures
- API issues
- stale elements
- detached DOM
- environment issues

Returns:

{
  "rootCause": "",
  "category": "",
  "confidence": "",
  "failedPage": "",
  "failedLocator": "",
  "recommendedLocator": "",
  "fixSuggestion": ""
}

==================================================
# FOLDER STRUCTURE
==================================================

project/

├── agents/
├── prompts/
├── playwright/
│   ├── pages/
│   ├── tests/
│   ├── constants/
│
├── orchestrator.ts
├── playwright.config.ts
└── README.md

==================================================
# IMPORTANT COMPONENTS
==================================================

# generateTests()
- Generates manual test cases from prompts

# validateTests()
- Improves:
  - clarity
  - assertions
  - edge cases
  - navigation
  - automation readiness

# generateNavigationPlan()
- Converts manual tests into executable browser actions

Example:

{
  "startUrl": "/login",
  "steps": [
    {
      "action": "fill",
      "selector": "#username",
      "value": "admin"
    }
  ]
}

# buildDOMTimeline()
- Executes navigation plan in real browser
- Captures:
  - locators
  - roles
  - labels
  - placeholders
  - text
  - test IDs
  - DOM metadata

# generateAutomation()
- Creates:
  - Playwright spec
  - Page Objects
  - constants
  - reusable methods

# healFramework()
- Self-heals failed automation
- Updates spec methods automatically

==================================================
# PROMPT ARCHITECTURE
==================================================

# Generate Prompt
- Playwright code generation
- POM creation
- modular architecture

# Validation Prompt
- atomic actions
- assertions
- edge cases
- automation-friendly steps

# Enrich Prompt
Provides:
- DOM timeline
- locator rules
- framework rules
- existing framework context

==================================================
# RUN FRAMEWORK
==================================================

Install dependencies:

npm install

Install Playwright:

npx playwright install

Run framework:

npm run start

==================================================
# HEALING FLOW
==================================================

Test Failure
    ↓
Analyze Logs
    ↓
Detect Failed Page
    ↓
Heal Page
    ↓
Update Spec Methods
    ↓
Rerun Failed Spec

==================================================
# MCP CONFIGURATION
==================================================

{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "playwright",
        "run-test-mcp-server"
      ]
    }
  }
}

==================================================
# FUTURE AI CAPABILITIES
==================================================

# Possible future enhancements:

- fully autonomous testing
- self-maintaining automation
- visual validation AI
- API contract healing
- auto-generated assertions
- autonomous regression packs
- flaky test detection
- AI bug triaging
- root cause clustering
- smart retry systems

==================================================
# BEST PRACTICES
==================================================

# Recommended:
- use data-testid
- use reusable methods
- use atomic test steps
- keep assertions explicit
- avoid unstable selectors

# Avoid:
- sleeps
- nth-child
- weak locators
- duplicate page methods

==================================================
# AUTHOR
==================================================

Naman Kumar