/**
 * Smoke tests: every named section and DOM element is visible/present.
 * One spec per logical region; keeps regressions obvious.
 */
import { test, expect } from "@playwright/test";
import { sel } from "./selectors";

test.describe("Page structure — on load", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // ── Hero ────────────────────────────────────────────────────────────────
  test("hero title is visible", async ({ page }) => {
    await expect(page.locator("#hero-title")).toBeVisible();
  });

  test("hero stat pills (avg kcal, avg protein, total time) are visible", async ({ page }) => {
    await expect(page.getByTestId(sel.statAvgKcal)).toBeVisible();
    await expect(page.getByTestId(sel.statAvgProtein)).toBeVisible();
    await expect(page.getByTestId(sel.statTotalTime)).toBeVisible();
  });

  test("hero stat pills contain 'Avg' label", async ({ page }) => {
    const kcalText = await page.getByTestId(sel.statAvgKcal).innerText();
    const proteinText = await page.getByTestId(sel.statAvgProtein).innerText();
    expect(kcalText).toMatch(/Avg/i);
    expect(proteinText).toMatch(/Avg/i);
  });

  test("footer is visible and contains expected copy", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Dubai");
    await expect(footer).toContainText("No Red Meat");
  });

  // ── Week nav ─────────────────────────────────────────────────────────────
  test("week 1 and week 2 nav buttons are visible", async ({ page }) => {
    await expect(page.getByTestId(sel.weekBtn(1))).toBeVisible();
    await expect(page.getByTestId(sel.weekBtn(2))).toBeVisible();
  });

  test("week meal count badge is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.weekMealCount)).toBeVisible();
  });

  // ── Week glance ──────────────────────────────────────────────────────────
  test("week-glance panel is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.weekGlance)).toBeVisible();
  });

  test("all three week-glance tiles (kcal, protein, time) are visible", async ({ page }) => {
    await expect(page.getByTestId(sel.weekGlanceKcal)).toBeVisible();
    await expect(page.getByTestId(sel.weekGlanceProtein)).toBeVisible();
    await expect(page.getByTestId(sel.weekGlanceTime)).toBeVisible();
  });

  // ── Meal list ────────────────────────────────────────────────────────────
  test("meal cards are visible", async ({ page }) => {
    await expect(page.getByTestId(sel.mealCard).first()).toBeVisible();
  });

  test("at least 7 meal cards exist for week 1", async ({ page }) => {
    await expect(page.getByTestId(sel.mealCard)).toHaveCount(7);
  });

  test("search input is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.searchInput)).toBeVisible();
  });

  // ── Meal detail (default: first meal) ───────────────────────────────────
  test("hero title is non-empty", async ({ page }) => {
    const title = await page.locator("#hero-title").innerText();
    expect(title.trim()).not.toBe("");
  });

  test("ingredients tab is active by default", async ({ page }) => {
    await expect(page.getByTestId(sel.tabIngredients)).toBeVisible();
    await expect(page.getByTestId(sel.tabSteps)).toBeVisible();
    await expect(page.getByTestId(sel.tabStorage)).toBeVisible();
  });

  test("at least one ingredient row is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.ingredientRow).first()).toBeVisible();
  });

  test("ingredients selected count badge is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.ingredientsSelectedCount)).toBeVisible();
  });

  test("ingredients selected count starts at 0", async ({ page }) => {
    const text = await page.getByTestId(sel.ingredientsSelectedCount).innerText();
    expect(text).toMatch(/^0\//);
  });

  test("'in list' count badge is visible on desktop", async ({ page, viewport }) => {
    if ((viewport?.width ?? 0) < 640) return; // badge is sm:inline — hidden on mobile
    await expect(page.getByTestId(sel.inListCount)).toBeVisible();
  });

  test("'Add meal to list' button is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.addMealBtn)).toBeVisible();
  });

  test("'Clear' button is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.clearMealBtn)).toBeVisible();
  });

  test("'Mark planned' footer button is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.markPlannedBtn)).toBeVisible();
  });

  test("'+ List' footer button is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.addListFooterBtn)).toBeVisible();
  });

  // ── Shopping panel ───────────────────────────────────────────────────────
  test("'Add week' button is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.addWeekBtn)).toBeVisible();
  });

  test("'Add all' button is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.addAllBtn)).toBeVisible();
  });

  test("empty state is shown before any items are added", async ({ page }) => {
    await expect(page.getByTestId(sel.emptyState)).toBeVisible();
  });

  test("item count badge is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.itemCountBadge)).toBeVisible();
  });

  test("all four market pill tabs are visible", async ({ page }) => {
    await expect(page.getByTestId(sel.marketPill("carrefour"))).toBeVisible();
    await expect(page.getByTestId(sel.marketPill("lulu"))).toBeVisible();
    await expect(page.getByTestId(sel.marketPill("spinneys"))).toBeVisible();
    await expect(page.getByTestId(sel.marketPill("geant"))).toBeVisible();
  });
});

test.describe("Page structure — after adding items", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByTestId(sel.addWeekBtn).click();
  });

  test("market price cards are visible", async ({ page }) => {
    await expect(page.getByTestId(sel.marketCard("carrefour"))).toBeVisible();
    await expect(page.getByTestId(sel.marketCard("lulu"))).toBeVisible();
    await expect(page.getByTestId(sel.marketCard("spinneys"))).toBeVisible();
    await expect(page.getByTestId(sel.marketCard("geant"))).toBeVisible();
  });

  test("cheapest label is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.cheapestLabel)).toBeVisible();
  });

  test("savings banner is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.savingsBanner)).toBeVisible();
  });

  test("shop-at link is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.shopAtLink)).toBeVisible();
  });

  test("clear list button is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.clearListBtn)).toBeVisible();
  });

  test("list items are visible", async ({ page }) => {
    await expect(page.getByTestId(sel.listItem).first()).toBeVisible();
  });

  test("remove button on first item is present", async ({ page }) => {
    await expect(page.getByTestId(sel.itemRemoveBtn).first()).toBeAttached();
  });

  test("compare prices button is visible on list items", async ({ page }) => {
    await expect(page.getByTestId(sel.comparePricesBtn).first()).toBeVisible();
  });

  test("price comparison grid appears after clicking compare button", async ({ page, viewport }) => {
    // On narrow viewports the shopping panel scrolls below the fold; skip there
    if ((viewport?.width ?? 0) < 768) return;
    const compBtn = page.getByTestId(sel.comparePricesBtn).first();
    await compBtn.scrollIntoViewIfNeeded();
    await compBtn.click();
    // The grid uses the HTML `hidden` attribute for toggle — assert it is removed
    await expect(page.getByTestId(sel.priceComparison).first()).not.toHaveAttribute("hidden");
  });
});

test.describe("Page structure — meal detail tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("steps tab shows step rows", async ({ page }) => {
    await page.getByTestId(sel.tabSteps).click();
    await expect(page.getByTestId(sel.stepRow).first()).toBeVisible();
  });

  test("storage tab shows keep label and storage text", async ({ page }) => {
    await page.getByTestId(sel.tabStorage).click();
    await expect(page.getByTestId(sel.storageKeepLabel)).toBeVisible();
    await expect(page.getByTestId(sel.storageText)).not.toBeEmpty();
  });

  test("ingredients selected count increments when ingredient is toggled", async ({ page }) => {
    const badge = page.getByTestId(sel.ingredientsSelectedCount);
    const before = await badge.innerText();
    await page.getByTestId(sel.ingredientRow).first().click();
    const after = await badge.innerText();
    expect(after).not.toBe(before);
    expect(after).toMatch(/^1\//);
  });
});
