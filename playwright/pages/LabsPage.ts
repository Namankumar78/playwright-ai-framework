import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LabsPage extends BasePage {
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly dropdownResults: Locator;
  private readonly bookNowButton: Locator;
  private popupClose = this.page.getByRole('button', { name: 'Close' });

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByPlaceholder('Search tests or full body checkups');
    this.searchButton = page.locator('img[alt*="Search Icon"]');
    this.dropdownResults = page.locator('//*[@role="listbox"]/a');
    this.bookNowButton = this.page.getByRole('button', { name: /BOOK/ }).first();;
  }

  async handlePopup() {
    await super.handlePopup(this.popupClose);
  }

  async searchForTest(testName: string) {
    await this.fill(this.searchInput, testName);
    await this.click(this.searchButton);
  }

  async selectFirstResult() {
    await this.click(this.dropdownResults.first());
  }
async verifyNoResults() {
    await expect(this.dropdownResults).toHaveCount(0);
  }
  async verifyTestPage(expectedTitle: string) {
    await expect(this.bookNowButton).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText(expectedTitle).first()).toBeVisible({ timeout: 10000 });
  }

    async verifyResultsCount(count: number) {
    await expect(this.dropdownResults).toHaveCount(count);
  }
}