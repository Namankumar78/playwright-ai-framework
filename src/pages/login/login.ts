import { Page } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export class LoginPage {
    constructor(private page: Page) {}

    get usernameInput() {
        return this.page.getByLabel('Username');
    }

    get passwordInput() {
        return this.page.getByLabel('Password');
    }

    get loginButton() {
        return this.page.locator('[type="submit"]');
    }

    get errorMessage() {
        return this.page.locator('#error-message');
    }

    async login(): Promise<void> {
        await this.usernameInput.fill(process.env.USERNAME!);
        await this.passwordInput.fill(process.env.PASSWORD!);
        await this.loginButton.click();
    }
}