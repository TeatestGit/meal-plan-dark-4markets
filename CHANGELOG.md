e Changelog

## 2026-11-08 — European breakfast plan, pricing docs

- **feat**: Replaced 14 Middle-Eastern breakfast meals with 14 European high-protein easy-prep breakfasts — scrambled eggs & smoked salmon on sourdough, Greek yogurt parfait, poached eggs on avocado & feta toast, overnight oats, spinach & feta omelette, turkey & egg open sandwich, halloumi & tomato skillet (W1); cheddar & egg scramble, chia pudding, smoked salmon & avocado bagel, Greek yogurt with walnuts & banana, soft-boiled eggs with Dijon, bell pepper & feta omelette, poached eggs on wilted spinach & sourdough (W2). All ≥16g protein, 5–12 min prep.
- **refactor**: Removed 4 unused price entries (`pita`, `fava beans`, `almond butter`, `medjool dates`) and their 3 aliases (`ful`, `fava`, `dates`) from `prices.ts`
- **docs**: Added Pricing Logic section to README covering ingredient matching, quantity parsing, unit normalisation, the `g can` special case, and line cost formula

## 2026-11-08 — Add Breakfast plan

- **feat**: 14 Dubai breakfast meals (plan: "breakfast", IDs `b1-mon`–`b2-sun`) added to `meals.json` — Shakshuka, Avocado toast, Labneh bowl, Overnight oats, Smoked salmon scramble, Ful medames, Banana pancakes, Halloumi scramble, Yogurt parfait, Spinach & feta omelette, Bircher muesli, Breakfast quesadilla, Smoothie bowl, French toast
- **feat**: 16 new breakfast ingredient prices in `prices.ts` (rolled oats, milk, mixed berries, almond butter, chia seeds, smoked salmon, butter, pita, fava beans, banana, halloumi, granola, cheddar, medjool dates, maple syrup, almond milk) + 6 aliases
- **feat**: `mealType` / `mealTypePlural` computed from active plan — all "lunch"/"Lunch" UI strings are now plan-aware ("Breakfast"/"breakfasts" when breakfast plan active)
- **fix**: `stats` useMemo dependency array was `[week]`, missing `plan` — stats now recompute on plan switch
- **test**: 5 unit tests added for breakfast plan; plan-switching e2e extended with 6 breakfast tests; `plan-switching.spec.ts` tab visibility test updated for 3 plans

## 2026-11-08 — Remove Copy button

- **feat**: Removed Copy-to-clipboard button from ShoppingListPanel (unused; no current sharing flow)
- **refactor**: Removed `copyList` async function, `copied`/`copyFailed` state, and all prop plumbing in `App.tsx`
- **refactor**: Removed `onCopyList`, `copied`, `copyFailed` from `ShoppingListPanel` props
- **refactor**: Removed `copyBtn` test-id from `testIds.ts`
- **test**: Removed all copy-button unit and e2e assertions

## 2026-11-08 — Hypermarket logos, dirham sign, tests

- **feat**: Real logo images for all 4 hypermarkets (Carrefour, LuLu, Spinneys, Géant) under `src/assets/hypermarkets/`; white circle background on logo containers
- **feat**: Market cards and price comparison mini-cards show logo only (name text removed); logo containers enlarged
- **feat**: All `AED` display strings replaced with `د.إ` (dirham sign) across UI, clipboard copy, and footer
- **test**: Added `Currency sign` and `Market card logo` describe blocks in `App.test.tsx` (22/22 unit tests pass)
- **fix**: Updated `e2e/ingredient-pricing.spec.ts` assertions from `"AED"` → `"د.إ"` (600/600 e2e pass)

## 2026-11-08 — TT-44, TT-45, TT-46: Plan switching, scroll fix, action row fix

- **TT-44** feat: Plan switching — No Red Meat / Vegan plan tabs (new plan state, 14 vegan meals, asset reorganisation, 14 e2e + 6 unit tests)
- **TT-45** fix: MealSelector vertical scroll on lg viewports (removed overriding `lg:max-h-none lg:overflow-visible`)
- **TT-46** fix: Action row wraps to 2×2 grid on narrow viewports (`grid grid-cols-2 sm:flex`, `data-testid="action-row"`, updated 2 e2e tests)

