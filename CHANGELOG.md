# Changelog

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


