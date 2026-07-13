import { defineConfig, devices } from '@playwright/test'
import fs from 'node:fs'

// The Claude Code cloud environment pre-installs Chromium at PLAYWRIGHT_BROWSERS_PATH
// (/opt/pw-browsers) and exposes a version-agnostic wrapper at /opt/pw-browsers/chromium.
// If the revision expected by @playwright/test is present it is used automatically;
// otherwise we fall back to the wrapper executable.
const chromiumWrapper = '/opt/pw-browsers/chromium'
const useWrapper =
  process.env.PLAYWRIGHT_BROWSERS_PATH != null && fs.existsSync(chromiumWrapper)

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        launchOptions: {
          ...(useWrapper ? { executablePath: chromiumWrapper } : {}),
          args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required'],
        },
      },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
})
