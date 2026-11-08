import type { MarketKey, PriceEntry } from "./types";

export type IngredientQuantity = {
  amount: number;
  unit: "g" | "ml" | "count";
};

export type IngredientCost = {
  prices: Record<MarketKey, number>;
  quantity: IngredientQuantity;
};

const markets: MarketKey[] = ["carrefour", "lulu", "spinneys", "geant"];

function numericAmount(value: string): number {
  const [numerator, denominator] = value.split("/");
  return denominator ? Number(numerator) / Number(denominator) : Number(value);
}

export function parseIngredientQuantity(ingredient: string): IngredientQuantity | null {
  const packageMatch = ingredient.match(
    /^\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*x\s*\d+(?:\.\d+)?\s*(?:g|kg|ml|l)\s*(?:cans?|pieces?|pcs)\b/i
  );
  if (packageMatch) return { amount: numericAmount(packageMatch[1]), unit: "count" };

  // qualitative quantities with no numeric prefix (pinch ≈ 1g, handful ≈ 1 bunch)
  const qualMatch = ingredient.match(/^\s*(?:small\s+|large\s+)?(handful|pinch|dash)\b/i);
  if (qualMatch) {
    return qualMatch[1].toLowerCase() === "handful"
      ? { amount: 1, unit: "count" }
      : { amount: 1, unit: "g" };
  }

  // fractions must be tried before plain integers so "1/2" isn't captured as "1"
  const amountMatch = ingredient.match(/^\s*(\d+\/\d+|\d+(?:\.\d+)?)\s*(.*)$/i);
  if (!amountMatch) return null;

  const amount = numericAmount(amountMatch[1]);
  const rest = amountMatch[2].toLowerCase();

  const measure = rest.match(/^(kg|g|ml|l|tbsp|tablespoons?|tsp|teaspoons?|cups?)\b/);
  // for measured compound ingredients (e.g. "1 tsp sesame oil + 1 tbsp seeds"),
  // price only the first component; count-type compounds (e.g. "1/2 lemon, juice + zest")
  // never reach here because they have no measure keyword

  if (measure) {
    switch (measure[1]) {
      case "kg":
        return { amount: amount * 1000, unit: "g" };
      case "g":
        return { amount, unit: "g" };
      case "l":
        return { amount: amount * 1000, unit: "ml" };
      case "ml":
        return { amount, unit: "ml" };
      case "tbsp":
      case "tablespoon":
      case "tablespoons":
        return { amount: amount * 15, unit: "ml" };
      case "tsp":
      case "teaspoon":
      case "teaspoons":
        return { amount: amount * 5, unit: "ml" };
      case "cup":
      case "cups":
        return { amount: amount * 240, unit: "ml" };
    }
  }

  if (/^(?:x\s*)?(?:\d+(?:\.\d+)?\s*)?(?:g|kg|ml|l)\s*(?:cans?|pieces?|pcs)\b/i.test(rest)) {
    return { amount, unit: "count" };
  }

  if (/\b(?:cans?|pieces?|pcs|slices?|wraps?|bagels?|eggs?|cloves?|avocados?|apples?|lemons?|limes?|onions?|carrots?|each)\b/i.test(rest)) {
    return { amount, unit: "count" };
  }

  return null;
}

function priceBasis(unit: string): { amount: number; unit: IngredientQuantity["unit"] } | null {
  const normalized = unit.trim().toLowerCase();
  if (normalized === "kg") return { amount: 1000, unit: "g" };

  if (/\b(?:can|cans|pcs|piece|pieces|each|loaf|loaves|bunch)\b/.test(normalized)) {
    const countMatch = normalized.match(/^(\d+(?:\.\d+)?)\s*pcs\b/);
    return { amount: countMatch ? Number(countMatch[1]) : 1, unit: "count" };
  }

  const packageMatch = normalized.match(/^(\d+(?:\.\d+)?)\s*(g|kg|ml|l)\b/);
  if (!packageMatch) return null;

  const amount = Number(packageMatch[1]);
  const unitType = packageMatch[2];
  if (unitType === "g") return { amount, unit: "g" };
  if (unitType === "kg") return { amount: amount * 1000, unit: "g" };
  if (unitType === "ml") return { amount, unit: "ml" };
  return { amount: amount * 1000, unit: "ml" };
}

export function calculateIngredientCost(
  ingredient: string,
  entry: PriceEntry
): IngredientCost | null {
  const quantity = parseIngredientQuantity(ingredient);
  const basis = priceBasis(entry.unit);
  if (!quantity || !basis) return null;

  const canWeight = entry.unit.match(/^(\d+(?:\.\d+)?)\s*g\s*cans?$/i);
  const basisAmount = quantity.unit === basis.unit
    ? basis.amount
    : quantity.unit === "g" && canWeight
      ? Number(canWeight[1])
      : null;
  if (basisAmount == null) return null;

  const multiplier = quantity.amount / basisAmount;
  const prices = Object.fromEntries(
    markets.map((market) => [market, Math.round(entry[market] * multiplier * 100) / 100])
  ) as Record<MarketKey, number>;

  return { prices, quantity };
}

export function formatIngredientQuantity(quantity: IngredientQuantity): string {
  const amount = Number.isInteger(quantity.amount)
    ? String(quantity.amount)
    : quantity.amount.toFixed(1).replace(/\.0$/, "");
  return quantity.unit === "count" ? `${amount} pcs` : `${amount}${quantity.unit}`;
}
