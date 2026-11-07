import { test, expect } from "@playwright/test";

test.describe("Meal selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("first meal card is selected on load", async ({ page }) => {
    await expect(page.getByTestId("meal-card").first()).toHaveAttribute("aria-pressed", "true");
  });

  test("clicking a meal card selects it and deselects the previous one", async ({ page }) => {
    const cards = page.getByTestId("meal-card");
    const second = cards.nth(1);
    await second.click();
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(cards.first()).toHaveAttribute("aria-pressed", "false");
  });

  test("selected meal hero title updates to match the clicked card", async ({ page }) => {
    const third = page.getByTestId("meal-card").nth(2);
    const cardTitle = await third.locator(".font-instrument").textContent();
    await third.click();
    await expect(page.locator("#hero-title")).toContainText(cardTitle!.trim().slice(0, 10));
  });

  test("meal count badge shows correct number for Week 1", async ({ page }) => {
    await expect(page.getByTestId("week-meal-count")).toContainText("7 lunches");
  });

  test("meal count badge updates when switching to Week 2", async ({ page }) => {
    await page.getByTestId("week-btn-2").click();
    await expect(page.getByTestId("week-meal-count")).toContainText("7 lunches");
  });
});
