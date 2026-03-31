import { test } from '@playwright/test';
import { LoginPage } from '../pages/login/login';

test('login test', async ({ page }) => {
    const loginPage = new LoginPage(page); // ✅ correct

    await page.goto('');
    await loginPage.login();
});