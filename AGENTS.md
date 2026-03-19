# AGENTS.md

This file is guidance for agentic coding tools working in this repo.
Keep edits small, follow existing conventions, and avoid large rewrites.

## Project snapshot
- Stack: Vite + React (JS, JSX)
- Module system: ESM (`"type": "module"`)
- Linting: ESLint flat config (`eslint.config.js`)
- Testing: no test runner configured yet

## Commands
Use npm (project uses `package.json` scripts).

### Install
- `npm install`

### Dev server
- `npm run dev`

### Build
- `npm run build`

### Preview production build
- `npm run preview`

### Lint
- `npm run lint`
- Lint a single file: `npx eslint src/App.jsx`

### Test
- No test script is configured.
- If you add Vitest later, a typical single test run is:
  `npx vitest run path/to/file.test.jsx -t "test name"`
- If you add Jest later, a typical single test run is:
  `npx jest path/to/file.test.jsx -t "test name"`

## Repo rules (Cursor/Copilot)
- No `.cursorrules`, `.cursor/rules/`, or `.github/copilot-instructions.md` found.

## Code style
Follow existing patterns in `src/` and ESLint rules.

### JavaScript/React
- Use ESM imports/exports.
- Use functional components with hooks.
- Prefer named imports and keep import order stable.
- Keep components small; extract sections if JSX grows large.
- Avoid unused variables; ESLint errors on them.
- Unused vars can be prefixed with `_` or be PascalCase to satisfy `no-unused-vars` ignore pattern `^[A-Z_]`.
- Keep React hook rules intact (use `react-hooks` ESLint rules).
- Use `StrictMode` at the root (already in `src/main.jsx`).
- Avoid `any`-like patterns; use explicit shapes via objects and clear naming.
- This repo is JavaScript-only; do not introduce TypeScript syntax.

### Component patterns
- Prefer pure components with local state via `useState`.
- Keep side effects in `useEffect` with cleanup.
- Lift state up when multiple siblings need the same data.
- Use props for data flow; avoid hidden module-level mutable state.
- Keep event handlers inline only when simple; otherwise name them.

### Accessibility
- Provide accessible names for interactive controls.
- Decorative images should use empty `alt`.
- Ensure focus styles are visible for keyboard users.
- Use semantic elements before adding ARIA.

### Formatting
- Use 2-space indentation.
- No semicolons (current files omit them).
- Keep lines reasonably short for readability.
- Prefer trailing commas where already used (e.g., arrays/objects in config).
- Leave a single blank line between logical blocks.
- Keep JSX attributes aligned with existing style.

### Naming
- Components: PascalCase (e.g., `App`).
- Hooks: `useX` naming.
- Variables/functions: camelCase.
- Constants: UPPER_SNAKE_CASE when truly constant.
- CSS classes/ids: kebab-case or descriptive lower case; match existing class names.
- Files: match component name when exporting a default component.

### Imports
- External imports first, then local imports.
- Keep CSS imports with other local imports (current pattern: JS imports first, then CSS).
- Keep asset imports near the top of the file with other locals.
- Do not reorder imports unless necessary for a change.

### CSS
- CSS lives in `src/index.css` and `src/App.css`.
- Use CSS variables from `:root` for colors/typography.
- Favor composition and reuse of variables instead of hard-coded values.
- CSS nesting is in use (e.g., `.hero { .base { ... } }`). Keep nesting shallow.
- Keep responsive rules close to the base rule using `@media` blocks.
- Prefer class selectors over IDs unless matching existing structure.
- Keep transitions modest and tied to interaction.

### Assets
- Local assets live in `src/assets` and are imported directly into components.
- Use descriptive names for new assets; keep file names lowercase.
- Optimize image sizes before adding large assets.

## Error handling and data flow
- Handle async errors with `try/catch` and provide user-friendly fallbacks.
- Avoid throwing raw errors to the UI; log with context and show a safe message.
- Keep side effects in `useEffect` and clean up subscriptions/timers.
- Prefer early returns for guard clauses.
- Avoid silent failures; surface a minimal UI state.

## Performance
- Avoid unnecessary re-renders; keep state minimal.
- Split large JSX into smaller components when possible.
- Avoid expensive calculations during render; memoize if needed.

## File organization
- Entry point: `src/main.jsx`.
- Root component: `src/App.jsx`.
- Styles: `src/index.css`, `src/App.css`.
- Keep new components in `src/` unless a feature folder is introduced.

## Dependency notes
- React and React DOM are the only runtime deps in `package.json`.
- Vite is used for dev/build/preview.
- ESLint is configured for JS/JSX only.
- No formatter is configured; keep formatting consistent with existing files.

## Key configs
- `vite.config.js` defines Vite plugins and build behavior.
- `eslint.config.js` defines lint rules and ignores `dist/`.
- `src/index.css` hosts global variables and base typography.
- `src/App.css` hosts component-level styles with nesting.

## Suggested agent workflow
- Read `README.md` for product context and domain language.
- Update or add components in small increments.
- Run `npm run lint` before finalizing changes.
- If adding tests, add a test runner and scripts in `package.json`.
- Prefer updating `AGENTS.md` if project conventions change.

## Safety checks
- Do not commit secrets or `.env` files.
- Keep the app runnable after changes (`npm run dev`).

## Notes for adding tests (optional)
- Recommended: Vitest for Vite-based React projects.
- Add a `test` script and document how to run single tests in this file.