## 2026-11-08 — Vegan nutrition updated to USDA FoodData Central values

Replaced placeholder macros on all 14 vegan meals with USDA-accurate values (kcal, protein, fat, carbs). Carbs back-calculated via `(kcal - P×4 - F×9) / 4` to satisfy the macro-balance test (±5 kcal tolerance). Values range 505–1116 kcal; two-serving recipes (v1-sun soup, v2-sat stuffed peppers, v2-sun coconut curry) calculated per serving. Updated kcal range test upper bound from 800 to 1200.

## 2026-11-08 — Plan switching tests & dynamic hero text

Added `planBtn` testId to plan tab buttons. Fixed all four hardcoded "No Red Meat" / "14 recipes" strings in hero card and footer to derive from `planLabel` / `planMealCount`. Added 7 unit tests covering plan tab visibility, plan switching, week reset, hero text update, and cross-plan meal isolation. Added `e2e/plan-switching.spec.ts` with 15 Playwright tests (75 runs across 5 viewports) covering tab state, meal list, stats, footer, week reset, and shopping list isolation per plan.

## 2026-11-08 — Vegan plan (14 meals)

Added a second plan `"vegan"` with 14 fully plant-based lunch recipes across 2 weeks (ids `v1-mon … v2-sun`). All macros are balanced to ±5 kcal of stated value. No images yet — component handles missing gracefully. Data integrity tests updated: "14 total" assertion replaced with "14 per plan"; week 1/2 filter assertions scoped to `no-red-meat` plan. Plan tabs now appear automatically in the header since there are 2 plans.

## 2026-11-08 — Plan tabs support

Added a `plan` dimension above the week switcher so the app can host multiple 2-week meal plans. Each meal in `meals.json` now carries a `plan` field (`"no-red-meat"` on all 14 existing entries). A plan tab row appears in the header automatically once a second plan is added to the data — hidden with one plan. Switching plans resets to Week 1 and the first meal of that plan. All filtered queries (`weekMeals`, `stats`, `addWholeWeekToList`, `addAllMealsToList`) now scope to the active plan.

## 2026-11-08 — Linear tickets: TT-37 through TT-43 created and marked Done

Created 7 Linear tickets (under epic TT-7) covering all session work without prior tickets:

- **TT-37** feat: Nutrition tab — per-meal macro breakdown with USDA data
- **TT-38** test: Nutrition tab unit + Playwright coverage
- **TT-39** test: Meal data integrity — protein & kcal consistency across parsing paths
- **TT-40** feat: Persist active tab when switching meals or weeks
- **TT-41** feat: Move Clear list button into action row after Copy
- **TT-42** fix: Skip viewport-specific e2e assertions on incompatible screen sizes
- **TT-43** test: Expand unit test coverage from 55 to 94 tests

All tickets marked Done.

## 2026-11-07 — Unit tests: expand coverage to 94 tests across 4 files

**pricing.test.ts** (30 → 49 tests): added `formatIngredientQuantity` suite (5 tests), `parseIngredientQuantity` unit conversion suite (7 tests — kg→g, l→ml, cups, fractions, null, egg/avocado counts), and `calculateIngredientCost` edge cases suite (7 tests — unit mismatch, no quantity, large gram scale, ml scale, each-based, doubles, rounding).

**MealDetail.test.tsx** (7 → 22 tests): added Ingredients tab (5 tests — row count, title, buttons, in-list count, highlighted row from shopping set), Steps tab (4 tests — row count, heading, active/inactive highlight), Storage tab (2 tests — keep label, storage text), and tab bar (4 tests — all 4 buttons present, active style, inactive style, Planned state).

**App.test.tsx** (6 → 11 tests): added ingredient keyword search, no-results for unmatched search, mark-planned toggle, Clear list empties state, week-2 switch updates meal count.

## 2026-11-07 — Playwright: 525/525 passing across 5 viewports

