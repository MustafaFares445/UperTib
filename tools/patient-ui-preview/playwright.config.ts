import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  outputDir: './artifacts/test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: './artifacts/playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:6006',
    browserName: 'chromium',
    locale: 'ar-SY',
    timezoneId: 'Asia/Damascus',
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run storybook',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'patient-320', use: { viewport: { width: 320, height: 780 }, hasTouch: true, isMobile: true } },
    { name: 'patient-390', use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
    { name: 'patient-414', use: { viewport: { width: 414, height: 896 }, hasTouch: true, isMobile: true } },
  ],
});
