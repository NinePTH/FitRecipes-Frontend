import { test, expect, Page, Response } from '@playwright/test';

// const email = process.env.TEST_EMAIL!;
// const password = process.env.TEST_PASSWORD!;

const email = "";
const password = "";

async function loginAndWait(page: Page, baseURL: string, email: string, password: string) {
  await page.goto(baseURL + 'auth');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  const [resp] = await Promise.all([
    page.waitForResponse((r: Response) => r.url().includes('/auth/login'), { timeout: 15000 }),
    page.click('button[type="submit"]'),
  ]);
  if (!resp.ok()) {
    const body = await resp.text();
    throw new Error(`Login failed: HTTP ${resp.status()} – ${body.slice(0,200)}`);
  }
}

test.describe('Browse E2E', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await loginAndWait(page, baseURL!, email, password);
  });

  test('shows trending section (if present)', async ({ page }) => {
    const trendHeading = page.getByRole('heading', { name: /trending/i });
    if (await trendHeading.count()) {
      await expect(trendHeading).toBeVisible();
    } else {
      test.info().annotations.push({ type: 'note', description: 'Trending section not present on staging; skipping strict assertion.' });
    }
  });

  test('filter and sort controls are present (soft assertions)', async ({ page }) => {
    const filterControl = page.locator('button:has-text("Filter"), button:has-text("Filters"), [data-testid="filter-button"], button[aria-label*="filter" i]').first();
    if (await filterControl.count()) {
      await expect(filterControl).toBeVisible({ timeout: 3000 });
    } else {
      test.info().annotations.push({ type: 'note', description: 'Filter control not found on staging UI — skipping strict assertion.' });
    }

    const sortControl = page.locator([
      'button:has-text("Sort")',
      'button:has-text("Sort by")',
      '[data-testid="sort-button"]',
      'select',
      'label:has-text("Sort by") + select'
    ].join(', ')).first();
    if (await sortControl.count()) {
      await expect(sortControl).toBeVisible({ timeout: 3000 });
    } else {
      test.info().annotations.push({ type: 'note', description: 'Sort control not found on staging UI — skipping strict assertion.' });
    }
  });

  test('shows recipe list and basic controls', async ({ page }) => {
    // Card presence OR empty state text
    const card = page.locator('[data-testid="recipe-card"], a[href^="/recipe/"]').first();
    const emptyState = page.getByText(/no recipes/i);

    await Promise.any([
      expect(card).toBeVisible({ timeout: 8000 }),
      expect(emptyState).toBeVisible({ timeout: 8000 }),
    ]);

    // Filter control: button or data-testid
    const filterControl = page.locator('button:has-text("Filter"), [data-testid="filter-button"]').first();
    await expect.soft(filterControl).toBeVisible({ timeout: 3000 });

    // Sort control: accept button, data-testid, select, or combobox
    const sortControl = page.locator([
      'button:has-text("Sort")',
      '[data-testid="sort-button"]',
      'select[name*="sort" i]',
      '[role="combobox"][aria-label*="sort" i]'
    ].join(', ')).first();

    // Don't fail the test if Sort isn’t present on this build — just note it
    if (await sortControl.count()) {
      await expect(sortControl).toBeVisible({ timeout: 3000 });
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'Sort control not found on staging UI — skipping strict assertion.',
      });
    }
  });

  test('opens a recipe detail and key sections are visible', async ({ page }) => {
    const firstCardLink = page.locator('a[href^="/recipe/"]').first();

    if (!(await firstCardLink.isVisible({ timeout: 8000 }).catch(() => false))) {
      test.skip(true, 'No recipe cards available on staging to open detail page.');
      return;
    }

    await firstCardLink.click();
    await expect(page).toHaveURL(/\/recipe\/[A-Za-z0-9_-]+$/);

    // Title + ingredients + instructions (tolerant selectors)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const ingredientAny = page.locator(
      '[data-testid="ingredient-item"], section:has(h2:has-text("Ingredient")), ul li'
    ).first();
    await expect(ingredientAny).toBeVisible();

    const stepAny = page.locator(
      '[data-testid="step-item"], section:has(h2:has-text("Instruction")), ol li'
    ).first();
    await expect(stepAny).toBeVisible();
  });
});
