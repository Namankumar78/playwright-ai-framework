import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LabsPage extends BasePage {
  readonly searchInput: Locator;
  readonly popupCloseButton: Locator;
  readonly testTitle: Locator;
  readonly bookNowButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByPlaceholder(/Search tests/i);
    this.popupCloseButton = page.locator('[data-testid="modal-close"], .close-btn');
    this.testTitle = page.getByRole('heading', { level: 1 });
    this.bookNowButton = page.getByRole('button', { name: /Book Now/i });
    // Updated locator to be more robust, looking for heading or text container
    this.noResultsMessage = page.locator('text=/No results found/i');
  }

  async navigate() {
    await this.page.goto('https://www.1mg.com/labs');
    await this.handlePopup(this.popupCloseButton);
  }

  async searchForTest(testName: string) {
    // Ensure input is cleared and search is triggered
    await this.searchInput.fill(testName);
    await this.page.keyboard.press('Enter');
    
    // Using a more flexible filter with case insensitivity and awaiting network idle
    // to ensure the search results have been fetched and rendered
    await this.page.waitForLoadState('networkidle');
    
    const result = this.page.locator('[data-testid="search-result"]').filter({ hasText: testName }).first();
    
    // Wait for the result to be both attached and visible
    await expect(result).toBeVisible({ timeout: 15000 });
    await this.click(result);
  }

  // Backward compatibility wrapper for searchForTest if needed by other tests
  async search(testName: string) {
    await this.searchForTest(testName);
  }
}