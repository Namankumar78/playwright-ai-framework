import { chromium } from '@playwright/test';

export async function validateLocator(baseURL: string, locatorStrategy: string) {
  const browser = await chromium.launch();

  const page = await browser.newPage();

  try {
    await page.goto(baseURL);

    const count = await page.locator(locatorStrategy).count();

    await browser.close();

    return {
      valid: count > 0,
      count,
    };
  } catch {
    await browser.close();

    return {
      valid: false,
      count: 0,
    };
  }
}
