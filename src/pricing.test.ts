import { describe, expect, it } from "vitest";
import { calculateIngredientCost, parseIngredientQuantity } from "./pricing";
import type { PriceEntry } from "./types";

const chickenPrice: PriceEntry = {
  unit: "kg",
  carrefour: 42,
  lulu: 38,
  spinneys: 59.25,
  geant: 45,
};

describe("ingredient cost estimates", () => {
  it("converts recipe weights to a per-kilogram price", () => {
    expect(calculateIngredientCost("300g chicken breast, cubed", chickenPrice)?.prices.carrefour).toBe(12.6);
  });

  it("converts tablespoons to milliliters for package pricing", () => {
    const oilPrice: PriceEntry = {
      unit: "500ml",
      carrefour: 26,
      lulu: 24,
      spinneys: 32,
      geant: 28,
    };

    expect(calculateIngredientCost("2 tbsp olive oil", oilPrice)?.prices.carrefour).toBe(1.56);
  });

  it("prices whole packages and package counts", () => {
    const canPrice: PriceEntry = {
      unit: "185g can",
      carrefour: 7.5,
      lulu: 6.5,
      spinneys: 9.5,
      geant: 5.5,
    };

    expect(calculateIngredientCost("2 x 145g cans tuna in water", canPrice)?.prices.carrefour).toBe(15);
    expect(calculateIngredientCost("145g tuna in olive oil, drained", canPrice)?.prices.carrefour).toBe(5.88);
    expect(parseIngredientQuantity("2 whole wheat wraps")).toEqual({ amount: 2, unit: "count" });
  });

  it("leaves compound or incompatible quantities unpriced", () => {
    expect(parseIngredientQuantity("30g tomatoes + 30g feta")).toBeNull();
    expect(calculateIngredientCost("1/2 lemon", chickenPrice)).toBeNull();
  });
});
