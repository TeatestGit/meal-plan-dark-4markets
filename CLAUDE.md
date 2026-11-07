
# Claude Configuration

@./AGENTS.md

## Claude-Specific Workflow Rules

- **Terminal Execution:** Before running multi-step bash commands, summarize the intent in 1 sentence.
- **Git Commit Formatting:** Always use conventional commits format (`feat: ...`, `fix: ...`, `refactor: ...`).

## Common Local Commands

- **Build Project:** `npm run build`
- **Run Unit Tests:** `npm test`
- **Run Single Test:** `npx vitest run src/path/to/file.test.ts`
- **Typecheck:** `npm run typecheck`
