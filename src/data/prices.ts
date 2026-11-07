import type { PriceEntry } from "../types";

const rawPriceMap: Record<string, PriceEntry> = {
  "chicken breast":    { unit: "kg",       carrefour: 42,   lulu: 38,   spinneys: 59.25, geant: 45 },
  "chicken thigh":     { unit: "kg",       carrefour: 32,   lulu: 29,   spinneys: 44,    geant: 34.6 },
  "rotisserie chicken":{ unit: "piece",    carrefour: 28,   lulu: 25,   spinneys: 34,    geant: 29 },
  "turkey breast":     { unit: "250g",     carrefour: 18.5, lulu: 16.5, spinneys: 24,    geant: 20 },
  "salmon":            { unit: "kg",       carrefour: 89,   lulu: 85,   spinneys: 110,   geant: 96 },
  "shrimp":            { unit: "kg",       carrefour: 58,   lulu: 55,   spinneys: 75,    geant: 63 },
  "tuna canned":       { unit: "185g can", carrefour: 7.5,  lulu: 6.5,  spinneys: 9.5,   geant: 5.5 },
  "feta":              { unit: "kg",       carrefour: 85,   lulu: 78,   spinneys: 135,   geant: 90 },
  "greek yogurt":      { unit: "500g",     carrefour: 9.5,  lulu: 8.9,  spinneys: 12.5,  geant: 10 },
  "mint yogurt":       { unit: "200g",     carrefour: 6.5,  lulu: 5.9,  spinneys: 8,     geant: 7 },
  "hummus":            { unit: "250g",     carrefour: 8.5,  lulu: 7.5,  spinneys: 12,    geant: 9.2 },
  "basil pesto":       { unit: "190g",     carrefour: 14.5, lulu: 12.9, spinneys: 19.5,  geant: 15.7 },
  "chickpeas":         { unit: "400g can", carrefour: 3.5,  lulu: 2.95, spinneys: 4.5,   geant: 3.8 },
  "cannellini beans":  { unit: "400g can", carrefour: 4.2,  lulu: 3.5,  spinneys: 5.5,   geant: 4.5 },
  "black beans":       { unit: "400g can", carrefour: 4.2,  lulu: 3.6,  spinneys: 5.5,   geant: 4.5 },
  "lentils":           { unit: "500g",     carrefour: 6.5,  lulu: 5.5,  spinneys: 8.5,   geant: 7 },
  "quinoa":            { unit: "500g",     carrefour: 18.5, lulu: 16.9, spinneys: 22.5,  geant: 19.5 },
  "couscous":          { unit: "500g",     carrefour: 12.5, lulu: 11.2, spinneys: 15,    geant: 13.5 },
  "freekeh":           { unit: "500g",     carrefour: 16.5, lulu: 14.8, spinneys: 20,    geant: 17.5 },
  "sushi rice":        { unit: "1kg",      carrefour: 14,   lulu: 12.5, spinneys: 18,    geant: 15 },
  "sourdough":         { unit: "loaf",     carrefour: 16,   lulu: 14,   spinneys: 22,    geant: 17.3 },
  "whole wheat wrap":  { unit: "8 pcs",    carrefour: 10.5, lulu: 9.2,  spinneys: 13.5,  geant: 11.3 },
  "bagel":             { unit: "4 pcs",    carrefour: 12,   lulu: 10.5, spinneys: 16,    geant: 13 },
  "edamame":           { unit: "500g",     carrefour: 11,   lulu: 9.5,  spinneys: 14,    geant: 12 },
  "harissa":           { unit: "100g",     carrefour: 9.5,  lulu: 8.5,  spinneys: 12,    geant: 10.3 },
  "dijon":             { unit: "200g",     carrefour: 11,   lulu: 9.5,  spinneys: 14,    geant: 12 },
  "olive oil":         { unit: "500ml",    carrefour: 26,   lulu: 24,   spinneys: 32,    geant: 28 },
  "sesame":            { unit: "100g",     carrefour: 6,    lulu: 5.2,  spinneys: 7.5,   geant: 6.5 },
  "cumin":             { unit: "50g",      carrefour: 5.5,  lulu: 4.8,  spinneys: 7,     geant: 6 },
  "turmeric":          { unit: "50g",      carrefour: 5.5,  lulu: 4.9,  spinneys: 7.2,   geant: 6 },
  "paprika":           { unit: "50g",      carrefour: 6,    lulu: 5.2,  spinneys: 7.5,   geant: 6.5 },
  "za'atar":           { unit: "100g",     carrefour: 9,    lulu: 7.5,  spinneys: 11.5,  geant: 9.7 },
  "cucumber":          { unit: "kg",       carrefour: 6.5,  lulu: 5.5,  spinneys: 9,     geant: 6.5 },
  "tomatoes":          { unit: "kg",       carrefour: 7.5,  lulu: 6.5,  spinneys: 10.5,  geant: 8 },
  "sun-dried tomatoes":{ unit: "200g",     carrefour: 13,   lulu: 11.5, spinneys: 17,    geant: 14 },
  "lemon":             { unit: "kg",       carrefour: 8,    lulu: 6.9,  spinneys: 11,    geant: 7.5 },
  "parsley":           { unit: "bunch",    carrefour: 2.5,  lulu: 2,    spinneys: 3.5,   geant: 3.5 },
  "cilantro":          { unit: "bunch",    carrefour: 2.5,  lulu: 2,    spinneys: 3.5,   geant: 2.8 },
  "mint":              { unit: "bunch",    carrefour: 2.5,  lulu: 2,    spinneys: 3.5,   geant: 2.8 },
  "baby spinach":      { unit: "200g",     carrefour: 8.5,  lulu: 7.2,  spinneys: 11,    geant: 9.2 },
  "rocket":            { unit: "100g",     carrefour: 6,    lulu: 5.2,  spinneys: 8,     geant: 6.5 },
  "carrots":           { unit: "kg",       carrefour: 5.5,  lulu: 4.8,  spinneys: 7.5,   geant: 6 },
  "celery":            { unit: "bunch",    carrefour: 7,    lulu: 6,    spinneys: 9.5,   geant: 7.6 },
  "avocado":           { unit: "each",     carrefour: 6.5,  lulu: 6,    spinneys: 9,     geant: 7 },
  "bell pepper":       { unit: "kg",       carrefour: 12,   lulu: 10.5, spinneys: 16,    geant: 13 },
  "corn":              { unit: "2 pcs",    carrefour: 6,    lulu: 5.2,  spinneys: 8,     geant: 6.5 },
  "eggs":              { unit: "12 pcs",   carrefour: 18,   lulu: 16,   spinneys: 23,    geant: 19.5 },
  "almonds":           { unit: "200g",     carrefour: 14,   lulu: 12.5, spinneys: 19,    geant: 15 },
  "walnuts":           { unit: "200g",     carrefour: 15,   lulu: 13.5, spinneys: 20,    geant: 16 },
  "kalamata olives":   { unit: "200g",     carrefour: 11,   lulu: 9.5,  spinneys: 14.5,  geant: 12 },
  "green olives":      { unit: "200g",     carrefour: 10,   lulu: 8.5,  spinneys: 13.5,  geant: 10.8 },
  "capers":            { unit: "100g",     carrefour: 9.5,  lulu: 8.2,  spinneys: 12.5,  geant: 10.3 },
  "honeycrisp apple":  { unit: "kg",       carrefour: 18,   lulu: 16,   spinneys: 24,    geant: 19.5 },
  "apple":             { unit: "kg",       carrefour: 12,   lulu: 10.5, spinneys: 16,    geant: 13 },
};

