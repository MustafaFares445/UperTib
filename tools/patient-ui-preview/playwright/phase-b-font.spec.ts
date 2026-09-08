import { expect, test } from '@playwright/test';

const PRIMARY_PROJECT = 'patient-390';

test('WP-UX-05 loads the canonical IBM Plex Arabic and Latin faces before visual approval', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== PRIMARY_PROJECT, 'Font readiness is build-wide; verify once on the primary review width.');

  await page.goto('/iframe.html?id=patient-screens-scr-identity-001-patient-entry--default&viewMode=story');
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, {
    timeout: 45_000,
  });
  await page.waitForFunction(() => document.documentElement.dataset.ubertibFontsReady === 'true', {
    timeout: 45_000,
  });

  const proof = await page.evaluate(async () => {
    await document.fonts.ready;
    const arabic = await document.fonts.load('400 16px "IBM Plex Sans Arabic"', 'العربية ١٢٣');
    const latin = await document.fonts.load('400 16px "IBM Plex Sans"', 'UberTib 123');
    const heading = document.querySelector('[role="heading"]') as HTMLElement | null;
    return {
      arabicFaces: arabic.length,
      arabicLoaded: arabic.every((face) => face.status === 'loaded'),
      latinFaces: latin.length,
      latinLoaded: latin.every((face) => face.status === 'loaded'),
      computedFamily: heading ? getComputedStyle(heading).fontFamily : '',
      readyMarker: document.documentElement.dataset.ubertibFontsReady,
    };
  });

  expect(proof.readyMarker).toBe('true');
  expect(proof.arabicFaces).toBeGreaterThan(0);
  expect(proof.arabicLoaded).toBe(true);
  expect(proof.latinFaces).toBeGreaterThan(0);
  expect(proof.latinLoaded).toBe(true);
  expect(proof.computedFamily).toContain('IBM Plex Sans Arabic');
});
