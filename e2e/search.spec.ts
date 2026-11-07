import { test, expect } from "@playwright/test";

test.describe("Search / filter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("search input is visible", async ({ page }) => {
    await expect(page.getByTestId("search-input")).toBeVisible();
  });

  test("typing a meal title filters the meal list", async ({ page }) => {
    await page.getByTestId("search-input").fill("chicken");
    const cards = page.getByTestId("meal-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const text = (await cards.nth(i).textContent())!.toLowerCase();
      expect(text).toContain("chicken");
    }
  });

  test("no-match search shows the empty state", async ({ page }) => {
    await page.getByTestId("search-input").fill("xyznonexistent");
    await expect(page.getByTestId("no-results")).toBeVisible();
    await expect(page.getByTestId("meal-card")).toHaveCount(0);
  });

  test("clearing search restores the full list", async ({ page }) => {
    await page.getByTestId("search-input").fill("salmon");
    const filtered = await page.getByTestId("meal-card").count();
    await page.getByTestId("search-input").clear();
    const restored = await page.getByTestId("meal-card").count();
    expect(restored).toBeGreaterThan(filtered);
  });

  test("searching by ingredient finds matching meals", async ({ page }) => {
    await page.getByTestId("search-input").fill("feta");
    await expect(page.getByTestId("meal-card").first()).toBeVisible();
  });
});
