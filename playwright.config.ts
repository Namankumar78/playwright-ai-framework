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
     baseURL: "https://the-internet.herokuapp.com/login",
     trace: 'on-first-retry',
     screenshot: 'only-on-failure',
    // launchOptions: {
    //   slowMo: 100,
    // },
  },
  projects: [
    //{
    //   name: 'android-real',
    //   use: { 
    //     ...devices['Pixel_5'],
    //     ...config.androidReal
    //   },
    // },
    // {
    //   name: 'android-emulator',
    //   use: { 
    //     ...devices['Pixel 5'],
    //     ...config.androidEmulator
    //   },
    // },
    // {
    //   name: 'ios-real',
    //   use: { 
    //     ...devices['iPhone 14'],
    //     ...config.iosReal
    //   },
    // },
    {
      name: 'chrome-web',
      use: { 
        //...devices['Desktop Chrome'],
      },
    },
    // {
    //   name: 'browserstack-android',
    //   use: config.browserstackAndroid,
    // },
    // {
    //   name: 'browserstack-ios',
    //   use: config.browserstackiOS,
    // }
  ]
});