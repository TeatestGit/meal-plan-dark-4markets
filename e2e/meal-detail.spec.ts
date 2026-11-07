import { test, expect } from "@playwright/test";
import { sel } from "./selectors";

test.describe("Meal detail tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("ingredients tab is active by default", async ({ page }) => {
    await expect(page.getByTestId(sel.tabIngredients)).toHaveClass(/bg-rim/);
    await expect(page.getByRole("heading", { name: "Ingredients" })).toBeVisible();
  });

  test("switching to steps tab shows method heading", async ({ page }) => {
    await page.getByTestId(sel.tabSteps).click();
    await expect(page.getByRole("heading", { name: "Method" })).toBeVisible();
  });

  test("switching to storage tab shows storage heading", async ({ page }) => {
    await page.getByTestId(sel.tabStorage).click();
    await expect(page.getByRole("heading", { name: /Storage/i })).toBeVisible();
  });

  test("ingredients tab shows ingredient rows", async ({ page }) => {
    await expect(page.getByTestId(sel.ingredientRow).first()).toBeVisible();
  });

  test("toggling an ingredient row marks it in-list", async ({ page }) => {
    const first = page.getByTestId(sel.ingredientRow).first();
    await first.click();
    await expect(first).toHaveClass(/bg-rim/);
  });

  test("Add meal button increments the in-list counter", async ({ page }) => {
    await expect(page.getByTestId(sel.inListCount)).toHaveText("0 in list");
    await page.getByTestId(sel.addMealBtn).click();
    await expect(page.getByTestId(sel.inListCount)).not.toHaveText("0 in list");
  });

  test("Clear meal button resets the in-list counter to zero", async ({ page }) => {
    await page.getByTestId(sel.addMealBtn).click();
    await page.getByTestId(sel.clearMealBtn).click();
    await expect(page.getByTestId(sel.inListCount)).toHaveText("0 in list");
  });

  test("steps tab shows numbered step rows", async ({ page }) => {
    await page.getByTestId(sel.tabSteps).click();
    await expect(page.getByTestId(sel.stepRow).first()).toBeVisible();
  });

  test("clicking a step row highlights it", async ({ page }) => {
    await page.getByTestId(sel.tabSteps).click();
    const second = page.getByTestId(sel.stepRow).nth(1);
    await second.click();
    await expect(second).toHaveClass(/bg-rim/);
  });

  test("storage tab shows the keep label", async ({ page }) => {
    await page.getByTestId(sel.tabStorage).click();
    await expect(page.getByTestId(sel.storageKeepLabel)).toBeVisible();
  });

  test("storage tab shows the meal storage text", async ({ page }) => {
    await page.getByTestId(sel.tabStorage).click();
    await expect(page.getByTestId(sel.storageText)).not.toBeEmpty();
  });

  test("mark planned button toggles planned state", async ({ page }) => {
    const btn = page.getByTestId(sel.markPlannedBtn);
    await expect(btn).toContainText("Mark planned");
    await btn.click();
    await expect(btn).toContainText("Planned");
  });

  test("footer add-to-list button adds ingredients", async ({ page }) => {
    await page.getByTestId(sel.addListFooterBtn).click();
    await expect(page.getByTestId(sel.inListCount)).not.toHaveText("0 in list");
  });

  test("selecting a new meal resets tab to ingredients", async ({ page }) => {
    await page.getByTestId(sel.tabSteps).click();
    await expect(page.getByRole("heading", { name: "Method" })).toBeVisible();
    await page.getByTestId(sel.mealCard).nth(1).click();
    await expect(page.getByRole("heading", { name: "Ingredients" })).toBeVisible();
  });
});
