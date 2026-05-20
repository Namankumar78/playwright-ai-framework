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
      if (await locator.isVisible()) {
        await locator.click();
      }
    } catch (error) {
      console.log('No popup found');
    }
  }
}