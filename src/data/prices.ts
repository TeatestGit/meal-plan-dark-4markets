import type { PriceEntry } from "../types";

const rawPriceMap: Record<string, PriceEntry> = {
  "chicken breast":    { unit: "kg",       carrefour: 48,   lulu: 35,   spinneys: 55,    geant: 45 },
  "chicken thigh":     { unit: "kg",       carrefour: 32,   lulu: 29,   spinneys: 44,    geant: 34.6 },
  "rotisserie chicken":{ unit: "piece",    carrefour: 28,   lulu: 25,   spinneys: 34,    geant: 29 },
  "turkey breast":     { unit: "250g",     carrefour: 18.5, lulu: 16.5, spinneys: 24,    geant: 20 },
  "salmon":            { unit: "kg",       carrefour: 115,  lulu: 92,   spinneys: 136,   geant: 96 },
  "shrimp":            { unit: "kg",       carrefour: 58,   lulu: 55,   spinneys: 75,    geant: 63 },
  "tuna canned":       { unit: "185g can", carrefour: 7.5,  lulu: 6.5,  spinneys: 9.5,   geant: 5.5 },
  "feta":              { unit: "kg",       carrefour: 95,   lulu: 80,   spinneys: 110,   geant: 90 },
  "greek yogurt":      { unit: "500g",     carrefour: 9.5,  lulu: 8.9,  spinneys: 12.5,  geant: 10 },
  "mint yogurt":       { unit: "200g",     carrefour: 6.5,  lulu: 5.9,  spinneys: 8,     geant: 7 },
  "hummus":            { unit: "250g",     carrefour: 10,   lulu: 9,    spinneys: 14,    geant: 9.2 },
  "basil pesto":       { unit: "190g",     carrefour: 14.5, lulu: 12.9, spinneys: 19.5,  geant: 15.7 },
  "chickpeas":         { unit: "400g can", carrefour: 4,    lulu: 3.5,  spinneys: 5,     geant: 3.8 },
  "cannellini beans":  { unit: "400g can", carrefour: 4.2,  lulu: 3.5,  spinneys: 5.5,   geant: 4.5 },
  "black beans":       { unit: "400g can", carrefour: 4.2,  lulu: 3.6,  spinneys: 5.5,   geant: 4.5 },
  "lentils":           { unit: "500g",     carrefour: 5,    lulu: 4.5,  spinneys: 7,     geant: 7 },
  "quinoa":            { unit: "500g",     carrefour: 28,   lulu: 25,   spinneys: 35,    geant: 30 },
  "couscous":          { unit: "500g",     carrefour: 12.5, lulu: 11.2, spinneys: 15,    geant: 13.5 },
  "freekeh":           { unit: "500g",     carrefour: 16.5, lulu: 14.8, spinneys: 20,    geant: 17.5 },
  "sushi rice":        { unit: "1kg",      carrefour: 14,   lulu: 12.5, spinneys: 18,    geant: 15 },
  "sourdough":         { unit: "loaf",     carrefour: 14,   lulu: 13,   spinneys: 20,    geant: 17.3 },
  "whole wheat wrap":  { unit: "8 pcs",    carrefour: 10.5, lulu: 9.2,  spinneys: 13.5,  geant: 11.3 },
  "bagel":             { unit: "4 pcs",    carrefour: 19,   lulu: 17,   spinneys: 22,    geant: 18 },
  "edamame":           { unit: "500g",     carrefour: 11,   lulu: 9.5,  spinneys: 14,    geant: 12 },
  "harissa":           { unit: "100ml",    carrefour: 9.5,  lulu: 8.5,  spinneys: 12,    geant: 10.3 },
  "dijon":             { unit: "200ml",    carrefour: 11,   lulu: 9.5,  spinneys: 14,    geant: 12 },
  "olive oil":         { unit: "500ml",    carrefour: 25,   lulu: 18,   spinneys: 25,    geant: 28 },
  "sesame":            { unit: "100ml",    carrefour: 6,    lulu: 5.2,  spinneys: 7.5,   geant: 6.5 },
  "cumin":             { unit: "50ml",     carrefour: 5.5,  lulu: 4.8,  spinneys: 7,     geant: 6 },
  "turmeric":          { unit: "50ml",     carrefour: 5.5,  lulu: 4.9,  spinneys: 7.2,   geant: 6 },
  "paprika":           { unit: "50ml",     carrefour: 6,    lulu: 5.2,  spinneys: 7.5,   geant: 6.5 },
  "za'atar":           { unit: "100ml",    carrefour: 9,    lulu: 7.5,  spinneys: 11.5,  geant: 9.7 },
  "cucumber":          { unit: "kg",       carrefour: 6.5,  lulu: 5.5,  spinneys: 9,     geant: 6.5 },
  "tomatoes":          { unit: "kg",       carrefour: 6.5,  lulu: 5.5,  spinneys: 9,     geant: 8 },
  "sun-dried tomatoes":{ unit: "200g",     carrefour: 13,   lulu: 11.5, spinneys: 17,    geant: 14 },
  "lemon":             { unit: "each",     carrefour: 1.5,  lulu: 1.3,  spinneys: 2,     geant: 1.6 },
  "parsley":           { unit: "bunch",    carrefour: 2.5,  lulu: 2,    spinneys: 3.5,   geant: 3.5 },
  "cilantro":          { unit: "bunch",    carrefour: 2.5,  lulu: 2,    spinneys: 3.5,   geant: 2.8 },
  "mint":              { unit: "bunch",    carrefour: 2.5,  lulu: 2,    spinneys: 3.5,   geant: 2.8 },
  "baby spinach":      { unit: "200g",     carrefour: 8.5,  lulu: 7.2,  spinneys: 11,    geant: 9.2 },
  "rocket":            { unit: "100g",     carrefour: 6,    lulu: 5.2,  spinneys: 8,     geant: 6.5 },
  "carrots":           { unit: "kg",       carrefour: 5.5,  lulu: 4.8,  spinneys: 7.5,   geant: 6 },
  "celery":            { unit: "kg",       carrefour: 14,   lulu: 12,   spinneys: 19,    geant: 15.2 },
  "avocado":           { unit: "each",     carrefour: 5,    lulu: 7.5,  spinneys: 9,     geant: 7 },
  "bell pepper":       { unit: "kg",       carrefour: 12,   lulu: 10.5, spinneys: 16,    geant: 13 },
  "corn":              { unit: "2 pcs",    carrefour: 6,    lulu: 5.2,  spinneys: 8,     geant: 6.5 },
  "eggs":              { unit: "12 pcs",   carrefour: 10,   lulu: 8,    spinneys: 12,    geant: 19.5 },
  "almonds":           { unit: "200g",     carrefour: 22,   lulu: 20,   spinneys: 26,    geant: 23 },
  "walnuts":           { unit: "200g",     carrefour: 28,   lulu: 26,   spinneys: 35,    geant: 30 },
  "kalamata olives":   { unit: "200g",     carrefour: 11,   lulu: 9.5,  spinneys: 14.5,  geant: 12 },
  "green olives":      { unit: "200g",     carrefour: 10,   lulu: 8.5,  spinneys: 13.5,  geant: 10.8 },
  "capers":            { unit: "100g",     carrefour: 6.5,  lulu: 6,    spinneys: 10,    geant: 9 },
  "honeycrisp apple":  { unit: "kg",       carrefour: 18,   lulu: 16,   spinneys: 24,    geant: 19.5 },
  "apple":             { unit: "kg",       carrefour: 12,   lulu: 10.5, spinneys: 16,    geant: 13 },
  "garlic":            { unit: "head",     carrefour: 2.5,  lulu: 2,    spinneys: 3.5,   geant: 2.8 },
  "red onion":         { unit: "kg",       carrefour: 5,    lulu: 4.5,  spinneys: 7,     geant: 5.5 },
  "onion":             { unit: "kg",       carrefour: 4,    lulu: 3.5,  spinneys: 6,     geant: 4.5 },
  "honey":             { unit: "250ml",    carrefour: 18,   lulu: 16,   spinneys: 24,    geant: 19.5 },
  "lime":              { unit: "each",     carrefour: 1.3,  lulu: 1.1,  spinneys: 1.8,   geant: 1.4 },
  "ginger":            { unit: "100g",     carrefour: 3.5,  lulu: 3,    spinneys: 5,     geant: 3.8 },
  "whole-grain bread": { unit: "loaf",     carrefour: 11,   lulu: 9.5,  spinneys: 15,    geant: 12 },
  "bread":             { unit: "loaf",     carrefour: 9,    lulu: 7.5,  spinneys: 13,    geant: 9.8 },
  "soy sauce":         { unit: "250ml",    carrefour: 11,   lulu: 9.5,  spinneys: 14,    geant: 12 },
  "lettuce":           { unit: "head",     carrefour: 5.5,  lulu: 4.8,  spinneys: 7.5,   geant: 6 },
  "mixed leaves":      { unit: "100g",     carrefour: 7,    lulu: 6,    spinneys: 9.5,   geant: 7.6 },
  "vegetable stock":   { unit: "1L",       carrefour: 7,    lulu: 6,    spinneys: 9.5,   geant: 7.6 },
  "jasmine rice":      { unit: "1kg",      carrefour: 12,   lulu: 10.5, spinneys: 15,    geant: 13 },
  "crackers":          { unit: "200g",     carrefour: 11,   lulu: 9.5,  spinneys: 14,    geant: 12 },
  "apple cider vinegar": { unit: "500ml",  carrefour: 14,   lulu: 12.5, spinneys: 18,    geant: 15.2 },
  "salt":          { unit: "100g",    carrefour: 0.5,  lulu: 0.4,  spinneys: 0.7,   geant: 0.5 },
  "black pepper":  { unit: "50g",     carrefour: 8,    lulu: 7,    spinneys: 10,    geant: 8.5 },
  // Breakfast
  "rolled oats":   { unit: "500g",    carrefour: 10,   lulu: 9,    spinneys: 12,    geant: 8 },
  "milk":          { unit: "1L",      carrefour: 6.5,  lulu: 6.25, spinneys: 7.75,  geant: 5 },
  "mixed berries": { unit: "200g",    carrefour: 15,   lulu: 13.5, spinneys: 20,    geant: 16.5 },
  "almond butter": { unit: "200g",    carrefour: 22,   lulu: 19.5, spinneys: 29,    geant: 24 },
  "chia seeds":    { unit: "150g",    carrefour: 23,   lulu: 21,   spinneys: 26,    geant: 24 },
  "smoked salmon": { unit: "100g",    carrefour: 23,   lulu: 28,   spinneys: 25,    geant: 24 },
  "butter":        { unit: "250g",    carrefour: 7,    lulu: 6.5,  spinneys: 9.5,   geant: 7.5 },
  "banana":        { unit: "kg",      carrefour: 7,    lulu: 5,    spinneys: 7.5,   geant: 8.5 },
  "halloumi":      { unit: "250g",    carrefour: 17,   lulu: 20,   spinneys: 22,    geant: 19.5 },
  "granola":       { unit: "300g",    carrefour: 18,   lulu: 17,   spinneys: 24,    geant: 20 },
  "cheddar":       { unit: "200g",    carrefour: 12,   lulu: 11,   spinneys: 16.5,  geant: 12.5 },
  "maple syrup":   { unit: "250ml",   carrefour: 64,   lulu: 58,   spinneys: 72,    geant: 65 },
  "almond milk":   { unit: "1L",      carrefour: 20.5, lulu: 18,   spinneys: 22,    geant: 13.5 },
};

const aliasMap: Record<string, string> = {
  "tuna":            "tuna canned",
  "yogurt":          "greek yogurt",
  "pesto":           "basil pesto",
  "wrap":            "whole wheat wrap",
  "wraps":           "whole wheat wrap",
  "bagels":          "bagel",
  "zaatar":          "za'atar",
  "tomato":          "tomatoes",
  "carrot":          "carrots",
  "spinach":         "baby spinach",
  "sushi rice":      "jasmine rice",
  "rice":            "jasmine rice",
  "whole grain crackers": "crackers",
  "pickled ginger":  "ginger",
  "stock":           "vegetable stock",
  "vinegar":         "apple cider vinegar",
  "cider vinegar":   "apple cider vinegar",
  "pepper":          "black pepper",
  "sesame oil":      "sesame",
  "sesame seeds":    "sesame",
  "oats":            "rolled oats",
  "bananas":         "banana",
  "cheddar cheese":  "cheddar",
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
