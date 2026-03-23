import { Page, Locator } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'locators', 'cache.json');

interface CacheEntry {
  [key: string]: string[]; // key -> array of working selectors
}

/**
 * Load cached selectors from disk
 */
function loadCache(): CacheEntry {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch (e) {
    // Ignore cache read errors
  }
  return {};
}

/**
 * Save selector to cache
 */
function saveToCache(key: string, selector: string) {
  const cache = loadCache();
  
  if (!cache[key]) cache[key] = [];
  
  // Move to front (most recently used)
  cache[key] = [
    selector,
    ...cache[key].filter(s => s !== selector)
  ];
  
  // Keep only top 3 selectors per key
  cache[key] = cache[key].slice(0, 3);
  
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Get cached selectors for a key
 */
export function getCachedSelectors(key: string): string[] {
  const cache = loadCache();
  return cache[key] || [];
}

/**
 * Try selector with fallbacks
 * Returns the first working selector
 */
export async function trySelector(
  page: Page,
  primarySelector: string,
  key?: string,
  timeout: number = 3000
): Promise<{ selector: string; found: boolean }> {
  // Build list of selectors to try
  const selectorsToTry = [primarySelector];
  
  // Add cached selectors
  if (key) {
    selectorsToTry.push(...getCachedSelectors(key));
  }
  
  // Add common fallback patterns
  if (primarySelector.includes('[') && primarySelector.includes(']')) {
    // Extract attribute patterns for fallbacks
    if (primarySelector.includes('data-testid') || primarySelector.includes('data-test')) {
      selectorsToTry.push('[data-testid*="' + extractId(primarySelector) + '"]');
    }
    if (primarySelector.toLowerCase().includes('placeholder')) {
      const placeholderValue = extractAttrValue(primarySelector);
      if (placeholderValue) {
        selectorsToTry.push('input[placeholder*="' + placeholderValue + '"]');
        selectorsToTry.push('input[placeholder*="' + placeholderValue.substring(0, 5) + '"]');
      }
    }
    // For input[type="..."], try other input variations
    if (primarySelector.includes('input') && primarySelector.includes('type')) {
      selectorsToTry.push('input[type="search"]');
      selectorsToTry.push('input[type="text"]');
      selectorsToTry.push('input[autocomplete="off"]');
      selectorsToTry.push('input');
      selectorsToTry.push('input:first-of-type');
    }
  }
  
  // Generic fallbacks for search inputs
  if (primarySelector.includes('input') && key === 'search-input') {
    selectorsToTry.push('input[type="search"]');
    selectorsToTry.push('input[aria-label*="search" i]');
    selectorsToTry.push('input[name*="search" i]');
    selectorsToTry.push('input[class*="search" i]');
    selectorsToTry.push('input[role="combobox"]');
    selectorsToTry.push('[role="searchbox"]');
    selectorsToTry.push('input[autocomplete="off"]');
    selectorsToTry.push('textarea');
    selectorsToTry.push('[contenteditable="true"]');
    selectorsToTry.push('input');  // Last resort: any input
  }
  
  // Try each selector
  for (const selector of selectorsToTry) {
    try {
      const locator = page.locator(selector);
      const count = await locator.count();
      if (count > 0) {
        // Cache the working selector
        if (key && selector !== primarySelector) {
          saveToCache(key, selector);
          console.log(`📦 Cached: ${selector}`);
        }
        console.log(`✅ Found element: ${selector}`);
        return { selector, found: true };
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  // If still not found, try by visible text/label
  try {
    console.log('🔍 Trying visible element search...');
    if (key === 'search-input') {
      const byRole = page.getByRole('combobox');
      if ((await byRole.count()) > 0) {
        console.log('✅ Found via getByRole(combobox)');
        return { selector: 'combobox-role', found: true };
      }
      
      const byPlaceholder = page.getByPlaceholder(/search/i);
      if ((await byPlaceholder.count()) > 0) {
        console.log('✅ Found via getByPlaceholder');
        return { selector: 'placeholder-search', found: true };
      }
    }
  } catch (e) {
    // Ignore
  }
  
  console.log(`⚠️  No selector match found. Tried: ${selectorsToTry.slice(0, 8).join(', ')}...`);
  return { selector: primarySelector, found: false };
}

/**
 * Resilient fill - tries selector with fallbacks
 */
export async function healAndFill(
  page: Page,
  selector: string,
  value: string,
  key?: string
): Promise<boolean> {
  const { selector: workingSelector, found } = await trySelector(page, selector, key);
  
  if (!found) {
    console.warn(`❌ Could not find element: ${selector}`);
    return false;
  }
  
  try {
    await page.locator(workingSelector).fill(value);
    console.log(`✅ Filled "${value}"`);
    return true;
  } catch (error) {
    console.error(`Failed to fill: ${error}`);
    return false;
  }
}

/**
 * Resilient click - tries selector with fallbacks
 */
export async function healAndClick(
  page: Page,
  selector: string,
  key?: string
): Promise<boolean> {
  const { selector: workingSelector, found } = await trySelector(page, selector, key);
  
  if (!found) {
    console.warn(`❌ Could not find element: ${selector}`);
    return false;
  }
  
  try {
    await page.locator(workingSelector).click();
    console.log(`✅ Clicked`);
    return true;
  } catch (error) {
    console.error(`Failed to click: ${error}`);
    return false;
  }
}

/**
 * Resilient wait - waits for selector with fallbacks
 */
export async function healAndWait(
  page: Page,
  selector: string,
  key?: string,
  timeout: number = 5000
): Promise<boolean> {
  const { selector: workingSelector, found } = await trySelector(page, selector, key, timeout);
  
  if (!found) {
    console.warn(`❌ Element never appeared: ${selector}`);
    return false;
  }
  
  console.log(`✅ Element visible`);
  return true;
}

// Helper functions
function extractAttrValue(selector: string): string {
  const match = selector.match(/="([^"]+)"/);
  return match ? match[1].slice(0, 10) : '';
}

function extractId(selector: string): string {
  const match = selector.match(/(?:id|data-testid)="([^"]+)"/);
  return match ? match[1].slice(0, 10) : '';
}
