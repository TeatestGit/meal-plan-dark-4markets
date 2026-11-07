import { describe, expect, it } from "vitest";
import { calculateIngredientCost, parseIngredientQuantity } from "./pricing";
import { findPriceEntry } from "./data/prices";
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

  it("leaves incompatible unit quantities unpriced", () => {
    expect(calculateIngredientCost("1/2 lemon", chickenPrice)).toBeNull();
  });

  it("prices only the first component of a measured compound ingredient", () => {
    // "30g tomatoes + 30g feta" → prices 30g (tomatoes); second component is ignored
    expect(parseIngredientQuantity("30g tomatoes + 30g feta")).toEqual({ amount: 30, unit: "g" });
  });
});

describe("parseIngredientQuantity — + suffix fix", () => {
  it("parses count ingredient that has a descriptive + suffix", () => {
    // '1/2 lemon, juice + zest' — the + is after the ingredient name, not a compound measurement
    expect(parseIngredientQuantity("1/2 lemon, juice + zest")).toEqual({ amount: 0.5, unit: "count" });
  });

  it("prices the first component of a compound measured ingredient", () => {
    // '1 tbsp oil + lime juice' → 15ml (oil); '1 tsp sesame oil + 1 tbsp seeds' → 5ml
    expect(parseIngredientQuantity("1 tbsp olive oil + lime juice")).toEqual({ amount: 15, unit: "ml" });
    expect(parseIngredientQuantity("1 tsp sesame oil + 1 tbsp sesame seeds")).toEqual({ amount: 5, unit: "ml" });
    expect(parseIngredientQuantity("1 tsp cumin + 1 tsp turmeric")).toEqual({ amount: 5, unit: "ml" });
  });

  it("parses plural count words correctly", () => {
    expect(parseIngredientQuantity("2 whole wheat wraps (60g each)")).toEqual({ amount: 2, unit: "count" });
    expect(parseIngredientQuantity("2 wholemeal bagels (90g each), split")).toEqual({ amount: 2, unit: "count" });
  });
});

describe("calculateIngredientCost — ml-based spice and paste prices", () => {
  const harisaPrice: PriceEntry = { unit: "100ml", carrefour: 9.5, lulu: 8.5, spinneys: 12, geant: 10.3 };
  const cuminPrice: PriceEntry  = { unit: "50ml",  carrefour: 5.5, lulu: 4.8, spinneys: 7,  geant: 6 };
  const honeyPrice: PriceEntry  = { unit: "250ml", carrefour: 18,  lulu: 16,  spinneys: 24, geant: 19.5 };

  it("prices tbsp-measured paste against an ml-based price entry", () => {
    const result = calculateIngredientCost("1.5 tbsp harissa paste", harisaPrice);
    expect(result).not.toBeNull();
    // 1.5 tbsp = 22.5 ml; 22.5 / 100 * 9.5 ≈ 2.14
    expect(result?.prices.carrefour).toBe(2.14);
  });

  it("prices tsp-measured spice against an ml-based price entry", () => {
    const result = calculateIngredientCost("1 tsp cumin", cuminPrice);
    expect(result).not.toBeNull();
    // 1 tsp = 5 ml; 5 / 50 * 5.5 = 0.55
    expect(result?.prices.carrefour).toBe(0.55);
  });

  it("prices tsp-measured honey against an ml-based price entry", () => {
    const result = calculateIngredientCost("1 tsp honey", honeyPrice);
    expect(result).not.toBeNull();
    // 1 tsp = 5 ml; 5 / 250 * 18 = 0.36
    expect(result?.prices.carrefour).toBe(0.36);
  });
});

describe("calculateIngredientCost — each-based lemon and lime", () => {
  const lemonPrice: PriceEntry = { unit: "each", carrefour: 1.5, lulu: 1.3, spinneys: 2, geant: 1.6 };
  const limePrice: PriceEntry  = { unit: "each", carrefour: 1.3, lulu: 1.1, spinneys: 1.8, geant: 1.4 };

  it("prices half a lemon used in a recipe", () => {
    const result = calculateIngredientCost("1/2 lemon, juice + zest", lemonPrice);
    expect(result).not.toBeNull();
    // 0.5 each; 0.5 / 1 * 1.5 = 0.75
    expect(result?.prices.carrefour).toBe(0.75);
  });

  it("prices a whole lime", () => {
    const result = calculateIngredientCost("1/2 lime + 20g pickled ginger", limePrice);
    // has + but no measure keyword before it → parses as 0.5 count
    expect(result).not.toBeNull();
    expect(result?.prices.carrefour).toBe(0.65);
  });
});

describe("findPriceEntry — newly added ingredients", () => {
  it("resolves garlic", () => expect(findPriceEntry("2 garlic cloves, minced")).not.toBeNull());
  it("resolves red onion", () => expect(findPriceEntry("40g red onion, diced")).not.toBeNull());
  it("resolves honey", () => expect(findPriceEntry("1 tsp honey")).not.toBeNull());
  it("resolves apple cider vinegar", () => expect(findPriceEntry("1 tbsp apple cider vinegar")).not.toBeNull());
  it("resolves soy sauce", () => expect(findPriceEntry("2 tbsp low-sodium soy sauce")).not.toBeNull());
  it("resolves jasmine rice via alias", () => expect(findPriceEntry("200g cooked sushi or jasmine rice (100g dry)")).not.toBeNull());
  it("resolves crackers", () => expect(findPriceEntry("60g whole-grain crackers")).not.toBeNull());
  it("resolves vegetable stock", () => expect(findPriceEntry("600ml vegetable stock")).not.toBeNull());
  it("resolves lettuce", () => expect(findPriceEntry("40g lettuce")).not.toBeNull());
  it("resolves mixed leaves", () => expect(findPriceEntry("40g mixed leaves")).not.toBeNull());
});

describe("qualitative quantities (handful / pinch)", () => {
  it("parses 'Small handful parsley' as 1 count", () => {
    expect(parseIngredientQuantity("Small handful parsley, chopped")).toEqual({ amount: 1, unit: "count" });
  });
  it("prices a small handful of parsley via findPriceEntry", () => {
    const entry = findPriceEntry("Small handful parsley, chopped");
    expect(entry?.key).toBe("parsley");
  });
  it("parses 'pinch salt' as 1g", () => {
    expect(parseIngredientQuantity("pinch salt & pepper")).toEqual({ amount: 1, unit: "g" });
  });
  it("resolves salt from price map", () => expect(findPriceEntry("pinch salt & pepper")).not.toBeNull());
  it("resolves pepper via alias", () => expect(findPriceEntry("pinch black pepper")).not.toBeNull());
  it("resolves sesame oil via alias", () => expect(findPriceEntry("1 tsp sesame oil + 1 tbsp sesame seeds")).not.toBeNull());
  it("resolves celery by weight", () => expect(findPriceEntry("60g celery, thinly sliced")).not.toBeNull());
});
