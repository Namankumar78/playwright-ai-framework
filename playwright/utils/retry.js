// src/utils/retry.ts
import { test as base } from '@playwright/test';

type CustomFixtures = {
  softAssert: (message: string) => Promise<void>;
};

export const test = base.extend<CustomFixtures>({
  softAssert: async ({}, use) => {
    let errors: string[] = [];
    await use(async (message: string) => {
      try {
        // Your assertion
      } catch (e) {
        errors.push(message);
      }
    });
    
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }
});