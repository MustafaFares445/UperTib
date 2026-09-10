import { expect, test, type Page } from '@playwright/test';

const TARGET_STORIES = [
  'patient-screens-scr-elig-001-provider-search--default',
  'patient-screens-scr-elig-002-provider-results--default',
  'patient-screens-scr-elig-005-provider-comparison--three-options',
  'patient-screens-scr-clinical-005-case-timeline--default',
  'patient-screens-scr-reviews-002-submit-review--default',
  'patient-screens-scr-claims-001-my-claims--default',
  'patient-screens-scr-claims-003-protection-claim--evidence-retryable-failure',
  'patient-screens-scr-identity-005-family-and-representation--default',
  'patient-screens-scr-identity-006-create-grant--ready',
  'patient-screens-scr-identity-037-add-dependent--evidence-rejected',
] as const;

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, {
    timeout: 45_000,
  });
}

test('WP-UX-04 keeps visible Patient controls at the 44px comfortable target across review widths', async ({ page }, testInfo) => {
  test.setTimeout(120_000);

  for (const id of TARGET_STORIES) {
    await gotoStory(page, id);
    const undersized = await page.evaluate(() => {
      const root = document.getElementById('storybook-root');
      if (!root) return [{ label: 'storybook-root missing', width: 0, height: 0 }];

      const candidates = Array.from(root.querySelectorAll<HTMLElement>(
        '[role="button"], [role="link"], [role="checkbox"], [role="radio"], input, textarea, select, button, a[href]',
      ));

      return candidates.flatMap((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const visible = style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number.parseFloat(style.opacity || '1') > 0
          && rect.width > 0
          && rect.height > 0;
        if (!visible || (rect.width >= 43.5 && rect.height >= 43.5)) return [];
        return [{
          label: element.getAttribute('aria-label')
            || element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80)
            || element.tagName.toLowerCase(),
          role: element.getAttribute('role') || element.tagName.toLowerCase(),
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
        }];
      });
    });

    expect(undersized, `${id} / ${testInfo.project.name}: ${JSON.stringify(undersized, null, 2)}`).toEqual([]);
  }
});
