import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const { devDependencies } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

// No request interception: WebKit cannot start MathJax's immediately revoked
// blob worker while routing is active (microsoft/playwright#33794).
// The test server mirrors the exact locked runtime, font, and speech assets.
test.beforeEach(async ({ page }) => {
  page.on('pageerror', error => { throw error; });
});

async function renderMath(page) {
  await page.goto('/test-math');
  await page.waitForFunction(() => Boolean(window.MathJax?.startup?.promise));
  await page.evaluate(() => MathJax.startup.promise);
}

test('real pinned MathJax renders inline, display and AMS equations without changing code', async ({ page }) => {
  await renderMath(page);
  expect(await page.evaluate(() => MathJax.version)).toBe(devDependencies.mathjax);
  await expect(page.locator('mjx-container')).toHaveCount(5);
  await expect(page.locator('mjx-container[display="true"]')).toHaveCount(4);
  await expect(page.locator('mjx-merror, [data-mjx-error]')).toHaveCount(0);
  await expect(page.locator('mjx-labels')).toHaveCount(1);
  await expect(page.locator('pre')).toHaveText('$$ x^2 $$\n\\begin{equation} literal \\end{equation}\n');
  await expect(page.locator('p > code').first()).toHaveText('\\(x^2\\)');
  await expect(page.locator('p > code').last()).toHaveText('$5.00');
  await expect(page.locator('code mjx-container')).toHaveCount(0);
});

test('speech labels and keyboard exploration remain enabled', async ({ page }) => {
  await renderMath(page);
  const inline = page.locator('mjx-container').first();
  await expect(inline.getByRole('img')).toHaveAccessibleName('x squared plus y squared equals z squared, math');
  await expect(inline).toHaveAttribute('tabindex', '0');
  await inline.focus();
  await page.keyboard.press('ArrowDown');
  await expect(inline).toHaveClass(/mjx-explorer-active/);
  await expect(inline.locator('.mjx-selected')).toHaveCount(1);
});

test('wide display equations wrap within mobile and desktop content', async ({ page }) => {
  await renderMath(page);
  const equation = page.locator('#wide-equation mjx-container');
  await expect(equation).toHaveAttribute('display', 'true');
  if (page.viewportSize().width < 769) {
    expect(await equation.locator('mjx-linebox').count()).toBeGreaterThan(1);
  }
  const bounds = await page.locator('#wide-equation').evaluate(element => ({
    width: element.clientWidth, scrollWidth: element.scrollWidth,
    pageWidth: document.documentElement.clientWidth, pageScrollWidth: document.documentElement.scrollWidth
  }));
  expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.width + 1);
  expect(bounds.pageScrollWidth).toBeLessThanOrEqual(bounds.pageWidth + 1);
});

test('New Computer Modern dynamic data and WOFF2 fonts load successfully', async ({ page }) => {
  const responses = [];
  const failures = [];
  page.on('response', response => {
    if (response.url().includes('/test-assets/npm/')) responses.push({ url: response.url(), status: response.status() });
  });
  page.on('requestfailed', request => {
    if (request.url().includes('/test-assets/npm/')) failures.push(request.url());
  });
  await renderMath(page);
  await page.evaluate(() => document.fonts.ready);
  const fontRoot = `/test-assets/npm/@mathjax/mathjax-newcm-font@${devDependencies['@mathjax/mathjax-newcm-font']}/`;
  expect(responses.some(response => response.url.includes(`${fontRoot}chtml/dynamic/`))).toBe(true);
  expect(responses.some(response => response.url.includes(fontRoot) && response.url.endsWith('.woff2'))).toBe(true);
  expect(responses.some(response => response.url.endsWith('/sre/speech-worker.js'))).toBe(true);
  expect(responses.some(response => response.url.endsWith('/sre/mathmaps/en.json'))).toBe(true);
  expect(responses.every(response => response.status === 200)).toBe(true);
  expect(failures).toEqual([]);
  expect(await page.evaluate(() => [...document.fonts].filter(font => font.family.startsWith('MJX-')).every(font => font.status !== 'error'))).toBe(true);
});

test('pages without math do not load MathJax or its assets', async ({ page }) => {
  const requests = [];
  page.on('request', request => {
    if (request.url().includes('/test-assets/npm/')) requests.push(request.url());
  });
  for (const path of ['/', '/archive', '/blog/kubernetes-webhooks']) {
    await page.goto(path);
    await expect(page.locator('script[src*="mathjax"]')).toHaveCount(0);
    expect(await page.evaluate(() => typeof window.MathJax)).toBe('undefined');
  }
  expect(requests).toEqual([]);
});
