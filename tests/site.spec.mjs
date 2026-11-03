import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context, page }) => {
  page.on('pageerror', error => { throw error; });
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === 'http://127.0.0.1:4312') return route.continue();
    if (url.href === 'https://utteranc.es/client.js') {
      return route.fulfill({ contentType: 'application/javascript', body: `const script=document.currentScript;setTimeout(()=>{const frame=document.createElement('iframe');frame.className='utterances-frame';frame.title='Comments';frame.style.width='100%';frame.src='https://utteranc.es/test-frame';script.after(frame)},40)` });
    }
    if (url.href === 'https://utteranc.es/test-frame') {
      return route.fulfill({ contentType: 'text/html', body: `<script>window.messages=[];addEventListener('message',event=>messages.push(event.data));setTimeout(()=>parent.postMessage({type:'resize',height:100},'http://127.0.0.1:4312'),40)</script>` });
    }
    return route.abort();
  });
});

async function theme(page, value) {
  await expect(page.locator('body')).toHaveAttribute('data-theme', value);
  await expect(page.locator('html')).toHaveAttribute('data-theme', value);
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor === getComputedStyle(document.documentElement).backgroundColor)).toBe(true);
  await expect(page.getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', String(value === 'dark'));
}

test('OS preferences, saved choices and canvas agree across all layouts', async ({ page }) => {
  await page.goto('/');
  for (const url of ['/', '/archive', '/blog/kubernetes-webhooks', '/404.html']) {
    await page.evaluate(() => localStorage.clear());
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(url);
    await theme(page, 'dark');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
    await page.emulateMedia({ colorScheme: 'light' });
    await theme(page, 'light');
    await page.getByRole('button', { name: 'Dark theme' }).click();
    await theme(page, 'dark');
    await page.reload();
    await theme(page, 'dark');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.emulateMedia({ colorScheme: 'light' });
    await theme(page, 'dark');
  }
});

test('navigation buttons work with keyboard and Escape', async ({ page }) => {
  await page.goto('/archive');
  const mode = page.getByRole('button', { name: 'Dark theme' });
  await mode.focus();
  const previous = await mode.getAttribute('aria-pressed');
  await page.keyboard.press('Space');
  await expect(mode).toHaveAttribute('aria-pressed', String(previous !== 'true'));
  if (page.viewportSize().width < 769) {
    const menu = page.getByRole('button', { name: 'Navigation' });
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'RSS feed', exact: true })).toBeVisible();
    await expect(page.locator('.wrapper')).toHaveClass(/blurry/);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
    await expect(page.locator('.wrapper')).not.toHaveClass(/blurry/);
  }
});

test('footer and named embeds fit the viewport and synchronize themes', async ({ page }) => {
  for (const url of ['/games', '/music', '/archive']) {
    await page.goto(url);
    expect(await page.locator('.footer a').evaluateAll(links => links.every(link => link.getBoundingClientRect().left >= 0 && link.getBoundingClientRect().right <= innerWidth))).toBe(true);
    expect(await page.locator('main iframe').evaluateAll(frames => frames.every(frame => frame.title && frame.getBoundingClientRect().right <= innerWidth))).toBe(true);
    if (url === '/archive') continue;
    const initial = await page.locator('body').getAttribute('data-theme');
    await page.getByRole('button', { name: 'Dark theme' }).click();
    const target = initial === 'light' ? 'dark' : 'light';
    for (const src of await page.locator('main iframe').evaluateAll(frames => frames.map(frame => frame.src))) expect(new URL(src).searchParams.has(target)).toBe(true);
  }
});

test('late Utterances readiness receives the current theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/blog/kubernetes-webhooks');
  await expect.poll(() => page.frames().some(frame => frame.url() === 'https://utteranc.es/test-frame')).toBe(true);
  const frame = page.frames().find(frame => frame.url() === 'https://utteranc.es/test-frame');
  await expect.poll(() => frame.evaluate(() => window.messages.at(-1)?.theme)).toBe('github-dark');
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect.poll(() => frame.evaluate(() => window.messages.at(-1)?.theme)).toBe('github-light');
});

test('heading permalinks have names and visible keyboard focus', async ({ page }) => {
  await page.goto('/blog/kubernetes-webhooks');
  await page.keyboard.press('Tab');
  const anchor = page.locator('.anchor-head').first();
  await anchor.focus();
  await expect(anchor).toHaveAccessibleName(/^Link to /);
  await expect(anchor).toHaveCSS('opacity', '1');
  await expect(anchor).not.toHaveCSS('outline-style', 'none');
});

test('search renders a query typed before the index arrives', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/assets/search.json', async route => { await gate; await route.continue(); });
  await page.goto('/archive');
  await page.getByRole('searchbox').fill('kubernetes');
  await expect(page.getByRole('status')).toContainText('Loading');
  release();
  await expect(page.locator('#search-results')).toContainText('Webhook');
  await page.getByRole('searchbox').fill('zzzz-no-match');
  await expect(page.getByRole('status')).toHaveText('No results found');
  await page.getByRole('searchbox').fill('');
  await expect(page.locator('#search-results li')).toHaveCount(0);
});

test('search treats quoted metadata and markup-like titles as text', async ({ page }) => {
  await page.goto('/archive');
  await page.getByRole('searchbox').fill('regression');
  const result = page.locator('#search-results a');
  await expect(result).toHaveText('Audit C++ <T> & "quotes"');
  await expect(result).toHaveAttribute('title', 'Read "quoted" metadata & compare values.');
  await expect(result.locator('t')).toHaveCount(0);
});

