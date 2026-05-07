# Evvnt Web (frontend)

**Evvnt** is an event-centric operating system for planners, hosts, corporate teams, and venue stakeholders. It is designed to unify planning, guest operations, ticketing, finance, vendors, gifting, media, and reporting around a single **Event** entity (multi-tenant SaaS). This repository is the **browser client** for Evvnt: dashboards, authenticated workflows, and public/auth routes that talk to the Evvnt API.



---

## Stack

Vite · React 19 · TypeScript, aligned with the **EHR** app patterns (`/Users/pinheiro/EHR/ehr`): TanStack Router (file routes), TanStack Query, Zustand (auth persistence), Axios, React Hook Form, Zod, Tailwind CSS, Radix primitives, Biome, Vitest.

This project is **`evvnt-frontend`** — a separate directory next to the **`evvnt`** backend repo (not inside it).

---

## Implemented in this UI (moving target)

Authentication (login/signup), the authenticated **app shell** (sidebar + main column), **Events** dashboard entry, **Guest Management** (`/events/guests`), and routes such as **Event Planner** under `/events/planner`. New modules land here first; parity with the PRD is incremental.

---

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

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server (port 3000) |
| `npm run build` | Production bundle |
| `npm run preview` | Serve production build locally (port 3000) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Biome check + write |
| `npm run test` | Vitest (once) |

---

## Layout

- `src/routes/` — file-based routes (`routeTree.gen.ts` is generated on build/dev). Authenticated UI lives under `routes/(authenticated)/_appLayout/` (same idea as EHR’s `/(authenticated)/_appLayout`).
- `src/pages/` — page-level compositions wired from routes.
- `src/services/` — API calls (Evvnt `{ ok, data }` envelope).
- `src/store/` — Zustand stores (`evvnt-auth` persisted); import via `@store`.
- `src/lib/http.ts` — Axios instance: **Bearer** on API calls; **no Bearer** on `POST /auth/login`, `/auth/signup`, `/auth/refresh`. On **401**, tries **`POST /auth/refresh`** once, updates tokens via `replaceTokens`, retries the request; otherwise clears session and redirects to `/login` (except when already on `/login` or `/signup`).
- `src/data/` — static/demo datasets and shared constants (e.g. dashboard demo content).
- `src/hooks/` — shared hooks (`@hooks`).
- `src/types/` — shared TypeScript types (`@types`).
- `src/schemas/` — Zod schemas for forms/API validation (`@schemas`).

### Component architecture

Atomic-ish layering: **`ui`** → **`molecules`** → **`organisms`** → **`templates`**.

| Folder | Role |
| --- | --- |
| `src/components/ui/` | Design-system primitives (`Button`, `Card`, `Input`). |
| `src/components/molecules/` | Small composed pieces (e.g. guest list rows, badges, stat cards — see `molecules/guests/`). |
| `src/components/organisms/` | Feature sections (e.g. `organisms/dashboard/` — sidebar, KPI strip, event cards). |
| `src/components/templates/` | App shells (e.g. `EvvntAppLayout` — sidebar + main column, wraps `<Outlet />`). |

Path aliases (see `tsconfig.app.json` / `vite.config.ts`): `@ui/*`, `@molecules/*`, `@organisms/*`, `@templates/*`, `@hooks`, `@data`, `@utils`, `@store`, `@types`, `@schemas`.
