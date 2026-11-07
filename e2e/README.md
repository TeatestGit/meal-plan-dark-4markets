# E2E Tests — Playwright

End-to-end tests for the 2-Week Lunch Plan app. Tests run across desktop, the latest iPhone and Samsung phones, and the latest iPad and Samsung tablet using Chromium.

## Devices

| Project        | Device            |
|----------------|-------------------|
| desktop        | Desktop Chrome 1280 × 720 |
| iphone-17-pro  | iPhone 17 Pro     |
| galaxy-s24     | Galaxy S24        |
| ipad-gen11     | iPad (gen 11)     |
| galaxy-tab-s9  | Galaxy Tab S9     |

## Preconditions

1. **Node 18+** and **npm** are installed.
2. Run from the project root:

```bash
npm install
npx playwright install chromium
```

3. The dev server does **not** need to be running manually — the test runner starts it automatically via `webServer` in `playwright.config.ts`.

## Running tests

```bash
# All tests, all viewports (headless)
npm run test:e2e

# Interactive UI mode (shows browser + test tree)
npm run test:e2e:ui

# Single device project
npx playwright test --project=desktop
npx playwright test --project=iphone-17-pro
npx playwright test --project=galaxy-s24
npx playwright test --project=ipad-gen11
npx playwright test --project=galaxy-tab-s9

# Single feature file
npx playwright test e2e/shopping-list.spec.ts

# View HTML report after a run
npx playwright show-report
```

## Test files

| File | Feature |
|------|---------|
| `week-switching.spec.ts` | Toggling between Week 1 and Week 2 |
| `meal-selection.spec.ts` | Selecting meals from the sidebar list |
| `search.spec.ts` | Filtering meals by title or ingredient |
| `meal-detail.spec.ts` | Ingredient / Steps / Storage tabs, add to list, clear |
| `shopping-list.spec.ts` | Market selection, pricing, copy list, clear list |

## CI

Set `CI=true` before running to enable 2 retries and strict `webServer` startup:

```bash
CI=true npm run test:e2e
```

Traces are saved on first retry: open them with `npx playwright show-report`.
