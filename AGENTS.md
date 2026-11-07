
# Repository Guidelines & AI Context

## 1. Project Overview & Tech Stack

- **Project Purpose:** Brief 1–2 sentence description of what this application does.

## 2. Workspace Structure

- `src/components/`: Reusable UI components.
- `src/features/`: Feature-based business logic and state.
- `src/services/`: API calls and external client integrations.
- `src/types/`: Shared TypeScript type definitions and interfaces.

## 3. Essential Commands

- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev`
- **Build Project:** `npm run build`
- **Run All Tests:** `npm test`
- **Run Specific Test:** `npx vitest run path/to/file.test.ts`
- **Type Checking:** `npm run type-check`

## 4. Code Style & Rules

- **TypeScript:** Strict mode enabled. Never use `any` without an explicit comment explaining why.
- **Formatting:** Use functional components with arrow functions.
- **Styling:** Use Tailwind CSS utility classes; avoid inline styles.

## 5. Testing & Quality Standards

- Write unit tests alongside every new component or service.
- Use `screen.getByRole()` over `container.querySelector()` in UI tests.
- Always run and verify `npm run build` before completing complex tasks.

## 6. Documentation & Changelog

- **Always update `CHANGELOG.md`:** For every completed task or feature update, append a brief entry describing the changes made before finishing the prompt.
- **Commit Messages:** Follow conventional commit formatting (`feat:`, `fix:`, `docs:`).
