import { test, expect } from '@playwright/test';
import { GitHubPage } from '../pages/GitHubPage';
import { GITHUB_CREDENTIALS } from '../constants/GitHub.constants';

test.describe('GitHub Feature Flows', () => {
  
  test.describe('Search Functionality', () => {
    test('should allow user to perform a search', async ({ page }) => {
      const gitHubPage = new GitHubPage(page);
      await gitHubPage.navigate();
      await gitHubPage.search('playwright');
      await expect(page).toHaveURL(/search/);
    });
  });

  test.describe('Authentication Security', () => {
    test('should show error for invalid credentials', async ({ page }) => {
      const gitHubPage = new GitHubPage(page);
      await gitHubPage.navigate();
      await gitHubPage.login(GITHUB_CREDENTIALS.invalidUser, GITHUB_CREDENTIALS.invalidPass);
      await gitHubPage.waitForElement(gitHubPage.errorMsg);
      await expect(gitHubPage.errorMsg).toBeVisible();
    });

    test('should not allow login with empty fields', async ({ page }) => {
      const gitHubPage = new GitHubPage(page);
      await gitHubPage.navigate();
      await gitHubPage.click(gitHubPage.loginLink);
      await gitHubPage.click(gitHubPage.signInButton);
      await expect(gitHubPage.usernameInput).toBeFocused();
    });
  });
});