import { test, expect } from '@playwright/test';
import { LabsPage } from '../pages/LabsPage';
import { LABS_CONSTANTS } from '../constants/Labs.constants';

test.describe('1mg Labs Search Functionality', () => {
  let labsPage: LabsPage;

  test.beforeEach(async ({ page }) => {
    labsPage = new LabsPage(page);
    await labsPage.navigate();
    await labsPage.handlePopups();
  });

  test('should search for a valid test (CBC) and show results', async () => {
    await labsPage.searchTest(LABS_CONSTANTS.VALID_TEST);
    await labsPage.verifySearchResultVisible();
    await labsPage.click(labsPage.firstSearchResult);
    
    await expect(labsPage.page.getByRole('heading', { name: /CBC/i })).toBeVisible();
    await expect(labsPage.page.getByRole('button', { name: /Book Now/i }).first()).toBeVisible();
  });

  test('should handle search with invalid/gibberish text', async () => {
    await labsPage.searchTest(LABS_CONSTANTS.INVALID_TEST);
    await expect(labsPage.noResultsMessage).toBeVisible();
  });

  test('should not trigger search with empty input', async () => {
    await labsPage.searchTest('');
    await expect(labsPage.firstSearchResult).not.toBeVisible();
  });

  test('should suggest relevant tests while typing', async () => {
    await labsPage.searchTest(LABS_CONSTANTS.PARTIAL_TEST);
    await labsPage.verifySearchResultVisible();
    const text = await labsPage.firstSearchResult.innerText();
    expect(text.toLowerCase()).toContain(LABS_CONSTANTS.PARTIAL_TEST.toLowerCase());
  });
});