test('search reports index loading failures explicitly', async ({ page }) => {
  await page.route('**/assets/search.json', route => route.fulfill({ status: 503, body: 'unavailable' }));
  await page.goto('/archive');
  await expect(page.getByRole('status')).toContainText('Search is unavailable');
});

test('TOC preserves heading text and targets headings with nested IDs', async ({ page }) => {
  await page.goto('/test-fixture');
  await expect(page.locator('.toc a')).toHaveCount(3);
  await expect(page.locator('.anchor-head').first()).toHaveAccessibleName('Link to Inline code and emphasis & escaped <T>');
  await expect(page.locator('.toc a').first()).toHaveText('Inline code and emphasis & escaped <T>');
  expect(await page.locator('.toc a').evaluateAll(links => links.every(link => /^H[23]$/.test(document.getElementById(decodeURIComponent(link.hash.slice(1))).tagName)))).toBe(true);
});

test('gallery previews are uncropped and the lightbox restores focus and scrolling', async ({ page }) => {
  await page.goto('/blog/series-monitor');
  await expect(page.locator('.gallery figure')).toHaveCount(4);
  expect(await page.locator('.gallery img').evaluateAll(images => images.every(image => getComputedStyle(image).objectFit === 'contain'))).toBe(true);
  const image = page.locator('.gallery img').first();
  for (const key of ['click', 'Enter', 'Space']) {
    if (key === 'click') await image.click();
    else { await image.focus(); await page.keyboard.press(key); }
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Close image' })).toBeFocused();
    const bounds = await dialog.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(-1);
    expect(bounds.y).toBeGreaterThanOrEqual(-1);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize().width + 1);
    const before = await page.evaluate(() => scrollY);
    await page.mouse.move(2, page.viewportSize().height / 2);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => scrollY)).toBe(before);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement === document.body || document.querySelector('dialog').contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(image).toBeFocused();
    await expect(page.locator('html')).not.toHaveClass(/lightbox-open/);
    expect(await page.evaluate(() => scrollY)).toBe(before);
  }
  await image.click();
  await page.getByRole('button', { name: 'Close image' }).click();
  await expect(image).toBeFocused();
  await image.click();
  await page.mouse.click(2, 2);
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('linked images keep their link behavior', async ({ page }) => {
  await page.goto('/test-fixture');
  await expect(page.getByAltText('Linked image', { exact: true })).not.toHaveClass(/zoomable/);
  await expect(page.getByAltText('Linked image', { exact: true })).not.toHaveAttribute('role', 'button');
  await expect(page.getByAltText('Linked image', { exact: true }).locator('..')).toHaveAttribute('href', 'https://example.com/');
  await expect(page.getByAltText('Unlinked image', { exact: true })).toHaveAttribute('role', 'button');
});

test('JSON-LD, RSS and sitemap share one recorded update date', async ({ page, request }) => {
  await page.goto('/test-fixture');
  const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(data.headline).toBe('Audit C++ <T> & "quotes"');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', data.description);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', data.description);
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'breuer.dev');
  expect(data.image).toBe('https://breuer.dev/assets/img/avatar.jpg');
  const feed = await (await request.get('/feed.xml')).text();
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const dates = await page.evaluate(({ feed, sitemap }) => {
    const parser = new DOMParser();
    const entries = [...parser.parseFromString(feed, 'application/xml').getElementsByTagNameNS('*', 'entry')];
    const entry = entries.find(entry => entry.querySelector('link').getAttribute('href') === 'https://breuer.dev/test-fixture');
    const urls = [...parser.parseFromString(sitemap, 'application/xml').getElementsByTagNameNS('*', 'url')];
    const url = urls.find(url => url.querySelector('loc').textContent === 'https://breuer.dev/test-fixture');
    return { feed: entry.querySelector('updated').textContent, sitemap: url.querySelector('lastmod').textContent };
  }, { feed, sitemap });
  expect(dates).toEqual({ feed: data.dateModified, sitemap: data.dateModified });
});

test('inline line comments preserve following JavaScript statements', async ({ page }) => {
  await page.goto('/test-fixture');
  expect(await page.evaluate(() => [window.beforeComment, window.afterComment])).toEqual([true, true]);
});

test('skills icons, fonts and avatar render locally without distortion', async ({ page, request }) => {
  const externalVisualRequests = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.hostname === 'fonts.gstatic.com' || url.href.includes('devicon')) externalVisualRequests.push(url.href);
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.skill-icon')).toHaveCount(23);
  for (const icon of await page.locator('.skill-icon').all()) {
    await expect(icon).toHaveCSS('width', '16px');
    await expect(icon).toHaveCSS('flex-grow', '0');
  }
  await expect(page.locator('.author-avatar-wrapper a')).toHaveAttribute('href', '/');
  const avatar = await page.locator('.author-avatar').evaluate(async image => {
    await image.decode();
    const bounds = image.getBoundingClientRect();
    return { displayedRatio: bounds.width / bounds.height, naturalRatio: image.naturalWidth / image.naturalHeight };
  });
  expect(avatar.displayedRatio).toBeCloseTo(avatar.naturalRatio, 5);
  const icons = await page.locator('.skill-icon').evaluateAll(icons => icons.map(icon => getComputedStyle(icon).maskImage));
  for (const icon of new Set(icons)) {
    expect(icon).toContain('/assets/icons/skills/');
    const url = icon.match(/url\("?([^"\)]+)"?\)/)[1];
    expect((await request.get(url)).ok()).toBe(true);
  }
  expect(externalVisualRequests).toEqual([]);
  expect(await page.evaluate(() => document.fonts.check('16px Roboto'))).toBe(true);
});
