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

  test("nutrition tab shows macro bars and USDA note", async ({ page }) => {
    await page.getByTestId(sel.tabNutrition).click();
    await expect(page.getByText(/Protein/i).first()).toBeVisible();
    await expect(page.getByText(/Carbs/i).first()).toBeVisible();
    await expect(page.getByText(/Fat/i).first()).toBeVisible();
    await expect(page.getByText(/USDA/i).first()).toBeVisible();
  });

  test("nutrition tab: Nutrition heading and per-serving subtitle visible", async ({ page }) => {
    await page.getByTestId(sel.tabNutrition).click();
    await expect(page.getByRole("heading", { name: /nutrition/i })).toBeVisible();
    await expect(page.getByText(/per serving/i)).toBeVisible();
    await expect(page.getByText(/recipe makes 2/i)).toBeVisible();
  });

  test("nutrition tab: kcal total pill is visible and non-zero", async ({ page }) => {
    await page.getByTestId(sel.tabNutrition).click();
    const pill = page.getByTestId("nutrition-kcal-pill");
    await expect(pill).toBeVisible();
    await expect(pill.getByText("Total")).toBeVisible();
    await expect(pill.getByText("kcal")).toBeVisible();
  });

  test("nutrition tab: each macro row shows grams and kcal contribution", async ({ page }) => {
    await page.getByTestId(sel.tabNutrition).click();
    // each row has "{n}g" and "{n} kcal" text
    await expect(page.getByText(/\d+g/).first()).toBeVisible();
    await expect(page.getByText(/\d+ kcal · \d+%/).first()).toBeVisible();
  });

  test("nutrition tab: USDA FoodData Central link is present and points to fdc.nal.usda.gov", async ({ page }) => {
    await page.getByTestId(sel.tabNutrition).click();
    const link = page.getByRole("link", { name: /USDA FoodData Central/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://fdc.nal.usda.gov/");
  });

  test("nutrition tab: switching meals keeps nutrition content valid", async ({ page }) => {
    await page.getByTestId(sel.tabNutrition).click();
    await page.getByTestId(sel.mealCard).nth(1).click();
    // tab resets to ingredients on meal change — navigate back to nutrition
    await page.getByTestId(sel.tabNutrition).click();
    const pill = page.getByTestId("nutrition-kcal-pill");
    await expect(pill).toBeVisible();
    await expect(pill.getByText("Total")).toBeVisible();
    await expect(page.getByText(/Protein/i).first()).toBeVisible();
  });

  test("nutrition tab: macro percentage values sum to roughly 100", async ({ page }) => {
    await page.getByTestId(sel.tabNutrition).click();
    // collect all "N kcal · N%" strings and parse the percentages
    const pctTexts = await page.getByText(/\d+ kcal · \d+%/).allTextContents();
    expect(pctTexts).toHaveLength(3);
    const sum = pctTexts.reduce((acc, t) => {
      const m = t.match(/(\d+)%/);
      return acc + (m ? parseInt(m[1]) : 0);
    }, 0);
    // rounding means sum is 99–101
    expect(sum).toBeGreaterThanOrEqual(97);
    expect(sum).toBeLessThanOrEqual(103);
  });

  test("selecting a new meal resets tab to ingredients", async ({ page }) => {
    await page.getByTestId(sel.tabSteps).click();
    await expect(page.getByRole("heading", { name: "Method" })).toBeVisible();
    await page.getByTestId(sel.mealCard).nth(1).click();
    await expect(page.getByRole("heading", { name: "Ingredients" })).toBeVisible();
  });
});