const aliasMap: Record<string, string> = {
  "tuna":            "tuna canned",
  "yogurt":          "greek yogurt",
  "pesto":           "basil pesto",
  "wrap":            "whole wheat wrap",
  "zaatar":          "za'atar",
  "tomato":          "tomatoes",
  "carrot":          "carrots",
  "spinach":         "baby spinach",
};

export const ingredientPriceMap: Record<string, PriceEntry> = {
  ...rawPriceMap,
  ...Object.fromEntries(
    Object.entries(aliasMap).map(([alias, canonical]) => [alias, rawPriceMap[canonical]!])
  ),
};

const priceKeys = Object.keys(ingredientPriceMap).sort((a, b) => b.length - a.length);
const normalizedPriceKeys = priceKeys.map((key) => ({
  key,
  normalized: key.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(),
}));

export function findPriceEntry(ingredient: string): { key: string; entry: PriceEntry } | null {
  const normalized = ` ${ingredient.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
  const match = normalizedPriceKeys
    .map((candidate) => ({
      ...candidate,
      position: normalized.indexOf(` ${candidate.normalized} `),
    }))
    .filter((candidate) => candidate.position >= 0)
    .sort((a, b) => a.position - b.position || b.normalized.length - a.normalized.length)[0];

  if (!match) return null;
  const resolvedKey = aliasMap[match.key] ?? match.key;
  const entry = ingredientPriceMap[resolvedKey];
  return entry ? { key: resolvedKey, entry } : null;
}
