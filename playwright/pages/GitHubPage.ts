import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class GitHubPage extends BasePage {
  readonly loginLink: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly searchInput: Locator;
  readonly errorMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.loginLink = page.getByRole('link', { name: 'Sign in' });
    this.usernameInput = page.getByLabel('Username or email address');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
    // This locator targets the search button trigger
    this.searchInput = page.getByPlaceholder('Search or jump to...');
    this.errorMsg = page.locator('.flash-error');
  }

  async navigate() {
    await this.page.goto('https://github.com');
  }

  async login(username: string, password: string) {
    await this.click(this.loginLink);
    await this.fill(this.usernameInput, username);
    
    // Ensure the password field is enabled before attempting to fill it
    // GitHub often keeps fields disabled until the previous input is validated
    await expect(this.passwordInput).toBeEnabled({ timeout: 10000 });
    await this.fill(this.passwordInput, password);
    await this.click(this.signInButton);
  }

  async search(query: string) {
    // The search bar is a button that opens a dialog/input
    await this.click(this.searchInput);
    
    // Target the actual search input inside the expanded search modal
    const actualSearchInput = this.page.getByRole('combobox', { name: 'Search' });
    await expect(actualSearchInput).toBeVisible();
    await this.fill(actualSearchInput, query);
    await actualSearchInput.press('Enter');
  }
}