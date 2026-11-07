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

## Linear ↔ GitHub Integration

Every PR opened against this repo automatically creates a linked Linear issue. Here is what happens on each side.

### What happens on the GitHub side

1. A PR is opened (or reopened).
2. GitHub Actions runs `.github/workflows/linear-pr-ticket.yml`.
3. The workflow calls `scripts/linear_helpers.py` via an inline Python script.
4. Once the Linear issue is created, the workflow posts a comment on the PR:
   ```
   🔗 Linear issue created: [ENG-42](https://linear.app/...)
   ```

### What happens on the Linear side

1. A new issue is created inside the configured project (e.g. `meal-plan`).
2. The issue title matches the PR title.
3. The issue description contains the GitHub PR URL and body:
   ```
   GitHub PR #12: https://github.com/.../pull/12

   <PR body text>
   ```
4. The team is derived automatically from the project — no separate team config needed.

### How `linear_helpers.py` works

```
PR opened
  → query Linear API: projects { nodes { id name teams } }
  → find project by name (case-insensitive)
  → take first associated team id
  → mutation issueCreate(teamId, projectId, title, description)
  → return { identifier, url }
  → post GitHub PR comment with the Linear URL
```

### Required GitHub secrets

| Secret | Where to get it | Example value |
|--------|----------------|---------------|
| `LINEAR_API_KEY` | Linear → avatar → My Account → API → Personal API keys | `lin_api_...` |
| `LINEAR_PROJECT_NAME` | Exact project name as shown in Linear | `meal-plan` |

Add both at: `https://github.com/<org>/<repo>/settings/secrets/actions`

### Limitations

- One Linear issue is created per PR open/reopen — no sync after that (status, assignee, labels are not mirrored).
- Project lookup fetches the first 50 projects; works fine on a free plan with few projects.
- The workflow only runs on PRs from the same repo (forks are skipped).
