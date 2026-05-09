import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(locator: Locator) {
    await locator.click();
  }

  async fill(locator: Locator, value: string) {
    await locator.fill(value);
  }

  async waitForElement(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async handlePopup(locator: Locator) {
    try {
      await locator.click({ timeout: 3000 });
    } catch (e) {
      // Popup not found, ignore
    }
  }
}