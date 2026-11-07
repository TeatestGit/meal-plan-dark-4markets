import { test, expect } from "@playwright/test";

test.describe("Week switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads Week 1 by default", async ({ page }) => {
    await expect(page.getByTestId("week-btn-1")).toHaveClass(/bg-ink-primary/);
  });

  test("switches to Week 2 and updates the meal list header", async ({ page }) => {
    await page.getByTestId("week-btn-2").click();
    await expect(page.getByTestId("week-btn-2")).toHaveClass(/bg-ink-primary/);
  });

  test("switches back to Week 1 from Week 2", async ({ page }) => {
    await page.getByTestId("week-btn-2").click();
    await page.getByTestId("week-btn-1").click();
    await expect(page.getByTestId("week-btn-1")).toHaveClass(/bg-ink-primary/);
  });

  test("stats bar renders all three tiles after switching weeks", async ({ page }) => {
    await expect(page.getByTestId("stat-avg-kcal")).toBeVisible();
    await expect(page.getByTestId("stat-avg-protein")).toBeVisible();
    await expect(page.getByTestId("stat-total-time")).toBeVisible();
    await page.getByTestId("week-btn-2").click();
    await expect(page.getByTestId("stat-avg-kcal")).toBeVisible();
    await expect(page.getByTestId("stat-avg-protein")).toBeVisible();
    await expect(page.getByTestId("stat-total-time")).toBeVisible();
  });
});
