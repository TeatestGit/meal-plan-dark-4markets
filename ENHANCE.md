# Enhancement Follow-up

What this repo does: This is a browser-based two-week lunch planner with recipe details and an estimated shopping list compared across four UAE markets. It is a static app for an individual browser session, with no server or shared data store.

## Completed

- Shopping costs now scale by recipe quantity for supported weight, volume, and count units. Repeated selections are retained by recipe line and combined by ingredient; unknown or incompatible quantities are shown as unpriced and excluded from market totals.
- Empty searches now show a no-results message instead of an unrelated recipe.
- Prices are labeled as static estimates, not live retailer data. Totals identify that delivery fees and unpriced ingredients are excluded.
- Per-item market comparisons now have a keyboard- and touch-accessible expand control.
- Clipboard failures now show an error state instead of a false success.
- Regression tests cover price conversions, no-result searches, quantity totals, and clipboard failures.
- Recipe selector photos now load lazily.

## Known CI warnings (non-blocking)

**`actions/checkout@v4` and `actions/setup-node@v4` Node 20 deprecation warning**

GitHub deprecated Node.js 20 on Actions runners (Sep 2025). These action binaries have their own internal Node 20 runtime baked in, separate from the `node-version: 24` we set for the project build. GitHub now forces those action binaries to run on Node 24 and surfaces the mismatch as a warning annotation.

CI still passes. No code change is needed. Fix: upgrade to `actions/checkout@v5` and `actions/setup-node@v5` once those versions ship with a Node 24 runtime. Update the two `uses:` lines in `.github/workflows/ci.yml` at that point.

## Remaining limitations

- Prices remain manually maintained estimates, with Nov 2026 reference data; they are not checked against live retailer catalogs.
- Ingredient lines with compound items, unsupported units, or no clear quantity are not priced. They remain visible in the list and are excluded from totals.
- Optimized 256px meal thumbnails (about 388 KB total versus about 8 MB for the full-size photos) are used in selector and recipe prep-tip views; full-resolution photos remain available for recipe detail views.

Verdict: The reported correctness, interaction, and image-loading issues are fixed. Treat market comparisons as partial estimates until prices and unsupported ingredient quantities are verified.

Not checked: Retailer data accuracy, production deployment, and hands-on screen-reader/device testing. `npm test` passed (10 tests); `npm run build` passed.

## Suggested structural improvements (Nov 2026 review)

| # | Change | Effort | Impact |
|---|--------|--------|--------|
| 1 | Delete `src/assets/vegan-meal-plan-assets/` and `customization-migration-recovery/` — orphaned artefacts not referenced by the app | 5 min | Cleaner repo |
| 2 | Move `src/assets/meals.json` → `src/data/meals.json` — all other data lives in `src/data/`; assets is for images | 30 min | Consistent structure |
| 3 | Add breakfast plan image assets (`b1-*/b2-*` `.webp` + thumbnails) to match `no-red-meat/` and `vegan/` — currently missing, meal cards fall back to placeholder | varies | Fixes broken images |
| 4 | Extract `src/hooks/useMealPlan.ts` and `src/hooks/useShoppingList.ts` from `App.tsx` (506 lines) — state, computed values, and handlers in one file is hard to maintain | 2h | Maintainability |
| 5 | Delete or merge `ENHANCE.md` into `CHANGELOG.md` once improvements land | 5 min | Docs hygiene |
| 6 | Upgrade CI actions: `actions/checkout@v5` and `actions/setup-node@v5` (Node 20 deprecation warning, non-blocking) | 5 min | CI cleanliness |
