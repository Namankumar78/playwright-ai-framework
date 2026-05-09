import { test, expect } from '@playwright/test';
import { LabsPage } from '../pages/LabsPage';
import { LABS_DATA } from '../constants/Labs.constants';

test.describe('1mg Labs Functionality', () => {
  let labsPage: LabsPage;

  test.beforeEach(async ({ page }) => {
    labsPage = new LabsPage(page);
    await labsPage.navigate();
  });

  test('should successfully search and view CBC test details', async () => {
    await labsPage.searchForTest(LABS_DATA.validTest);
    await expect(labsPage.testTitle).toContainText(LABS_DATA.validTest);
    await expect(labsPage.bookNowButton).toBeVisible();
  });

  test('should show no results for an invalid search term', async () => {
    await labsPage.fill(labsPage.searchInput, LABS_DATA.invalidTest);
    await expect(labsPage.noResultsMessage).toBeVisible();
  });

  test('should trigger booking flow when clicking Book Now', async ({ page }) => {
    await labsPage.searchForTest(LABS_DATA.validTest);
    await labsPage.click(labsPage.bookNowButton);
    await expect(page).toHaveURL(/.*checkout|cart/);
  });
});