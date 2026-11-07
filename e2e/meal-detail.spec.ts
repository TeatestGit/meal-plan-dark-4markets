import { test, expect } from "@playwright/test";

test.describe("Meal detail tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("ingredients tab is active by default", async ({ page }) => {
    await expect(page.getByTestId("tab-ingredients")).toHaveClass(/bg-rim/);
    await expect(page.getByRole("heading", { name: "Ingredients" })).toBeVisible();
  });

  test("switching to steps tab shows method heading", async ({ page }) => {
    await page.getByTestId("tab-steps").click();
    await expect(page.getByRole("heading", { name: "Method" })).toBeVisible();
  });

  test("switching to storage tab shows storage heading", async ({ page }) => {
    await page.getByTestId("tab-storage").click();
    await expect(page.getByRole("heading", { name: /Storage/i })).toBeVisible();
  });

  test("ingredients tab shows ingredient rows", async ({ page }) => {
    await expect(page.getByTestId("ingredient-row").first()).toBeVisible();
  });

  test("toggling an ingredient row marks it in-list", async ({ page }) => {
    const first = page.getByTestId("ingredient-row").first();
    await first.click();
    await expect(first).toHaveClass(/bg-rim/);
  });

  test("Add meal button increments the in-list counter", async ({ page }) => {
    await expect(page.getByTestId("in-list-count")).toHaveText("0 in list");
    await page.getByTestId("add-meal-btn").click();
    await expect(page.getByTestId("in-list-count")).not.toHaveText("0 in list");
  });

  test("Clear meal button resets the in-list counter to zero", async ({ page }) => {
    await page.getByTestId("add-meal-btn").click();
    await page.getByTestId("clear-meal-btn").click();
    await expect(page.getByTestId("in-list-count")).toHaveText("0 in list");
  });

  test("steps tab shows numbered step rows", async ({ page }) => {
    await page.getByTestId("tab-steps").click();
    await expect(page.getByTestId("step-row").first()).toBeVisible();
  });

  test("clicking a step row highlights it", async ({ page }) => {
    await page.getByTestId("tab-steps").click();
    const second = page.getByTestId("step-row").nth(1);
    await second.click();
    await expect(second).toHaveClass(/bg-rim/);
  });

  test("storage tab shows the keep label", async ({ page }) => {
    await page.getByTestId("tab-storage").click();
    await expect(page.getByTestId("storage-keep-label")).toBeVisible();
  });

  test("storage tab shows the meal storage text", async ({ page }) => {
    await page.getByTestId("tab-storage").click();
    await expect(page.getByTestId("storage-text")).not.toBeEmpty();
  });

  test("mark planned button toggles planned state", async ({ page }) => {
    const btn = page.getByTestId("mark-planned-btn");
    await expect(btn).toContainText("Mark planned");
    await btn.click();
    await expect(btn).toContainText("Planned");
  });

  test("footer add-to-list button adds ingredients", async ({ page }) => {
    await page.getByTestId("add-list-footer-btn").click();
    await expect(page.getByTestId("in-list-count")).not.toHaveText("0 in list");
  });

  test("selecting a new meal resets tab to ingredients", async ({ page }) => {
    await page.getByTestId("tab-steps").click();
    await expect(page.getByRole("heading", { name: "Method" })).toBeVisible();
    await page.getByTestId("meal-card").nth(1).click();
    await expect(page.getByRole("heading", { name: "Ingredients" })).toBeVisible();
  });
});
