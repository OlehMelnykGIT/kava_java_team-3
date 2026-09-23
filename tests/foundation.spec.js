import { test, expect } from '@playwright/test';

const devUrl = 'http://127.0.0.1:5178/';
const productionUrl = 'http://127.0.0.1:4178/kava_java_team-3/';

async function openModal(page) {
  await page.evaluate(async () => {
    const { openSuccessModal } = await import('/js/success-modal.js');
    openSuccessModal();
  });
}

async function closeModal(page) {
  await page.evaluate(async () => {
    const { closeSuccessModal } = await import('/js/success-modal.js');
    closeSuccessModal();
  });
}

for (const width of [320, 375, 767, 768, 1024, 1439, 1440]) {
  test(`shared layout and modal at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 828 });
    await page.goto(devUrl);
    const container = page.locator('.contacts-container');
    const expectedContainer =
      width >= 1440 ? 1440 : width >= 768 ? 768 : Math.min(width, 375);
    expect((await container.boundingBox()).width).toBe(expectedContainer);
    expect(
      await container.evaluate(el => getComputedStyle(el).paddingBlockStart)
    ).toBe('0px');
    const font = await page
      .locator('body')
      .evaluate(el => getComputedStyle(el).fontFamily);
    expect(
      await page
        .locator('input')
        .first()
        .evaluate(el => getComputedStyle(el).fontFamily)
    ).toBe(font);
    expect(
      await page
        .locator('.contacts')
        .evaluate(el => getComputedStyle(el).paddingTop)
    ).toBe(width >= 1440 ? '92px' : '64px');
    await expect(page.locator('dialog')).not.toBeVisible();
    await openModal(page);
    await expect(page.getByRole('dialog')).toBeVisible();
    const box = await page.locator('.success-modal__content').boundingBox();
    expect(box.width).toBe(
      width >= 1440 ? 768 : width >= 768 ? 704 : Math.min(width - 40, 335)
    );
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(
      await page
        .locator('dialog')
        .evaluate(el => el.scrollWidth <= el.clientWidth)
    ).toBe(true);
    const image = page.locator('.success-modal__image');
    await image.evaluate(el => el.decode());
    expect((await image.boundingBox()).height).toBe(width >= 768 ? 394 : 207);
  });
}

test('all close routes, focus, repeated opens and scroll ownership', async ({
  page,
}) => {
  await page.goto(devUrl);
  const trigger = page.locator('.contacts-btn');
  for (let cycle = 0; cycle < 3; cycle++) {
    for (const method of ['button', 'backdrop', 'escape']) {
      await trigger.focus();
      await openModal(page);
      await openModal(page);
      await expect(page.locator('html')).toHaveClass(/modal-open/);
      await expect(page.locator('.success-modal__close')).toBeFocused();
      await page.locator('.success-modal__title').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      for (const key of ['Tab', 'Shift+Tab']) {
        await page.keyboard.press(key);
        expect(
          await page
            .locator('dialog')
            .evaluate(el => el.contains(document.activeElement))
        ).toBe(true);
      }
      if (method === 'button')
        await page.getByRole('button', { name: 'Close confirmation' }).click();
      if (method === 'backdrop') await page.mouse.click(5, 5);
      if (method === 'escape') await page.keyboard.press('Escape');
      await expect(page.locator('dialog')).not.toBeVisible();
      await expect(page.locator('html')).not.toHaveClass(/modal-open/);
      await expect(trigger).toBeFocused();
    }
  }
  await page.evaluate(() =>
    document.documentElement.classList.add('modal-open')
  );
  await openModal(page);
  await closeModal(page);
  await expect(page.locator('html')).toHaveClass(/modal-open/);
  await page.evaluate(async () => {
    document.documentElement.classList.remove('modal-open');
    const modal = await import('/js/success-modal.js');
    modal.openSuccessModal();
    modal.closeSuccessModal();
    modal.openSuccessModal();
  });
  await expect(page.locator('dialog')).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/modal-open/);
  await closeModal(page);
  await expect(page.locator('html')).not.toHaveClass(/modal-open/);
});

test('short viewport scrolls dialog, not background', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 400 });
  await page.goto(devUrl);
  await openModal(page);
  expect(
    await page
      .locator('dialog')
      .evaluate(el => el.scrollHeight > el.clientHeight)
  ).toBe(true);
  const backgroundScroll = await page.evaluate(() => window.scrollY);
  await page.mouse.move(150, 250);
  await page.mouse.wheel(0, 500);
  await expect
    .poll(() => page.locator('dialog').evaluate(el => el.scrollTop))
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(backgroundScroll);
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveClass(/modal-open/);
});

test('production assets, SVG symbols, retina image and hidden modal', async ({
  browser,
}) => {
  const context = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await context.newPage();
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => {
    if (
      response.url().startsWith(new URL(productionUrl).origin) &&
      response.status() >= 400
    )
      failures.push(response.url());
  });
  page.on('console', message => {
    if (message.type() === 'error' || /srcset/.test(message.text()))
      failures.push(message.text());
  });
  await page.goto(productionUrl);
  await expect(page.locator('dialog')).not.toBeVisible();
  expect(
    await page.locator('body').evaluate(el => getComputedStyle(el).margin)
  ).toBe('0px');
  const image = page.locator('.success-modal__image');
  await image.evaluate(el => {
    el.loading = 'eager';
    return el.decode();
  });
  expect(await image.evaluate(el => el.currentSrc)).toContain('@2x');
  expect(await image.evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
  const uses = await page
    .locator('use')
    .evaluateAll(els => els.map(el => el.getAttribute('href')));
  for (const href of new Set(uses)) {
    const [path, symbol] = href.split('#');
    const response = await page.request.get(new URL(path, productionUrl).href);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('svg');
    expect(await response.text()).toContain(`id="${symbol}"`);
  }
  expect(
    (await page.locator('.footer-logo-link').boundingBox()).width
  ).toBeGreaterThan(0);
  expect(failures).toEqual([]);
  await context.close();
});

test('reduced motion preserves accessible focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(devUrl);
  expect(
    await page
      .locator('html')
      .evaluate(el => getComputedStyle(el).scrollBehavior)
  ).toBe('auto');
  await page.keyboard.press('Tab');
  await openModal(page);
  await expect(page.locator('.success-modal__close')).toBeFocused();
  expect(
    await page
      .locator('.success-modal__close')
      .evaluate(el => getComputedStyle(el).outlineStyle)
  ).not.toBe('none');
});
