import { Page, Locator, expect } from '@playwright/test';

export class LabsPage {
  private readonly page: Page;
  readonly searchInput: Locator;
  readonly resultItem: Locator;
  readonly popupCloseButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder(/Search for test/i);
    this.resultItem = page.locator('div[class*="styles__item"]');
    this.popupCloseButton = page.locator('//div[contains(@class, "close")] | //div[@role="dialog"]//button');
    this.noResultsMessage = page.getByText('No results found');
  }

  async navigate() {
    await this.page.goto('https://www.1mg.com/labs');
  }

  async closePopupIfVisible() {
    try {
      const isVisible = await this.popupCloseButton.first().isVisible({ timeout: 2000 });
      if (isVisible) {
        await this.popupCloseButton.first().click();
      }
    } catch (e) {
      // Popup not found, continue test
    }
  }

  async searchForTest(query: string) {
    await this.searchInput.fill(query);
  }

  async selectFirstResult() {
    await this.resultItem.first().click();
  }

  async verifyResultHeader(text: string) {
    await expect(this.page.getByRole('heading')).toContainText(text, { ignoreCase: true });
  }

  async verifyBookNowButtonVisible() {
    await expect(this.page.getByRole('button', { name: 'Book Now' })).toBeVisible();
  }
}