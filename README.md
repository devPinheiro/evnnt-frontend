# Evvnt Web (frontend)

Vite + React 19 + TypeScript, aligned with the **EHR** app patterns (`/Users/pinheiro/EHR/ehr`): TanStack Router (file routes), TanStack Query, Zustand (auth), Axios, Tailwind CSS, Biome.

This project is **`evvnt-frontend`** — a separate directory next to the **`evvnt`** backend repo (not inside it).

## Setup

```bash
cd evvnt-frontend
cp .env.example .env
# VITE_API_URL=http://localhost:4000
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Point `VITE_API_URL` at the **Evvnt API** from the `evvnt` backend project (default local URL `http://localhost:4000`). That server enables `cors()` for browser access.

**API contract:** successful JSON bodies are `{ ok: true, data: ... }`; errors are `{ ok: false, error: { code, message } }` — the Axios client unwraps these and surfaces `error.message` in toasts and query errors.

## Scripts

| Script        | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Vite dev server (port 3000) |
| `npm run build` | Production bundle      |
| `npm run typecheck` | `tsc --noEmit`      |
| `npm run lint` | Biome check + write     |

## Layout

- `src/routes/` — file-based routes (`routeTree.gen.ts` is generated on build/dev). Authenticated UI lives under `routes/(authenticated)/_appLayout/` (same idea as EHR’s `/(authenticated)/_appLayout`).
- `src/services/` — API calls (Evvnt `{ ok, data }` envelope).
- `src/store/` — Zustand stores (`evvnt-auth` persisted); import via `@store`.
- `src/lib/http.ts` — Axios instance + Bearer token + 401 → logout.
- `src/data/` — static/demo datasets and shared constants (e.g. dashboard demo content).
- `src/hooks/` — shared hooks (`@hooks`).
- `src/types/` — shared TypeScript types (`@types`).
- `src/schemas/` — form/API validation schemas (placeholder; EHR uses Zod/Valibot heavily).

### Component architecture (EHR-style)

Following **atomic-ish** folders like EHR (`ui` → `molecules` → `organisms` → `templates`):

| Folder | Role |
|--------|------|
| `src/components/ui/` | Design-system primitives (`Button`, `Card`, `Input`). |
| `src/components/molecules/` | Small composed pieces (empty until you add shared rows, fields, etc.). |
| `src/components/organisms/` | Feature sections (e.g. `organisms/dashboard/` — sidebar, KPI strip, event cards). |
| `src/components/templates/` | App shells (e.g. `EvvntAppLayout` — sidebar + main column, wraps `<Outlet />`). |

Path aliases (see `tsconfig.app.json` / `vite.config.ts`): `@ui/*`, `@molecules/*`, `@organisms/*`, `@templates/*`, `@hooks`, `@data`, `@utils`, `@store`, `@types`, `@schemas`.

## EHR vs this repo

EHR uses many more packages (Radix, TipTap, CASL, etc.). This app keeps a **minimal** stack; you can port UI patterns from EHR incrementally.
