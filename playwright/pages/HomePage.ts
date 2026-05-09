import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly popupCloseButton: Locator = this.page.getByLabel('Close');
  readonly consultDoctorsButton: Locator = this.page.getByRole('link', { name: /consult doctors/i });
  readonly mobileMenuButton: Locator = this.page.getByRole('button', { name: /menu/i });

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('/');
  }

  async closePopup() {
    await this.handlePopup(this.popupCloseButton);
  }

  /**
   * Clicks the consult doctors link, handling mobile responsive state if necessary.
   */
  async clickConsultDoctors() {
    // Wait for the page to reach a stable state before checking menu visibility
    await this.page.waitForLoadState('domcontentloaded');

    // Check if we are in a mobile state where the menu is collapsed.
    // Use isVisible on the mobile menu button and ensure it's not hidden by other overlays.
    const isMobile = await this.mobileMenuButton.isVisible();
    
    if (isMobile) {
      await this.mobileMenuButton.click();
      // After clicking the menu, allow a small tick for the animation/state change
      // to ensure the hidden link becomes accessible in the DOM
      await this.page.waitForTimeout(500); 
    }
    
    // Ensure the button is actionable before clicking with an extended timeout 
    // to account for mobile menu transition animations and potential rendering latency
    await this.consultDoctorsButton.waitFor({ 
      state: 'attached', 
      timeout: 15000 
    });
    
    await this.click(this.consultDoctorsButton);
  }
}