---
name: alreda-scaffold
description: Scaffold foundation code for the Al-Reda Next.js 16 e-commerce monorepo following ARCHITECTURE.md, including dep install, alias rules, and verification loop.
source: auto-skill
extracted_at: '2026-07-15T23:04:19.519Z'
---

# Al-Reda Foundation Scaffold

Reusable procedure for building out the Al-Reda door-hardware e-commerce platform
from its `md/ARCHITECTURE.md` design spec. The repo is a pnpm Turborepo with a
`shadcn/ui` template; the documented `src/` folders and feature modules do NOT
exist yet — they must be scaffolded.

## Project layout facts (verified, non-obvious)

- Monorepo root: `package.json` (workspace) + `turbo.json` + `pnpm-workspace.yaml`.
- Web app at `apps/web/`. App Router lives at `apps/web/app/` (NO `src/` wrapper).
- Path alias `@/*` → `apps/web/*` (see `apps/web/tsconfig.json`). Put `lib/`,
  `models/`, `services/`, `repositories/`, `validators/`, `config/`, `constants/`,
  `types/`, `middleware.ts`, `providers/`, `store/`, `hooks/`, `utils/`,
  `styles/` at `apps/web/` root, NOT under `src/`.
- UI components come from `@workspace/ui` (import `"@workspace/ui/..."`).
- Tailwind v4, Next 16, React 19. `next.config.ts` already sets
  `transpilePackages: ["@workspace/ui"]`.

## Dependency reality (discovered empirically)

The base template does NOT include backend deps. Before writing code that imports
them, install at the `web` package scope:

```
pnpm --filter web add mongoose bcryptjs jsonwebtoken clsx tailwind-merge zod
pnpm --filter web add -D @types/bcryptjs @types/jsonwebtoken
```

`zod` is only present transitively via `packages/ui` — add it directly to `web`
or validators fail to resolve (`Cannot find module 'zod'`).

## Conventions that pass lint/typecheck

- Mongoose: guard against model re-compilation in dev with
  `mongoose.models.X ?? mongoose.model<IX>(...)`.
- DB connection: cache on `globalThis` to survive hot reloads
  (`connectDB()` returns `mongoose`).
- `next.config.ts` / `lib/db.ts` env reads: assign to a `const uri: string`
  after the undefined check so TS doesn't complain about `string | undefined`.
- Avoid `setState` synchronously inside `useEffect` (triggers
  `react-hooks/set-state-in-effect` warning). Initialize `useState` lazily
  instead: `useState(() => readCart())`.
- Client hooks must start with `"use client"`.

## Env vars — Turbo requirement

`turbo.json` runs `no-undeclared-env-vars` lint. Declare every `process.env.*`
used in code under `globalEnv` in `turbo.json`:

```json
"globalEnv": [
  "MONGODB_URI", "JWT_SECRET", "NEXT_PUBLIC_APP_URL",
  "CLOUDINARY_URL", "PAYMOB_API_KEY", "NODE_ENV"
]
```

Also provide `apps/web/.env.example` with the same keys.

## Verification loop (mandatory before declaring done)

```
cd apps/web && pnpm typecheck && pnpm lint
```

Both must exit 0 problems (warnings are acceptable but should be cleared where
easy). Fix in this order: (1) missing modules → install deps, (2) `string |
undefined` → const after guard, (3) `unknown` filter props → typed local object,
(4) env lint → `turbo.json` globalEnv.

## Layer pattern used (matches ARCHITECTURE.md)

- `models/` Mongoose schemas for each collection (users, products, categories,
  brands, orders, orderItems, addresses, coupons, ...).
- `repositories/` thin async wrappers over models (findById/list/create/update).
- `services/` business logic (filter building, checkout + stock reservation,
  bcrypt hashing).
- `validators/` Zod schemas for every input boundary.
- `middleware.ts` decodes the session cookie and enforces RBAC via
  `constants/roles.ts` `hasRole` + route-prefix gating (`/dashboard` → manager+).

## Gotcha: this is a custom Next.js 16

Per `AGENTS.md`, this Next.js has breaking changes vs training data. If unsure
about an API, read `node_modules/next/dist/docs/` before coding.
