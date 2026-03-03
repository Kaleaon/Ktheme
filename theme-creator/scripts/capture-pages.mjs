import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const PORT = Number(process.env.SCREENSHOT_PORT ?? 4173);
const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const outputDir = path.resolve(process.cwd(), process.env.SCREENSHOT_OUTPUT_DIR ?? 'artifacts/screenshots');

const pages = [
  { name: 'customize', tabLabel: 'Customize' },
  { name: 'ai-designer', tabLabel: 'AI Designer' },
  { name: 'bluesky', tabLabel: 'Bluesky' },
  { name: 'presets', tabLabel: 'Presets' },
];

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for preview server at ${url}`);
}

async function loadPlaywright() {
  try {
    const playwright = await import('playwright');
    return playwright.chromium;
  } catch {
    console.warn('Playwright is not installed. Install it with `npm --prefix theme-creator i -D playwright` to enable automated screenshots.');
    return null;
  }
}

async function captureScreenshots() {
  const chromium = await loadPlaywright();
  if (!chromium) return;

  await mkdir(outputDir, { recursive: true });

  const preview = spawn('npm', ['run', 'preview', '--', '--host', '0.0.0.0', '--port', String(PORT)], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true,
  });

  try {
    await waitForServer(BASE_URL);

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    for (const appPage of pages) {
      await page.getByRole('button', { name: appPage.tabLabel }).click();
      await page.waitForTimeout(250);
      const destination = path.join(outputDir, `${appPage.name}.png`);
      await page.screenshot({ path: destination, fullPage: true });
      console.log(`Saved ${destination}`);
    }

    await browser.close();
  } finally {
    preview.kill('SIGTERM');
  }
}

captureScreenshots().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
