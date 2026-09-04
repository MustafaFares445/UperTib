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
    // Serves the built static output (scripts/static-server.mjs), not the Vite dev server: no
    // on-demand compilation, no HMR websocket, deterministic and fast under parallel workers.
    // `npm run storybook` remains the right choice for interactive/manual work. The build itself
    // is a separate, explicit step (see the test:e2e/test:smoke scripts) rather than chained here
    // with `&&` — nesting npm -> npm -> cmd -> npx that deep reproducibly crashes Node's process
    // spawn on Windows (a libuv UV_HANDLE_CLOSING assertion), unrelated to this project's code.
    command: 'node scripts/static-server.mjs',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: 'patient-320', use: { viewport: { width: 320, height: 780 }, hasTouch: true, isMobile: true } },
    { name: 'patient-390', use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
    { name: 'patient-414', use: { viewport: { width: 414, height: 896 }, hasTouch: true, isMobile: true } },
  ],
});
