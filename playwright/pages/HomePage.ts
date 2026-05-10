import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly signInLink: Locator;

  constructor(page: Page) {
    super(page);
    // Updated locator to be more robust for the current GitHub homepage layout
    // GitHub often uses a specific header structure; adding a filter to ensure it's the main navigation link
    this.signInLink = page.getByRole('link', { name: 'Sign in' }).first();
  }

  async navigate() {
    await this.page.goto('https://github.com');
  }

  async clickSignIn() {
    // Ensure the page is stable and the link is interactable before clicking.
    // Added a visibility check to prevent premature click attempts.
    await expect(this.signInLink).toBeVisible({ timeout: 10000 });
    await this.signInLink.click();
  }
}