import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config/devices';

export default defineConfig({
  outputDir: 'recordings',
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html'],
  //  ['allure-playwright'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  use: {
     video: 'on',
    baseURL: 'https://github.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'android-real',
      use: { 
        ...devices['Pixel_5'],
        ...config.androidReal
      },
    },
    {
      name: 'android-emulator',
      use: { 
        ...devices['iPhone 13 Pro Max'],
   //     ...config.androidEmulator
      },
    },
    {
      name: 'ios-real',
      use: { 
        ...devices['iPhone 14'],
        ...config.iosReal
      },
    },
    {
      name: 'browserstack-android',
      use: config.browserstackAndroid,
    },
    {
      name: 'browserstack-ios',
      use: config.browserstackiOS,
    }
  ]
});