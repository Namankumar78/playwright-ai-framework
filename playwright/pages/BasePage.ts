import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, value: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async waitForElement(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async handlePopup(locator: Locator) {
    try {
      const isVisible = await locator.first().isVisible({ timeout: 2000 });
      if (isVisible) await locator.first().click();
    } catch (error) {
      // Popup not present, proceed
    }
  }
}