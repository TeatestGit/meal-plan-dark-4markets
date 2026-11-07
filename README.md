# 2-Week Lunch Plan - Dark + Grocery Prices (4 Markets)

## Description

A responsive lunch-planning app featuring 14 recipes across two weeks, with preparation steps, ingredients, nutrition details, and food photography. Build a shopping list from the meals you choose, then compare estimated ingredient costs across Carrefour, LuLu, Spinneys, and Géant in the UAE. The app uses a dark editorial design and includes links to each market for shopping.

Latest version: dark theme editorial luxury, responsive, 14 real food photos, grocery prices per market.

## Quick Start in VS Code
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Testing

Start the dev server in one terminal, then run tests in another:

```bash
# terminal 1 — start dev server
npm run dev

# terminal 2 — run all tests (all devices)
npx playwright test

# run a single spec file
npx playwright test e2e/shopping-list.spec.ts

# run only on a specific device project
npx playwright test --project=iphone-17-pro
npx playwright test --project=galaxy-s24
npx playwright test --project=ipad-gen11
npx playwright test --project=galaxy-tab-s9
npx playwright test --project=desktop

# open the HTML report after a run
npx playwright show-report

# unit tests
npm test
```

## Structure
- `src/App.tsx` — full app; meal state, shopping list, localStorage persistence
- `src/data/prices.ts` — `ingredientPriceMap`, `findPriceEntry` (alias resolution)
- `src/testIds.ts` — single source of truth for all `data-testid` strings
- `src/components/` — `MealDetail`, `MealSelector`, `ShoppingListPanel`
- `src/assets/meals.json` — 14 meal definitions
- `src/assets/w*.webp` — 14 food images
- `src/index.css` — Tailwind + font variables
- `e2e/` — Playwright end-to-end specs (desktop + tablet + mobile)
- `scripts/linear_helpers.py` — Linear API helper used by the GitHub Actions workflow

## Markets (4) - Kibsons removed
- Carrefour: chicken breast 42 AED/kg, Spinneys Fresh 59.25 AED
- LuLu: ~38 AED/kg
- Spinneys: Fresh Breast 59.25 AED, Feta 135 AED/kg
- Geant: ~45 AED/kg (mid-range, Carrefour+8%)

## Reuse Elements

### 1. Day Card
Button with data-meal-id logic. Extract to component with props: meal, isActive, isPlanned, onSelect
```
<button className="rounded-[16px] p-2.5 flex gap-3.5 border min-w-[240px] w-[72vw]...">
  <div className="w-[64px] h-[64px] rounded-[14px] overflow-hidden">
    <img src={meal.image} className="object-cover" />
  </div>
</button>
```

### 2. Hero
Aspect 4/3 mobile, 16/10 sm, 16/9 lg, gradient from-black/70, h2 #hero-title font-newsreader italic

### 3. Shopping List + Prices
- marketPrices object: name, color, logo, delivery, fee, url
- ingredientPriceMap: unit + per-market prices (fuzzy match lowercases includes)
- Totals: sum, cheapest highlight, savings calc
- Shop links: carrefouruae.com, luluhypermarket.com, spinneys.com, geantuae.com

## Build
npm run build
dist/ -> deploy to Vercel/Netlify

## Customize Prices
Edit `src/data/prices.ts` — `ingredientPriceMap` holds all per-market prices; `aliasMap` maps ingredient name aliases to canonical keys.

## CI / Linear Integration
Opening a PR automatically creates a Linear issue in the configured project and posts its URL as a PR comment.

Required GitHub secrets:
| Secret | Value |
|--------|-------|
| `LINEAR_API_KEY` | Linear personal API key (Settings → API) |
| `LINEAR_PROJECT_NAME` | Exact project name in Linear (e.g. `meal-plan`) |
