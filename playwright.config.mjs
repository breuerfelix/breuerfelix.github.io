import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4312', serviceWorkers: 'block' },
  projects: [
    { name: 'chromium-desktop', use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } } },
    { name: 'chromium-mobile', use: { browserName: 'chromium', viewport: { width: 375, height: 812 } } },
    { name: 'webkit-desktop', use: { browserName: 'webkit', viewport: { width: 1280, height: 900 } } },
    { name: 'webkit-mobile', use: { browserName: 'webkit', viewport: { width: 375, height: 812 } } }
  ],
  webServer: {
    command: 'node scripts/serve-test-site.mjs',
    url: 'http://127.0.0.1:4312',
    timeout: 60_000
  }
});
