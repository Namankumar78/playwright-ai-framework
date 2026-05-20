import { Page, Locator } from '@playwright/test';

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
    await locator.waitFor({ state: 'visible' });
  }

  async handlePopup(locator: Locator) {
    try {
      if (await locator.isVisible({ timeout: 5000 })) {
        await locator.click();
      }
    } catch (e) {
      // Popup not found, continue execution
    }
  }
}
