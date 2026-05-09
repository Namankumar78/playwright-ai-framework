# AI Playwright Self-Healing Framework

An AI-powered Playwright automation framework that can:

- Generate automation from manual test cases
- Reuse existing framework code
- Create Page Object Models automatically
- Heal broken locators
- Synchronize spec methods automatically
- Merge new methods into existing pages
- Run selective healing on failed pages only

----

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
page.searchProduct()