import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LabsPage extends BasePage {
  // Refined locator to target the specific search input commonly used on 1mg Labs pages
  // Using a more robust selector strategy that targets the input field directly
  readonly searchInput: Locator = this.page.getByRole('textbox', { name: /Search for test or package/i })
    .or(this.page.locator('input[type="text"][placeholder*="Search"]'));
    
  readonly firstSearchResult: Locator = this.page.getByRole('listitem').filter({ hasText: /Result/i }).first();
  readonly closeButton: Locator = this.page.locator('button[aria-label="Close"], .icon-close').first();
  readonly noResultsMessage: Locator = this.page.getByText('No results found', { exact: false });

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('https://www.1mg.com/labs');
  }

  async handlePopups() {
    await this.handlePopup(this.closeButton);
  }

  async searchTest(testName: string) {
    // Playwright's fill() includes built-in actionability checks (visible, enabled, etc).
    // The previous explicit waitFor was likely failing due to an overly restrictive 
    // combobox role or locator mismatch. Using locator().fill() is best practice.
    await this.searchInput.fill(testName);
    
    // Removed the explicit waitFor as it was causing timeouts and is redundant.
    // If the search triggers a navigation or specific loading state, 
    // it should be handled in the test flow via verifySearchResultVisible.
  }

  async verifySearchResultVisible() {
    // Increased timeout to account for async search/debouncing behavior
    await expect(this.firstSearchResult).toBeVisible({ timeout: 10000 });
  }

  /**
   * Backward compatibility for potential usage in other tests
   * @deprecated use verifySearchResultVisible()
   */
  async waitForElement(locator: Locator) {
    await expect(locator).toBeVisible({ timeout: 10000 });
  }
}