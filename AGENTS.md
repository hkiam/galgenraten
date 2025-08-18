# Repository Guidelines

## Project Structure & Module Organization

- `src/`: React + TypeScript source.
  - `components/` (UI, PascalCase files), `stores/` (Zustand state), `utils/` (helpers), `types/` (TS types), `App.tsx`, `main.tsx`.
- `public/`: static assets included in builds.
- `dist/`: production build output (generated).
- Config: `vite.config.ts` (PWA + base path), `eslint.config.js`, `tsconfig*.json`.

## Build, Test, and Development Commands

- `npm run dev`: Start Vite dev server with HMR.
- `npm run build`: Type-check then build to `dist/`.
- `npm run preview`: Serve the production build locally.
- `npm run lint`: Lint TS/TSX with ESLint.
- `npm run deploy`: Build and publish `dist/` to GitHub Pages via `gh-pages`.

## Coding Style & Naming Conventions

- TypeScript, React 19, Vite. Prefer functional components and hooks.
- Indentation: 2 spaces; use semicolons; single quotes for strings.
- Filenames: Components `PascalCase.tsx` (e.g., `GameFinished.tsx`); utilities/types/stores `camelCase.ts` (e.g., `wordDistribution.ts`).
- Imports: relative within `src/`; avoid deep nesting when possible.
- Linting: ESLint with `typescript-eslint`, React Hooks rules, Vite refresh. Run `npm run lint` before PRs.

## Testing Guidelines

- Current status: no unit tests included.
- Recommended stack: Vitest + React Testing Library.
- Conventions: co-locate tests as `*.test.ts(x)` next to source (e.g., `components/HangmanCanvas.test.tsx`).
- Coverage: add smoke tests for key components and logic (`stores/`, `utils/`). Ensure `npm run build` stays green.

## Commit & Pull Request Guidelines

- Commits: concise, imperative summaries. Optional emoji prefix is used in history (e.g., `🎯 Initial release`). Examples:
  - `feat(players): add removal button`
  - `fix(pwa): correct base path for Pages`
  - `chore: update eslint config`
- PRs: include purpose, linked issues, screenshots/GIFs for UI, and a brief testing checklist. Confirm locally: `lint`, `build`, `preview`, basic PWA install flows.

## Security & Configuration Tips

- GitHub Pages: `vite.config.ts` uses `base: '/galgenraten/'` in production; for forks, update `package.json:homepage` and Pages settings accordingly.
- PWA: app version is read from `package.json` (`__APP_VERSION__`). Bump version on user-visible changes to trigger update prompts.
- Secrets: none required; do not commit tokens. Use repository variables if adding CI.
