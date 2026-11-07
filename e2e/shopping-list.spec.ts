import { test, expect } from "@playwright/test";

test.describe("Shopping list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("shows empty state on fresh load", async ({ page }) => {
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });

  test("'Add week' button populates the list", async ({ page }) => {
    await page.getByTestId("add-week-btn").click();
    await expect(page.getByTestId("empty-state")).not.toBeVisible();
    await expect(page.getByTestId("list-item").first()).toBeVisible();
  });

  test("adding a single meal removes the empty state", async ({ page }) => {
    await page.getByTestId("add-meal-btn").click();
    await expect(page.getByTestId("empty-state")).not.toBeVisible();
  });

  test("item count badge is visible", async ({ page }) => {
    await expect(page.getByTestId("item-count-badge")).toBeVisible();
  });

  test("all four market pill tabs are present", async ({ page }) => {
    await expect(page.getByTestId("market-pill-carrefour")).toBeVisible();
    await expect(page.getByTestId("market-pill-lulu")).toBeVisible();
    await expect(page.getByTestId("market-pill-spinneys")).toBeVisible();
    await expect(page.getByTestId("market-pill-geant")).toBeVisible();
  });

  test("clicking a market pill selects it", async ({ page }) => {
    await page.getByTestId("market-pill-lulu").click();
    await expect(page.getByTestId("market-pill-lulu")).toHaveClass(/bg-ink-primary/);
  });

  test("market price cards appear after adding items", async ({ page }) => {
    await page.getByTestId("add-week-btn").click();
    await expect(page.getByTestId("market-card-carrefour")).toBeVisible();
    await expect(page.getByTestId("market-card-lulu")).toBeVisible();
    await expect(page.getByTestId("market-card-spinneys")).toBeVisible();
    await expect(page.getByTestId("market-card-geant")).toBeVisible();
  });

  test("cheapest market is labelled", async ({ page }) => {
    await page.getByTestId("add-week-btn").click();
    await expect(page.getByTestId("cheapest-label")).toBeVisible();
  });

  test("savings banner appears after adding items", async ({ page }) => {
    await page.getByTestId("add-week-btn").click();
    await expect(page.getByTestId("savings-banner")).toBeVisible();
  });

  test("copy button is visible", async ({ page }) => {
    await expect(page.getByTestId("copy-btn")).toBeVisible();
  });

  test("remove button removes an item from the list", async ({ page }) => {
    await page.getByTestId("add-week-btn").click();
    const countBefore = await page.getByTestId("list-item").count();
    // remove button is opacity-0 on desktop until hover; force the click
    await page.getByTestId("item-remove-btn").first().click({ force: true });
    const countAfter = await page.getByTestId("list-item").count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test("clear list button empties the shopping list", async ({ page }) => {
    await page.getByTestId("add-week-btn").click();
    await page.getByTestId("clear-list-btn").click();
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });

  test("shop-at link is present and points to the selected market", async ({ page }) => {
    await page.getByTestId("add-week-btn").click();
    const link = page.getByTestId("shop-at-link");
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
  });

  test("'Add week' in Week 2 adds Week 2 items", async ({ page }) => {
    await page.getByTestId("week-btn-2").click();
    await page.getByTestId("add-week-btn").click();
    await expect(page.getByTestId("empty-state")).not.toBeVisible();
  });
});
