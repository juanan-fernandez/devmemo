# AGENTS.md

## Snapshot
- `README.md` is still generic create-next-app scaffolding; trust `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and files under `app/` instead.
- This is a single-package Next.js 16 App Router app. There is no monorepo layout, CI workflow, test suite, or repo-local `opencode.json` at the root.

## Commands
- Install deps: `npm install`
- Start dev server: `npm run dev`
- Build production app: `npm run build`
- Start production server: `npm run start`
- Verification: `npm run lint` (`package.json` has no dedicated `typecheck` or `test` script)

## Code Map
- `app/layout.tsx` is the root layout and global metadata entrypoint.
- `app/page.tsx` is the home route entrypoint.
- `app/globals.css` loads Tailwind v4 via `@import "tailwindcss"` and defines the shared theme tokens.
- `next.config.ts` enables the React Compiler with `reactCompiler: true`.

## Toolchain Facts
- npm is the verified package manager because `package-lock.json` is committed and no alternative lockfile exists.
- TypeScript is strict and uses the `@/*` alias mapped to the repo root.
- ESLint uses the flat config in `eslint.config.mjs` with `eslint-config-next` core-web-vitals and TypeScript presets.
- Tailwind is wired through `postcss.config.mjs` using `@tailwindcss/postcss`.

## Working Rules
- Keep changes inside the App Router structure unless you verify a new boundary is needed.
- Do not rely on `README.md` for project behavior until it is replaced with repo-specific documentation.
- If you add tests, CI, env files, or new scripts, update this file with the exact command and location because those conventions do not exist yet.
- `.atl/` is ignored local operational metadata; do not commit generated registry or cache files from it.
