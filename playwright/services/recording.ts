// src/utils/recording.ts
import ffmpeg from 'fluent-ffmpeg';
import { test as base } from '@playwright/test';

export const test = base.extend<{
  recordVideo: string;
  takeScreenshot: string;
}>({
  recordVideo: async (_, use) => {
    await use('recording.mp4');
  },

  takeScreenshot: async ({ page }, use) => {
    const screenshot = await page.screenshot({ fullPage: true });
    await use(screenshot.toString('base64'));
  },
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    // Attach video recording
    await testInfo.attach('video', {
      body: await page.video()?.path(),
      contentType: 'video/mp4',
    });

    // Generate thumbnail
    ffmpeg(await page.video()?.path()).screenshots({
      timestamps: ['1%'],
      filename: 'thumbnail.png',
      folder: 'allure-results',
    });
  }
});
