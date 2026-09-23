import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  use: {
    browserName: 'chromium',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
  },
  webServer: [
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5178 --strictPort',
      url: 'http://127.0.0.1:5178',
      reuseExistingServer: false,
    },
    {
      command:
        'npm run preview -- --host 127.0.0.1 --port 4178 --strictPort --base=/kava_java_team-3/',
      url: 'http://127.0.0.1:4178/kava_java_team-3/',
      reuseExistingServer: false,
    },
  ],
});
