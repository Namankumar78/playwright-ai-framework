import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async click(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, value: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async waitForElement(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async handlePopup(locator: Locator) {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      await locator.click();
    } catch (error) {
      console.log('Popup not found or already closed');
    }
  }
}