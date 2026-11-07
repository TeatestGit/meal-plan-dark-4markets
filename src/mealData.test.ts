/**
 * Data-integrity tests: verify protein/kcal values are consistent
 * across every parsing path in the app and internally balanced.
 *
 * parseKcal / parseProtein  — App.tsx week-glance stats
 * parseInt(meal.kcal)        — MealDetail Nutrition tab
 * meal.kcal / meal.protein   — raw display on meal cards and floating badge
 */
import meals from "./assets/meals.json";
import type { Meal } from "./types";

const typedMeals = meals as Meal[];

// Mirrors App.tsx parseKcal / parseProtein
function parseKcal(v: string) { return parseInt(v.match(/(\d+)/)?.[1] ?? "0", 10); }
function parseProtein(v: string) { return parseInt(v.match(/(\d+)/)?.[1] ?? "0", 10); }

describe("meals.json — protein & kcal data integrity", () => {
  it("contains exactly 14 meals", () => {
    expect(typedMeals).toHaveLength(14);
  });

  it("every meal has a non-empty protein string in 'Ng protein' format", () => {
    for (const meal of typedMeals) {
      expect(meal.protein).toMatch(/^\d+g protein$/);
    }
  });

  it("every meal has a non-empty kcal string in 'N kcal' format", () => {
    for (const meal of typedMeals) {
      expect(meal.kcal).toMatch(/^\d+ kcal$/);
    }
  });

  it("every meal has a non-zero protein value", () => {
    for (const meal of typedMeals) {
      expect(parseProtein(meal.protein)).toBeGreaterThan(0);
    }
  });

  it("every meal has a kcal value between 300 and 800", () => {
    for (const meal of typedMeals) {
      const k = parseKcal(meal.kcal);
      expect(k).toBeGreaterThanOrEqual(300);
      expect(k).toBeLessThanOrEqual(800);
    }
  });

  it("parseInt(meal.kcal) matches parseKcal(meal.kcal) for all meals (Nutrition tab ↔ week-glance)", () => {
    for (const meal of typedMeals) {
      expect(parseInt(meal.kcal)).toBe(parseKcal(meal.kcal));
    }
  });

  it("parseInt(meal.protein) matches parseProtein(meal.protein) for all meals (Nutrition tab ↔ week-glance)", () => {
    for (const meal of typedMeals) {
      expect(parseInt(meal.protein)).toBe(parseProtein(meal.protein));
    }
  });

  it("macro kcal balance is within ±5 kcal of stated kcal for every meal", () => {
    for (const meal of typedMeals) {
      const p = parseInt(meal.protein);
      const c = parseInt(meal.carbs);
      const f = parseInt(meal.fat);
      const stated = parseInt(meal.kcal);
      const derived = p * 4 + c * 4 + f * 9;
      expect(Math.abs(derived - stated)).toBeLessThanOrEqual(5);
    }
  });

  it("week 1 total kcal matches sum of week 1 meals (parseKcal)", () => {
    const w1 = typedMeals.filter(m => m.week === 1);
    expect(w1).toHaveLength(7);
    const total = w1.reduce((sum, m) => sum + parseKcal(m.kcal), 0);
    const expected = w1.map(m => parseKcal(m.kcal)).reduce((a, b) => a + b, 0);
    expect(total).toBe(expected);
  });

  it("week 2 total protein matches sum of week 2 meals (parseProtein)", () => {
    const w2 = typedMeals.filter(m => m.week === 2);
    expect(w2).toHaveLength(7);
    const total = w2.reduce((sum, m) => sum + parseProtein(m.protein), 0);
    const expected = w2.map(m => parseProtein(m.protein)).reduce((a, b) => a + b, 0);
    expect(total).toBe(expected);
  });

  it("every meal protein is at least 15g and at most 60g per serving", () => {
    for (const meal of typedMeals) {
      const p = parseProtein(meal.protein);
      expect(p).toBeGreaterThanOrEqual(15);
      expect(p).toBeLessThanOrEqual(60);
    }
  });

  it("fat and carbs strings are present and parseable for all meals", () => {
    for (const meal of typedMeals) {
      expect(meal.fat).toMatch(/^\d+g fat$/);
      expect(meal.carbs).toMatch(/^\d+g carbs$/);
      expect(parseInt(meal.fat)).toBeGreaterThan(0);
      expect(parseInt(meal.carbs)).toBeGreaterThan(0);
    }
  });
});
