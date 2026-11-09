import { test, expect } from "@playwright/test";
import { sel } from "./selectors";

test.describe("v2 — price-free build", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index-v2.html");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // ── Presence ──────────────────────────────────────────────────────────────

  test("page heading is visible", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("plan switcher buttons are present", async ({ page }) => {
    await expect(page.getByTestId(sel.planBtn("no-red-meat"))).toBeVisible();
  });

  test("week-glance stats panel is present", async ({ page }) => {
    await expect(page.getByTestId(sel.weekGlance)).toBeVisible();
  });

  test("meal selector grid is present", async ({ page }) => {
    await expect(page.getByTestId(sel.mealCard).first()).toBeVisible();
  });

  // ── Absence of pricing/shopping UI ───────────────────────────────────────

  test("no shopping list panel", async ({ page }) => {
    await expect(page.locator("[data-testid^='market-']").first()).not.toBeAttached();
    await expect(page.getByTestId(sel.emptyState)).not.toBeAttached();
  });

  test("no market price cards", async ({ page }) => {
    await expect(page.getByTestId(sel.marketCard("carrefour"))).not.toBeAttached();
  });

  test("no Add week button", async ({ page }) => {
    await expect(page.getByTestId(sel.addWeekBtn)).not.toBeAttached();
  });

  test("no Add meal to list button", async ({ page }) => {
    await expect(page.getByTestId(sel.addMealBtn)).not.toBeAttached();
  });

  // ── Ingredient rows are read-only ─────────────────────────────────────────

  test("ingredient rows render as divs (not interactive buttons)", async ({ page }) => {
    await page.getByTestId(sel.mealCard).first().click();
    const rows = page.getByTestId(sel.ingredientRow);
    await expect(rows.first()).toBeVisible();
    const tag = await rows.first().evaluate((el) => el.tagName.toLowerCase());
    expect(tag).toBe("div");
  });

  // ── Planned meal toggle works without shopping state ─────────────────────

  test("can mark a meal as planned", async ({ page }) => {
    await page.getByTestId(sel.mealCard).first().click();
    const btn = page.getByTestId(sel.markPlannedBtn);
    await btn.click();
    await expect(btn).toContainText(/planned/i);
  });
});
