import { test, expect } from '@playwright/test';
import { LabsPage } from '../pages/LabsPage';
import { LABS_CONSTANTS } from '../constants/Labs.constants';

test.describe('Labs Search Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.1mg.com/labs');
  });

  test('Should perform valid search successfully', async ({ page }) => {
    const labsPage = new LabsPage(page);
    await labsPage.searchTest(LABS_CONSTANTS.VALID_TEST);
    await labsPage.searchForTest(LABS_CONSTANTS.VALID_TEST);
    await expect(labsPage.bookNowButton).toBeVisible();
  });

  test('Should show no results for invalid search', async ({ page }) => {
    const labsPage = new LabsPage(page);
    await labsPage.fill(labsPage.searchInput, LABS_CONSTANTS.INVALID_TEST);
    await labsPage.waitForElement(labsPage.noResultsMessage);
  });
});