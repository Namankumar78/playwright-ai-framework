import { defineConfig } from '@playwright/test';

export const aimodel = 'gemini-3.1-flash-lite-preview';

//gemini-3-flash-preview
//gemini-3.1-flash-lite-preview

export default defineConfig({
  testDir: './playwright/tests',
  outputDir: 'recordings',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 30 * 1000,

reporter: [
    ['html'],
    ['list'],
    ['allure-playwright'],
    ['json', { outputFile: 'test-results.json' }]
  ],
use: { 
    video: 'on',
    baseURL: "https://the-internet.herokuapp.com/login",
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10 * 1000,
    ignoreHTTPSErrors: true,
  },

projects: [
    {
      name: 'chromium',
    //  use: { browserName: 'chromium' },
    },
  ],
});