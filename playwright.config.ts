import { defineConfig } from '@playwright/test';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
export const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
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

  reporter: [['html'], ['list'], ['allure-playwright'], ['json', { outputFile: 'report.json' }]],
  use: {
    video: 'on',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    baseURL: process.env.BASE_URL,
    headless: process.env.HEADLESS === 'true',
    viewport: null,
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO) || 0,
      args: ['--start-maximized'],
    },
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
