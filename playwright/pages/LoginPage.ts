import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.getByLabel('Username or email address');
    this.passwordField = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
    this.errorMessage = page.locator('#js-flash-container .flash-error');
  }

  async login(user: string, pass: string) {
    await this.fill(this.usernameField, user);
    await this.fill(this.passwordField, pass);
  }

  async clickSignInButton() {
    await this.click(this.signInButton);
  }

  async verifyErrorMessage(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}