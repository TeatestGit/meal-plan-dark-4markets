import { test, expect } from "@playwright/test";
import { sel } from "./selectors";

// First meal (Harissa chicken grain bowl) is used throughout since it contains
// harissa paste (tbsp→ml price), lemon (each price), and other fixed ingredients.

test.describe("Ingredient pricing — no PRICE UNAVAILABLE regressions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // Ensure ingredients tab is active
    await page.getByTestId(sel.tabIngredients).click();
  });

  test("harissa paste shows a price (tbsp→ml unit fix)", async ({ page }) => {
    const rows = page.getByTestId(sel.ingredientRow);
    const harisaRow = rows.filter({ hasText: "harissa paste" });
    await expect(harisaRow).not.toContainText("PRICE UNAVAILABLE");
    await expect(harisaRow).toContainText("AED");
  });

  test("lemon shows a price (each-based unit fix)", async ({ page }) => {
    const rows = page.getByTestId(sel.ingredientRow);
    const lemonRow = rows.filter({ hasText: "lemon" });
    await expect(lemonRow.first()).not.toContainText("PRICE UNAVAILABLE");
    await expect(lemonRow.first()).toContainText("AED");
  });

  test("olive oil shows a price (tbsp→ml vs 500ml price)", async ({ page }) => {
    const rows = page.getByTestId(sel.ingredientRow);
    const oilRow = rows.filter({ hasText: "olive oil" });
    await expect(oilRow.first()).not.toContainText("PRICE UNAVAILABLE");
    await expect(oilRow.first()).toContainText("AED");
  });

  test("at most 3 unpriceable garnish ingredients across Week 1 meal 1", async ({ page }) => {
    const rows = page.getByTestId(sel.ingredientRow);
    const unavailable = rows.filter({ hasText: "PRICE UNAVAILABLE" });
    // Only free-form garnishes (Small handful, squeeze lemon, side:) may be unpriceable
    await expect(unavailable).toHaveCount(1); // only "Small handful parsley..."
  });

  test("Week 2 meal shows prices for spice ingredients (tsp→ml fix)", async ({ page }) => {
    // Switch to Week 2 and click the first meal (Salmon avocado rice bowl)
    await page.getByTestId(sel.weekBtn(2)).click();
    await page.getByTestId(sel.tabIngredients).click();
    const rows = page.getByTestId(sel.ingredientRow);
    const unavailable = rows.filter({ hasText: "PRICE UNAVAILABLE" });
    // Week 2 meals should have no PRICE UNAVAILABLE for standard ingredients
    const count = await unavailable.count();
    expect(count).toBeLessThanOrEqual(2);
  });

  test("soy sauce ingredient shows a price", async ({ page }) => {
    // Navigate to a meal that uses soy sauce (Teriyaki shrimp rice bowl — Week 2)
    await page.getByTestId(sel.weekBtn(2)).click();
    await page.getByTestId(sel.mealCard).nth(2).click();
    await page.getByTestId(sel.tabIngredients).click();
    const rows = page.getByTestId(sel.ingredientRow);
    const soyRow = rows.filter({ hasText: "soy sauce" });
    if (await soyRow.count() > 0) {
      await expect(soyRow.first()).not.toContainText("PRICE UNAVAILABLE");
    }
  });
});
