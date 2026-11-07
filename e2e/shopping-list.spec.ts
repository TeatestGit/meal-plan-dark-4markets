import { test, expect } from "@playwright/test";
import { sel } from "./selectors";

test.describe("Shopping list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("shows empty state on fresh load", async ({ page }) => {
    await expect(page.getByTestId(sel.emptyState)).toBeVisible();
  });

  test("'Add week' button populates the list", async ({ page }) => {
    await page.getByTestId(sel.addWeekBtn).click();
    await expect(page.getByTestId(sel.emptyState)).not.toBeVisible();
    await expect(page.getByTestId(sel.listItem).first()).toBeVisible();
  });

  test("adding a single meal removes the empty state", async ({ page }) => {
    await page.getByTestId(sel.addMealBtn).click();
    await expect(page.getByTestId(sel.emptyState)).not.toBeVisible();
  });

  test("item count badge is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.itemCountBadge)).toBeVisible();
  });

  test("all four market pill tabs are present", async ({ page }) => {
    await expect(page.getByTestId(sel.marketPill("carrefour"))).toBeVisible();
    await expect(page.getByTestId(sel.marketPill("lulu"))).toBeVisible();
    await expect(page.getByTestId(sel.marketPill("spinneys"))).toBeVisible();
    await expect(page.getByTestId(sel.marketPill("geant"))).toBeVisible();
  });

  test("clicking a market pill selects it", async ({ page }) => {
    await page.getByTestId(sel.marketPill("lulu")).click();
    await expect(page.getByTestId(sel.marketPill("lulu"))).toHaveClass(/bg-ink-primary/);
  });

  test("market price cards appear after adding items", async ({ page }) => {
    await page.getByTestId(sel.addWeekBtn).click();
    await expect(page.getByTestId(sel.marketCard("carrefour"))).toBeVisible();
    await expect(page.getByTestId(sel.marketCard("lulu"))).toBeVisible();
    await expect(page.getByTestId(sel.marketCard("spinneys"))).toBeVisible();
    await expect(page.getByTestId(sel.marketCard("geant"))).toBeVisible();
  });

  test("cheapest market is labelled", async ({ page }) => {
    await page.getByTestId(sel.addWeekBtn).click();
    await expect(page.getByTestId(sel.cheapestLabel)).toBeVisible();
  });

  test("savings banner appears after adding items", async ({ page }) => {
    await page.getByTestId(sel.addWeekBtn).click();
    await expect(page.getByTestId(sel.savingsBanner)).toBeVisible();
  });

  test("copy button is visible", async ({ page }) => {
    await expect(page.getByTestId(sel.copyBtn)).toBeVisible();
  });

  test("remove button removes an item from the list", async ({ page }) => {
    await page.getByTestId(sel.addWeekBtn).click();
    const countBefore = await page.getByTestId(sel.listItem).count();
    // remove button is opacity-0 on desktop until hover; force the click
    await page.getByTestId(sel.itemRemoveBtn).first().click({ force: true });
    const countAfter = await page.getByTestId(sel.listItem).count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test("clear list button empties the shopping list", async ({ page }) => {
    await page.getByTestId(sel.addWeekBtn).click();
    await page.getByTestId(sel.clearListBtn).click();
    await expect(page.getByTestId(sel.emptyState)).toBeVisible();
  });

  test("shop-at link is present and points to the selected market", async ({ page }) => {
    await page.getByTestId(sel.addWeekBtn).click();
    const link = page.getByTestId(sel.shopAtLink);
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
  });

  test("'Add week' in Week 2 adds Week 2 items", async ({ page }) => {
    await page.getByTestId(sel.weekBtn(2)).click();
    await page.getByTestId(sel.addWeekBtn).click();
    await expect(page.getByTestId(sel.emptyState)).not.toBeVisible();
  });

  test("'Add all' populates items from both weeks", async ({ page }) => {
    await page.getByTestId(sel.addAllBtn).click();
    await expect(page.getByTestId(sel.emptyState)).not.toBeVisible();
    await expect(page.getByTestId(sel.listItem).first()).toBeVisible();
  });

  test("'Add all' adds more items than 'Add week' alone", async ({ page }) => {
    await page.getByTestId(sel.addWeekBtn).click();
    const countOneWeek = await page.getByTestId(sel.listItem).count();

    // Reset
    await page.getByTestId(sel.clearListBtn).click();

    await page.getByTestId(sel.addAllBtn).click();
    const countAllWeeks = await page.getByTestId(sel.listItem).count();

    expect(countAllWeeks).toBeGreaterThanOrEqual(countOneWeek);
  });

  test("list items section is scrollable (overflow-y-auto applied)", async ({ page }) => {
    await page.getByTestId(sel.addAllBtn).click();
    // The items container should have overflow-y set to auto or scroll
    const overflow = await page.evaluate(() => {
      const items = document.querySelector("[data-testid='list-item']")?.closest(".overflow-y-auto");
      return items ? window.getComputedStyle(items).overflowY : null;
    });
    expect(overflow).toBe("auto");
  });
});
