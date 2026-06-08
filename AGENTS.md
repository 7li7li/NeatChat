# Repository Guidelines

## Project Structure & Module Organization

This is a Yarn 1 Next.js application with optional Tauri desktop packaging. Main application code lives in `app/`: API routes in `app/api`, provider clients in `app/client`, reusable UI in `app/components`, state stores in `app/store`, MCP logic in `app/mcp`, and helpers in `app/utils`. Static assets and public JSON configs are in `public/`; icon assets also appear in `app/icons`. Desktop Rust code and Tauri configuration live in `src-tauri/`. Jest tests are under `test/`, and utility or deployment scripts are in `scripts/` plus root-level batch files.

## Build, Test, and Development Commands

- `yarn dev`: run local Next.js development with mask file watching.
- `yarn build`: regenerate masks and create the standalone Next.js build.
- `yarn start`: serve the production Next.js build.
- `yarn lint`: run Next.js ESLint checks.
- `yarn test`: run Jest in watch mode for local development.
- `yarn test:ci`: run Jest once for CI.
- `yarn app:dev`: run the Tauri desktop app locally.
- `yarn app:build`: build the Tauri app.
- `yarn export`: build the export/app mode output.

## Coding Style & Naming Conventions

Use TypeScript/TSX for application code. Prettier uses 2-space indentation, semicolons, double quotes, trailing commas, and 80-column print width. ESLint extends `next/core-web-vitals`, runs Prettier, and warns on unused imports. Follow existing naming patterns: kebab-case component files such as `model-config.tsx`, matching `*.module.scss` files, and descriptive utility names under `app/utils`. Use the `@/` alias for clear root-relative imports.

## Testing Guidelines

Tests use Jest with `next/jest`, `jsdom`, and `jest.setup.ts`. Name tests `*.test.ts`, `*.test.tsx`, `*.test.js`, or `*.test.jsx`; the current convention is `test/<feature>.test.ts`. Add focused unit tests for utilities, providers, stores, and API behavior touched by a change. Use `yarn test:ci` before opening a PR.

## Commit & Pull Request Guidelines

Recent commits are short and direct, for example `Update README.md` and `Update docker.yml`. Keep commit subjects concise and present tense; use a conventional type prefix when helpful, such as `fix: handle empty provider list` or `docs: update deployment notes`. Pull requests should follow `.github/PULL_REQUEST_TEMPLATE.md`: select the change type, describe the change, include relevant context, link issues when applicable, and add screenshots or recordings for visible UI changes.

## Security & Configuration Tips

Do not commit secrets. Use `.env.template` as the reference for required variables and keep local credentials in `.env.local`. Treat files under `public/` as browser-visible; avoid placing private endpoints, tokens, or user-specific MCP configuration there.
