import { Page } from '@playwright/test';

export async function captureDOM(page: Page) {
  const elements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('input, button, a, h1, h2, h3'));

    return all.map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim(),
      ariaLabel: el.getAttribute('aria-label'),
      role: el.getAttribute('role'),
      placeholder: el.getAttribute('placeholder'),
    }));
  });

  return elements;
}