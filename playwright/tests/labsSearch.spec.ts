import { expect, test } from '@playwright/test';
import { LabsPage } from '../pages/LabsPage';

test.describe('1mg Labs Search Functionality', () => {
  let labsPage: LabsPage;

  test.beforeEach(async ({ page }) => {
    labsPage = new LabsPage(page);
    await labsPage.navigate();
    await labsPage.closePopupIfVisible();
  });

  test('should search for valid test (CBC) and navigate to details page', async () => {
    await labsPage.searchForTest('CBC');
    await labsPage.selectFirstResult();
    await labsPage.verifyResultHeader('CBC');
    await labsPage.verifyBookNowButtonVisible();
  });

  test('should show no results for invalid/gibberish test query', async () => {
    await labsPage.searchForTest('xyz123456789');
    await expect(labsPage.noResultsMessage).toBeVisible();
  });

  test('should not trigger search on empty input', async () => {
    await labsPage.searchForTest('');
    await expect(labsPage.resultItem.first()).not.toBeVisible();
  });

  test('should be case-insensitive in search results', async () => {
    await labsPage.searchForTest('cbc');
    await expect(labsPage.resultItem.first()).toBeVisible();
  });
});