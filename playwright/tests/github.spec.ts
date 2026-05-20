import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { LOGIN_DATA } from '../constants/Login.constants';

test.describe('GitHub Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
  });

  test('should successfully sign in with valid credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.clickSignIn();
    await loginPage.login(LOGIN_DATA.validUser, LOGIN_DATA.validPass);
    await loginPage.clickSignInButton();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.clickSignIn();
    await loginPage.login(LOGIN_DATA.invalidUser, LOGIN_DATA.invalidPass);
    await loginPage.clickSignInButton();
    await loginPage.verifyErrorMessage(LOGIN_DATA.errorText);
  });

  test('should show validation error when fields are empty', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.clickSignIn();
    await loginPage.clickSignInButton();
    await expect(loginPage.usernameField).toBeFocused();
  });
});
