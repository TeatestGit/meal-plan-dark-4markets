import { test, expect } from "@playwright/test";
import { sel } from "./selectors";

test.describe("Week switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads Week 1 by default", async ({ page }) => {
    await expect(page.getByTestId(sel.weekBtn(1))).toHaveClass(/bg-ink-primary/);
  });

  test("switches to Week 2 and updates the meal list header", async ({ page }) => {
    await page.getByTestId(sel.weekBtn(2)).click();
    await expect(page.getByTestId(sel.weekBtn(2))).toHaveClass(/bg-ink-primary/);
  });

  test("switches back to Week 1 from Week 2", async ({ page }) => {
    await page.getByTestId(sel.weekBtn(2)).click();
    await page.getByTestId(sel.weekBtn(1)).click();
    await expect(page.getByTestId(sel.weekBtn(1))).toHaveClass(/bg-ink-primary/);
  });

  test("stats bar renders all three tiles after switching weeks", async ({ page }) => {
    await expect(page.getByTestId(sel.statAvgKcal)).toBeVisible();
    await expect(page.getByTestId(sel.statAvgProtein)).toBeVisible();
    await expect(page.getByTestId(sel.statTotalTime)).toBeVisible();
    await page.getByTestId(sel.weekBtn(2)).click();
    await expect(page.getByTestId(sel.statAvgKcal)).toBeVisible();
    await expect(page.getByTestId(sel.statAvgProtein)).toBeVisible();
    await expect(page.getByTestId(sel.statTotalTime)).toBeVisible();
  });
});
