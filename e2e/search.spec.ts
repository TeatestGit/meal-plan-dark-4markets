import { test, expect } from "@playwright/test";
import { sel } from "./selectors";

test.describe("Search / filter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("search input is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.searchInput)).toBeVisible();
  });

  test("typing a meal title filters the meal list", async ({ page }) => {
    await page.getByTestId(sel.searchInput).fill("chicken");
    const cards = page.getByTestId(sel.mealCard);
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const text = (await cards.nth(i).textContent())!.toLowerCase();
      expect(text).toContain("chicken");
    }
  });

  test("no-match search shows the empty state", async ({ page }) => {
    await page.getByTestId(sel.searchInput).fill("xyznonexistent");
    await expect(page.getByTestId(sel.noResults)).toBeVisible();
    await expect(page.getByTestId(sel.mealCard)).toHaveCount(0);
  });

  test("clearing search restores the full list", async ({ page }) => {
    await page.getByTestId(sel.searchInput).fill("salmon");
    const filtered = await page.getByTestId(sel.mealCard).count();
    await page.getByTestId(sel.searchInput).clear();
    const restored = await page.getByTestId(sel.mealCard).count();
    expect(restored).toBeGreaterThan(filtered);
  });

  test("searching by ingredient finds matching meals", async ({ page }) => {
    await page.getByTestId(sel.searchInput).fill("feta");
    await expect(page.getByTestId(sel.mealCard).first()).toBeVisible();
  });
});
