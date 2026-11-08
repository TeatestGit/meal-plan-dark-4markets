import { test, expect } from "@playwright/test";
import { sel } from "./selectors";

test.describe("Plan switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("both plan tabs are visible", async ({ page }) => {
    await expect(page.getByTestId(sel.planBtn("no-red-meat"))).toBeVisible();
    await expect(page.getByTestId(sel.planBtn("vegan"))).toBeVisible();
  });

  test("No Red Meat plan is active by default", async ({ page }) => {
    await expect(page.getByTestId(sel.planBtn("no-red-meat"))).toHaveClass(/bg-ink-primary/);
    await expect(page.getByTestId(sel.planBtn("vegan"))).not.toHaveClass(/bg-ink-primary/);
  });

  test("No Red Meat plan shows 7 meal cards on load", async ({ page }) => {
    await expect(page.getByTestId(sel.mealCard)).toHaveCount(7);
  });

  test("switching to Vegan plan activates its tab", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    await expect(page.getByTestId(sel.planBtn("vegan"))).toHaveClass(/bg-ink-primary/);
    await expect(page.getByTestId(sel.planBtn("no-red-meat"))).not.toHaveClass(/bg-ink-primary/);
  });

  test("switching to Vegan shows 7 vegan week-1 meal cards", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    await expect(page.getByTestId(sel.mealCard)).toHaveCount(7);
  });

  test("switching to Vegan shows a vegan meal title", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    await expect(page.getByText(/spiced chickpea/i).first()).toBeVisible();
  });

  test("switching to Vegan hides no-red-meat meals", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    await expect(page.getByText(/harissa chicken/i)).not.toBeVisible();
  });

  test("switching plan resets week selector to Week 1", async ({ page }) => {
    await page.getByTestId(sel.weekBtn(2)).click();
    await page.getByTestId(sel.planBtn("vegan")).click();
    await expect(page.getByTestId(sel.weekBtn(1))).toHaveClass(/bg-ink-primary/);
  });

  test("hero eyebrow updates to show active plan label", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    // footer is always rendered and carries the plan label on all viewports
    await expect(page.locator("footer")).toContainText("Vegan");
  });

  test("footer updates to show active plan label", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toContainText("No Red Meat");
    await page.getByTestId(sel.planBtn("vegan")).click();
    await expect(footer).toContainText("Vegan");
    await expect(footer).not.toContainText("No Red Meat");
  });

  test("stats bar remains populated after switching plans", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    const kcal = await page.getByTestId(sel.statAvgKcal).innerText();
    const protein = await page.getByTestId(sel.statAvgProtein).innerText();
    expect(kcal).toMatch(/Avg/i);
    expect(protein).toMatch(/Avg/i);
  });

  test("week glance stats remain populated after switching plans", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    await expect(page.getByTestId(sel.weekGlanceKcal)).not.toBeEmpty();
    await expect(page.getByTestId(sel.weekGlanceProtein)).not.toBeEmpty();
    await expect(page.getByTestId(sel.weekGlanceTime)).not.toBeEmpty();
  });

  test("switching back to No Red Meat restores its meals", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    await page.getByTestId(sel.planBtn("no-red-meat")).click();
    await expect(page.getByText(/harissa chicken/i).first()).toBeVisible();
  });

  test("vegan plan week 2 shows 7 meals", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    await page.getByTestId(sel.weekBtn(2)).click();
    await expect(page.getByTestId(sel.mealCard)).toHaveCount(7);
  });

  test("add week on vegan plan adds only vegan ingredients", async ({ page }) => {
    await page.getByTestId(sel.planBtn("vegan")).click();
    await page.getByTestId(sel.addWeekBtn).click();
    // shopping list should be non-empty
    await expect(page.getByTestId(sel.emptyState)).not.toBeVisible();
    // no chicken breast (a no-red-meat ingredient) should appear in the list
    const listText = await page.locator("[data-testid='list-item']").allInnerTexts();
    expect(listText.join(" ")).not.toMatch(/chicken breast/i);
  });
});
