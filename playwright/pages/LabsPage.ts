import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LabsPage extends BasePage {
  readonly searchInput: Locator;
  readonly firstDropdownItem: Locator;
  readonly popupCloseButton: Locator;
  readonly testTitle: Locator;
  readonly bookNowButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Updated locator: Often search inputs in modern frameworks are textboxes 
    // or identified by labels or placeholders if 'combobox' fails to resolve.
    // We maintain the selector but ensure it's robust.
    this.searchInput = page.getByRole('textbox', { name: /search/i });
    this.firstDropdownItem = page.getByTestId('lab-search-item').first();
    this.popupCloseButton = page.locator('[data-testid="close-icon"]');
    this.testTitle = page.getByRole('heading');
    this.bookNowButton = page.getByRole('button', { name: 'Book Now' });
    this.noResultsMessage = page.getByText('No results found');
  }

  /**
   * Refined searchTest to ensure input is ready for interaction.
   * Playwright's fill() includes auto-waiting, but if the component is lazy-loaded,
   * we ensure the element is actionable before interaction.
   */
  async searchTest(testName: string) {
    await this.searchInput.waitFor({ state: 'attached' });
    await this.fill(this.searchInput, testName);
    await this.handlePopup(this.popupCloseButton);
    await this.click(this.firstDropdownItem);
  }

  // Backward compatibility wrapper if needed, preserving class structure
  async searchForTest(testName: string) {
    await this.searchTest(testName);
  }

  async verifySearch(testName: string) {
    await expect(this.page).toHaveURL(new RegExp(testName.toLowerCase()));
  }
}