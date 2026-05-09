import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Doctor Consultation Flow', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test('should navigate to consultation page successfully', async ({ page }) => {
    await homePage.closePopup();
    await homePage.clickConsultDoctors();
    await expect(page).toHaveURL(/.*consult/);
  });

  test('should verify responsive layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.closePopup();
    await homePage.clickConsultDoctors();
    await expect(page).toHaveURL(/.*consult/);
  });
});