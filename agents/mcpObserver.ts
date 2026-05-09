import { Page } from '@playwright/test';
import fs from 'fs';

export const domTimeline: any[] = [];

async function captureDOM(page: Page) {
  return await page.evaluate(() => {
    const elements = Array.from(
      document.querySelectorAll(`
        button,
        input,
        textarea,
        select,
        a,
        h1,
        h2,
        h3,
        [role],
        [data-testid]
      `)
    );

    return elements.map((el: any) => {
      const rect =
        el.getBoundingClientRect();

      const computedStyle =
        window.getComputedStyle(el);

      const accessibleName =
        el.getAttribute('aria-label') ||
        el.innerText?.trim() ||
        el.getAttribute(
          'placeholder'
        ) ||
        el.getAttribute('name');

      return {
        tag: el.tagName,

        text:
          el.innerText
            ?.replace(/\s+/g, ' ')
            ?.trim(),

        role:
          el.getAttribute('role'),

        computedRole:
          el.role ||
          el.getAttribute('role'),

        accessibleName,

        ariaLabel:
          el.getAttribute(
            'aria-label'
          ),

        placeholder:
          el.getAttribute(
            'placeholder'
          ),

        testId:
          el.getAttribute(
            'data-testid'
          ),

        name:
          el.getAttribute('name'),

        id: el.id,

        className: el.className,

        visible: !!(
          el.offsetWidth ||
          el.offsetHeight ||
          el.getClientRects()
            .length
        ),

        isClickable:
          [
            'BUTTON',
            'A',
            'INPUT',
          ].includes(el.tagName) ||
          computedStyle.cursor ===
            'pointer' ||
          el.onclick !== null,

        boundingBox: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },

        parentText:
          el.parentElement?.innerText
            ?.replace(/\s+/g, ' ')
            ?.slice(0, 200),
      };
    });
  });
}

export async function startMCPObserver(
  page: Page
) {
  async function capture(
    reason: string
  ) {
    try {
      const dom =
        await captureDOM(page);

      const snapshot = {
        timestamp:
          new Date().toISOString(),

        reason,

        url: page.url(),

        dom,
      };

      domTimeline.push(snapshot);

      // Persist timeline
      fs.writeFileSync(
        './mcp-timeline.json',
        JSON.stringify(
          domTimeline,
          null,
          2
        )
      );

      console.log(
        `📸 DOM captured: ${reason}`
      );
    } catch (err) {
      console.log(
        '❌ MCP capture failed:',
        err
      );
    }
  }

  // Initial page
  await capture('Initial Load');

  let lastCapturedUrl = '';

  // Main navigation observer
  page.on(
    'framenavigated',
    async frame => {
      // Ignore iframe noise
      if (
        frame !== page.mainFrame()
      ) {
        return;
      }

      const currentUrl =
        frame.url();

      // Ignore duplicates
      if (
        !currentUrl ||
        currentUrl ===
          lastCapturedUrl
      ) {
        return;
      }

      lastCapturedUrl =
        currentUrl;

      await capture(
        `Navigation: ${
          new URL(currentUrl)
            .pathname
        }`
      );
    }
  );

  // Popup observer
  page.on(
    'popup',
    async popup => {
      try {
        await popup.waitForLoadState();

        const popupDOM =
          await captureDOM(
            popup
          );

        domTimeline.push({
          timestamp:
            new Date().toISOString(),

          reason:
            'Popup Opened',

          url: popup.url(),

          dom: popupDOM,
        });

        console.log(
          '📸 Popup DOM captured'
        );
      } catch (err) {
        console.log(
          '❌ Popup capture failed:',
          err
        );
      }
    }
  );
}