# Repository Guidelines

## Project Structure & Module Organization
This is an npm workspace monorepo with separate frontend and backend packages.

- `frontend/`: React 19 + Vite + TypeScript app. Routes live in `frontend/src/pages`, routing in `frontend/src/app`, shared UI in `frontend/src/components`, styles in `frontend/src/styles`, and API helpers in `frontend/src/utils`.
- `backend/`: Express 5 + TypeScript API. Entry points are `backend/src/server.ts` and `backend/src/app.ts`; routes, controllers, services, middleware, validators, config, and types are grouped under matching `backend/src/*` folders.
- `design/`: Static HTML design references and the campus service design system notes.
- Root `package.json`, `package-lock.json`, and `.env.example` coordinate workspace setup.

## Build, Test, and Development Commands
Run commands from the repository root unless noted.

- `npm install`: install root workspace dependencies.
- `npm run dev:frontend`: start the Vite frontend on the local dev port.
- `npm run dev:backend`: start the backend with `tsx watch`, defaulting to `http://localhost:4000`.
- `npm run build`: build all workspaces.
- `npm run lint --workspace=frontend`: run frontend ESLint.
- `npm run typecheck --workspace=backend`: run backend TypeScript checks without emitting files.
- `npm run start --workspace=backend`: run compiled backend output from `backend/dist`.

## Coding Style & Naming Conventions
Use TypeScript throughout. Follow the existing style: 2-space indentation, single quotes, no semicolons, ESM imports, and explicit `.js` extensions in backend relative imports because the backend uses NodeNext-style ESM output. React components and page files use `PascalCase` filenames, hooks use `useName`, utilities use `camelCase`, and route/controller/service modules use descriptive suffixes such as `auth.routes.ts` and `reports.service.ts`.

## Testing Guidelines
No formal test runner is currently configured. Before submitting changes, run `npm run build`, `npm run lint --workspace=frontend` for frontend work, and `npm run typecheck --workspace=backend` for backend work. If adding tests, colocate them near the code as `*.test.ts` or `*.test.tsx`, and add the relevant workspace `test` script in the same change.

## Commit & Pull Request Guidelines
Recent history uses short imperative commits, often Conventional Commit prefixes such as `fix:`, `feat:`, and `chore:`. Prefer lowercase prefixes and a specific summary, for example `fix: improve backend cors configuration`.

Pull requests should include a concise description, affected frontend/backend areas, verification commands run, linked issues when applicable, and screenshots or screen recordings for UI changes.

## Security & Configuration Tips
Do not commit real secrets. Use `backend/.env.example` and `.env.example` as templates. The backend runs in mock mode without Supabase credentials; set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and related keys only in local or deployment environments.