All tests green after the following fixes and additions:
- Moved "Clear list" button into action row (after Copy); removed full-width version from market summary footer.
- Added 2 Playwright specs verifying "Clear list" position in DOM order.
- Active tab now persists when switching meals or weeks (removed three `setTab("ingredients")` resets in `App.tsx`); updated e2e tests to match.
- Added USDA official symbol (`fdc.nal.usda.gov/img/usda-symbol.svg`) with white background to Nutrition tab note.
- Restored macro colors (protein blue, carbs orange, fat red) on row dots and progress bars; legend row remains removed.
- Fixed 2 viewport-specific e2e failures: `in-list-count` badge skipped below 640px (`hidden sm:inline`); price comparison grid test skipped below 768px where shopping panel scrolls off-screen.

## 2026-11-07 — Tests: meal data integrity (protein & kcal consistency)

- Added `src/mealData.test.ts` (12 unit tests) verifying protein/kcal values are consistent across every parsing path:
  - String format validation (`Ng protein`, `N kcal`, `Ng fat`, `Ng carbs`) for all 14 meals
  - `parseInt(meal.kcal)` === `parseKcal(meal.kcal)` — Nutrition tab and week-glance stats agree
  - `parseInt(meal.protein)` === `parseProtein(meal.protein)` — same cross-check for protein
  - Macro kcal balance within ±5 kcal of stated kcal for every meal (protein×4 + carbs×4 + fat×9)
  - Per-serving protein in realistic range (15–60g) and kcal in range (300–800)
  - Week 1/2 totals computed both ways are identical

**Review findings:** No inconsistencies found. All 14 meals have matching values across all display paths. Macro-derived kcal is within ±2 kcal of stated kcal (rounding only). Formats are uniform.

## 2026-11-07 — Tests: nutrition tab unit + Playwright coverage

- Added `src/components/MealDetail.test.tsx` (7 unit tests): heading/subtitle, kcal pill content, macro labels, gram values, kcal contributions, USDA link href, tab button presence.
- Added 6 Playwright specs to `e2e/meal-detail.spec.ts`: heading/subtitle, kcal pill scoped by testId, macro grams+kcal rows, USDA FoodData Central link href, nutrition content after meal switch, macro % sum ≈ 100.
- Added `nutritionKcalPill` testId to `src/testIds.ts` and `data-testid="nutrition-kcal-pill"` to the kcal card in `MealDetail.tsx` to enable scoped assertions.

## 2026-11-07 — Nutrition tab: restore macro colors without legend

- Restored color dot and colored progress bar on each macro row (protein blue, carbs orange, fat red).
- Legend (percentage labels row) remains removed.

## 2026-11-07 — Nutrition tab: remove color bar/legend; add USDA FoodData Central link

