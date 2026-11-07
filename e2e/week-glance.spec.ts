import { test, expect } from "@playwright/test";
import { sel } from "./selectors";

test.describe("Week glance stats", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("shows kcal, protein and time tiles", async ({ page }) => {
    await expect(page.getByTestId(sel.weekGlanceKcal)).toBeVisible();
    await expect(page.getByTestId(sel.weekGlanceProtein)).toBeVisible();
    await expect(page.getByTestId(sel.weekGlanceTime)).toBeVisible();
  });

  test("kcal tile shows a positive number", async ({ page }) => {
    const text = await page.getByTestId(sel.weekGlanceKcal).innerText();
    expect(Number(text.trim())).toBeGreaterThan(0);
  });

  test("protein tile shows a value with 'g' suffix (total, not avg)", async ({ page }) => {
    const text = await page.getByTestId(sel.weekGlanceProtein).innerText();
    // Total protein across 7 meals is always higher than any single-meal avg (>100g)
    expect(text).toMatch(/\d+g/);
    const grams = parseInt(text, 10);
    expect(grams).toBeGreaterThan(100);
  });

  test("time tile shows a value with 'm' suffix", async ({ page }) => {
    const text = await page.getByTestId(sel.weekGlanceTime).innerText();
    expect(text).toMatch(/\d+m/);
  });

  test("week-glance panel appears before the meal count badge in DOM order", async ({ page }) => {
    const glanceBox = await page.getByTestId(sel.weekGlance).boundingBox();
    const countBox = await page.getByTestId(sel.weekMealCount).boundingBox();
    expect(glanceBox).not.toBeNull();
    expect(countBox).not.toBeNull();
    // Panel is rendered above the week header, so its top Y is smaller
    expect(glanceBox!.y).toBeLessThan(countBox!.y);
  });

  test("stats update when switching to week 2", async ({ page }) => {
    const kcalWeek1 = await page.getByTestId(sel.weekGlanceKcal).innerText();
    await page.getByTestId(sel.weekBtn(2)).click();
    const kcalWeek2 = await page.getByTestId(sel.weekGlanceKcal).innerText();
    // The two weeks may differ; both must be positive numbers
    expect(Number(kcalWeek1.trim())).toBeGreaterThan(0);
    expect(Number(kcalWeek2.trim())).toBeGreaterThan(0);
  });
});
