import { test, expect } from '@playwright/test';
import { healAndFill, healAndClick, healAndWait } from '../utils/locator-cache';

test.describe('Amazon Search', () => {
  test('should search for products on amazon', async ({ page }) => {
    await page.goto('https://www.amazon.in/');

// 1. Fill search input with 'electronics'
await healAndFill(
  page,                    // ← Playwright page object
  '[placeholder="Search Amazon.in"]',   // ← Primary selector to try
  'electronics',           // ← Value to fill into the input
  'search-input'           // ← Cache key for this element
);
//await page.locator('[placeholder="Search Amazon.in"]').fill('EFOWEUTIOJHWERGE'); // Press Enter to submit search
//await page.waitForTimeout(50000); 
//await page.press('input', 'Enter');
await page.waitForTimeout(5000); // Wait for search results to load
  });
});
