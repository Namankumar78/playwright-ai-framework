import { test, expect } from '@playwright/test';
import { LabsPage } from '../pages/LabsPage';
import { constant } from '../constants/Labs.constants';
import config from '../../playwright.config';

test.describe('Labs Search Functionality', () => {
  let labsPage: LabsPage;

  test.beforeEach(async ({ page }) => {
    labsPage = new LabsPage(page);
    await page.goto(`${config.use?.baseURL || ''}/labs`);
    await labsPage.handlePopup();
  });

  test('should navigate and verify CBC test details', async () => {
    await labsPage.searchForTest(constant.searchText);
    await labsPage.selectFirstResult();
    await labsPage.verifyTestPage(constant.CBCTestName);
  });

  test('Edge Case: Search with trailing spaces and mixed case', async () => {
    await labsPage.searchForTest('  cbC  ');
    await labsPage.selectFirstResult();
    await labsPage.verifyTestPage('CBC');
  });

  test('Negative Case: Search for non-existent test', async () => {
    await labsPage.searchForTest('NONEXISTENTTEST');
    await labsPage.verifyNoResults();
  });

  test('Edge Case: Empty Search', async () => {
    await labsPage.searchForTest('');
    await labsPage.verifyResultsCount(3);
  });
});