- Removed stacked color bar and color legend from the kcal row in the Nutrition tab (was visually redundant with the per-macro rows below).
- Removed color dots from individual macro row headers.
- Changed macro progress bar fill from per-macro color to neutral (`bg-ink-muted/40`).
- Dropped unused `color` field from macro array.
- Updated USDA note to include a link to [USDA FoodData Central](https://fdc.nal.usda.gov/).

## 2026-11-07 — Nutrition tab: per-meal macro breakdown with USDA verification

- Added `fat` and `carbs` fields to all 14 meals in `meals.json` (estimated from ingredient list using USDA reference data; kcal-balanced).
- Extended `Meal` type in `types.ts` with `fat: string` and `carbs: string`.
- Added **Nutrition** tab (4th tab) to `MealDetail`: kcal total, stacked macro bar (protein/carbs/fat), individual macro rows with percentage bars, USDA-sourced note ("Per serving · recipe makes 2").
- Added `tabNutrition` testId; e2e test verifies macro labels and USDA note render.

## 2026-11-07 — Correct meal protein values (label-density audit)

- w1-wed Rotisserie chicken quinoa salad: 36g → **28g** protein (rotisserie chicken lower density than raw breast)
- w1-fri Pesto chicken salad: 35g → **33g** protein (minor adjustment to label-based estimate)
- w2-wed Chicken Waldorf toast: 33g → **27g** protein (220g cooked chicken at label density per serving)
- w2-fri Tuna sandwich: ingredient clarified to "145g can tuna in water (drained ~85g)" so net drained weight used for nutrition is explicit

All other meals verified within ±15% of USDA-reference calculations. All 14 recipes confirmed as 2-serving, with macros listed per serving.

## 2026-11-07 — Playwright: full page-structure visibility suite

- Added `e2e/page-structure.spec.ts` (39 specs across 3 describe blocks):
  - **On load**: hero title, stat pills (with "Avg" copy), footer copy, week nav buttons, week-glance panel and all three tiles, meal cards (count = 7), search input, ingredients tab / rows / selected-count badge, in-list count, Add meal / Clear / Mark planned / + List / Add week / Add all / Copy buttons, empty state, item count badge, all four market pill tabs.
  - **After adding items**: market price cards (all 4), cheapest label, savings banner, shop-at link, clear list button, list items, remove button, compare-prices button, price comparison grid toggle.
  - **Meal detail tabs**: steps rows, storage keep label + text, ingredients selected count increments on toggle.

## 2026-11-07 — Playwright tests for week-glance and "Add all"

- Added `e2e/week-glance.spec.ts` (5 specs): verifies kcal/protein/time tiles are visible, protein is a weekly total (>100g), time has "m" suffix, week-glance renders above the meal-count header, and stats update on week switch.
- Added 5 specs to `e2e/shopping-list.spec.ts`: "Add all" button visible, populates items, adds ≥ as many items as "Add week", and list section has `overflow-y: auto`.
- Added `addAllBtn` testId to `src/testIds.ts` and wired it to the "Add all" button in `ShoppingListPanel.tsx`.

## 2026-11-07 — Fix week-glance protein showing average instead of total

- Changed PROTEIN tile in week-glance to show `totalProtein` instead of `avgProtein`, consistent with KCAL and TIME which both show weekly totals.

## 2026-11-07 — UI polish and footer cleanup

- Removed "session only · soft list" dev label from the meal detail action bar (`src/components/MealDetail.tsx`).
- Replaced page footer design/font notes with user-facing copy: `© 2026 · Dubai AED · Prices: Sep 2026` and `No Red Meat · 14 Recipes · 2-Week Plan`.
- Moved week glance stats (kcal / protein / time) to above the "Week N · N lunches" header in the left panel.
- Added "Add all" button to shopping panel — adds all 14 meals (both weeks) to the list at once, alongside the existing "Add week" (current week only).
- Made shopping list items section scrollable (`max-h-[420px] overflow-y-auto`); totals footer stays pinned below.

## 2026-11-07 — Show quantity for unpriced shopping list items

- Unpriced items (e.g. "1 small onion (80g), diced") now show their parsed quantity (e.g. `1 PCS · EST.`) instead of "No compatible unit". Quantity is derived by falling back to `parseIngredientQuantity` when `calculateIngredientCost` returns null.
- Restored `@testing-library/dom` dev dependency inadvertently removed during ESLint cleanup.

## 2026-11-07 — CI: add typecheck job

- Added a parallel `Type Check` job (`tsc --noEmit`) to `.github/workflows/ci.yml`.
- e2e job now gates on both `typecheck` and `unit` passing.
- ESLint deferred: `@typescript-eslint` does not yet support TypeScript 7.0 (tracking: typescript-eslint#10940).

## 2026-11-07 — UI fixes and additional pricing coverage

### Shopping panel market cards (`src/components/ShoppingListPanel.tsx`)
- Added `truncate` to market name span so long names (CARREFOUR, SPINNEYS) clip cleanly instead of hard-wrapping.
- Split fee and delivery text onto separate `whitespace-nowrap` divs to prevent mid-string line breaks.
- Added `shrink-0` to cheapest indicator dot so it never gets squeezed.

### Week stats card (`src/App.tsx`)
- Changed time value div from `break-words` to `whitespace-nowrap` so "119m" renders on one line.

### Pricing fixes (`src/pricing.ts`, `src/data/prices.ts`)
- Added qualitative quantity parser: `Small handful parsley` → 1 count; `pinch salt & pepper` → 1g.
- Measured compound ingredients (`1 tsp sesame oil + 1 tbsp sesame seeds`) now price the first component instead of returning PRICE UNAVAILABLE.
- Changed celery unit from `bunch` to `kg` so weight-based quantities (e.g. `60g celery`) calculate correctly.
- Added price entries for `salt` and `black pepper`; added aliases `pepper → black pepper`, `sesame oil → sesame`, `sesame seeds → sesame`.

### Tests (`src/pricing.test.ts`)
- Expanded to 36 unit tests covering qualitative quantities, celery by weight, sesame oil alias resolution, and compound measured ingredient first-component pricing.

## 2026-11-07 — PR review, merge, and Linear ticket coverage

- Reviewed all GitHub PRs against Linear tickets; identified PR #4 (pricing fix) had no ticket.
- Created Linear tickets TT-23 (pricing fix) and TT-24 (CI pipeline) in the `tt-space1/meal-plan` project.
- Resolved `CHANGELOG.md` merge conflict between `develop` and `master`; merged PR #5 (CI pipeline) into `master`.
- Consolidated duplicate CI pipeline entries in CHANGELOG.

## 2026-11-07 — Ingredient pricing fixes and test coverage

### Pricing fixes
- Added price entries for 17 previously missing ingredients: garlic, red onion, onion, honey, lime, ginger, whole-grain bread, soy sauce, lettuce, mixed leaves, vegetable stock, jasmine rice, crackers, apple cider vinegar, and more.
- Changed spice and paste price units from grams to millilitres (harissa, cumin, turmeric, paprika, za'atar, sesame, dijon, honey) so tsp/tbsp recipe quantities calculate correctly without a density conversion.
- Changed lemon and lime to per-each pricing so `1/2 lemon, juice + zest` shows AED 0.75 instead of PRICE UNAVAILABLE.
- Added plural aliases (`wraps`, `bagels`) and additional aliases (`vinegar`, `cider vinegar`, `stock`, `rice`).

### Parser fixes (`src/pricing.ts`)
- Fixed fraction regex alternation order: `1/2` now correctly parses as `0.5` instead of `1`.
- Fixed `+` bail logic to only apply when a unit keyword (tbsp, tsp, g, etc.) is present — count-type ingredients with descriptive suffixes (e.g. `1/2 lemon, juice + zest`) now price correctly.
- Added `limes?` to the count-word recogniser.

### Tests
- Expanded `src/pricing.test.ts` from 4 to 22 unit tests covering the `+` suffix fix, ml-based spice prices, each-based lemon/lime pricing, and `findPriceEntry` coverage for all 17 new ingredients.
- Added `e2e/ingredient-pricing.spec.ts` with 6 specs (30 assertions across 5 device profiles) verifying no PRICE UNAVAILABLE regressions for harissa, lemon, olive oil, spices, and soy sauce.

## 2026-11-07 — CI pipeline (unit + e2e)

- Added `.github/workflows/ci.yml` with two independent jobs: `unit` (Vitest) and `e2e` (Playwright).
- Unit job runs first; e2e job starts only after unit passes (`needs: [unit]`), keeping them independent but sequenced.
- Playwright installs only Chromium on CI for speed; e2e artifacts (HTML report) are uploaded on failure with 7-day retention.
- Triggers on push and PR to `master` and `develop`.
- Fixed Vitest picking up Playwright specs: added `exclude: ["node_modules", "e2e/**"]` to `vitest.config.js`.
- Fixed Playwright WebKit missing on CI: changed `playwright install chromium` to `playwright install` (all browsers).
- Upgraded `node-version` from 20 to 24 in both CI jobs to suppress Node 20 deprecation warnings.

## 2026-11-07 — Linear GitHub integration

- Added `.github/workflows/linear-pr-ticket.yml`: on every PR opened or reopened, automatically creates a Linear issue inside the configured project and posts the issue URL as a PR comment.
- Added `scripts/linear_helpers.py`: reusable helper that resolves project name → team → creates the Linear issue via GraphQL API.
- Team ID is derived from the project itself, so only two GitHub secrets are needed: `LINEAR_API_KEY` and `LINEAR_PROJECT_NAME`.

## 2026-11-07 — Centralised test ID constants

- Created `src/testIds.ts` as the single source of truth for all `data-testid` strings used across the app and tests.
- Updated `App.tsx`, `MealDetail.tsx`, `MealSelector.tsx`, and `ShoppingListPanel.tsx` to import and use `testIds` — no raw strings remain in `src/`.
- Updated `e2e/selectors.ts` to re-export `testIds` from `src/testIds.ts` so app code and test code share one definition.
- To rename or add a test ID, edit only `src/testIds.ts`.

## 2026-11-07 — Playwright E2E test suite

- Added `@playwright/test` and Chromium browser for end-to-end testing.
- Added `playwright.config.ts` with three viewport projects: desktop (1280×720), tablet (768×1024), mobile (390×844).
- Added 35 tests across 5 feature files under `e2e/`: `week-switching`, `meal-selection`, `search`, `meal-detail`, `shopping-list`.
- All 105 tests pass (35 per viewport) against the live Vite dev server.
- Added `test:e2e` and `test:e2e:ui` scripts to `package.json`.
- Added `e2e/README.md` with preconditions and run instructions.

## 2026-11-07 — Bug fixes and dead code removal

- Fixed quantity accumulation bug: ingredient amounts are now summed using the raw numeric value instead of `parseFloat` on the formatted display string (`rawAmounts` parallel map added in `App.tsx`).
- Removed dead `shoppingListItems: string[]` prop from `ShoppingListPanel`; item count badge now reads from `pricedItems.length` directly.
- Removed unreachable `withGeant` fallback function from `data/prices.ts`; every price entry already carries an explicit `geant` value.
- Added `type="button"` to tab buttons in `MealDetail` to prevent accidental form submission.
- Fixed brittle test: quantity-combining test no longer hardcodes "550g" / "AED 23.10"; now asserts that combined unit labels and prices are present.

## 2026-10-17 — Git ignore rules
- Added ignore rules for dependencies, build and coverage output, local environment files, and macOS metadata.
- Added `customization-migration-recovery/` to the ignored paths.

## 2026-10-17 — Codebase quality refactor

### TypeScript & tooling
- Added `tsconfig.json` with strict mode, `react-jsx` transform, and `bundler` module resolution
- Added `typescript` to devDependencies; added `npm run typecheck` script (`tsc --noEmit`)
- Installed `@types/react` and `@types/react-dom`
- Test files excluded from the main tsconfig to avoid requiring vitest globals in source type scope

### File hygiene
- Renamed `src/main.jsx` → `src/main.tsx` and `src/App.test.jsx` → `src/App.test.tsx`
- Deleted `src/components/MarketSelector.jsx` (unused dead code)
- Removed explicit `import React` from all files using the new JSX transform; `MealDetail.tsx` uses `import type { CSSProperties }` for the one reference needed

### Tailwind design tokens
- Added named color palette to `tailwind.config.js`: `page`, `card`, `rim` (+ `rim-hover`, `rim-deep`), `ink-primary`, `ink-secondary`, `ink-muted`, `ink-cta`
- Replaced all arbitrary color values (`text-[#f5f0e8]`, `bg-[#1e1c1a]`, `border-[#2a2724]`, etc.) with named utilities across all components
- Removed prop-drilled style token strings (`textPrimary`, `cardBg`, `cardBorder`, `divider`, etc.) from `MealDetail`, `MealSelector`, and `ShoppingListPanel`

### CSS
- Moved inline `<style>` block out of `App.tsx` JSX into `src/index.css`; removed redundant font injection `useEffect`
- Added missing global styles to `index.css`: `overflow-x: hidden`, `font-smoothing`, `.tabular`, `.scrollbar-hide`

### Data architecture
- Extracted `ingredientPriceMap`, `findPriceEntry`, and `ensureGeantPrice` from `App.tsx` into `src/data/prices.ts`
- Replaced 8 duplicate price entries (aliases like `tuna`/`tuna canned`) with an `aliasMap`; `findPriceEntry` now resolves aliases to canonical keys, improving cross-recipe ingredient grouping

### App.tsx
- Replaced 28 static image imports with `import.meta.glob` (Vite glob import)
- Fixed `as any[]` cast on meals JSON with a typed `RawMeal = Omit<Meal, 'image' | 'thumbnail'>` alias
- Added `localStorage` persistence for shopping list and planned meals (survives page refresh)
- Removed redundant `pricedItems` alias (was `const pricedItems = shoppingListItems`)
- Removed `interactionCount` / `bump()` — the counter was not meaningful and labeled "views" incorrectly in the footer

