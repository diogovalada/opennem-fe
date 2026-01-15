# Portugal Adaptation (Contract + Decisions)

This document captures the framework-agnostic contract and key decisions for adapting the upstream OpenElectricity/OpenNEM frontend to the Portugal use case.

Intent:
- Enable future replication in a different frontend (e.g. Svelte) without re-deriving the reasoning.
- Keep this short and stable; link out to deeper docs if needed.

## Scope

- Portugal-only tracker experience (single region).
- Consumption mix by ENTSO-E PSR type categories (B01..B20).
- Backend is the single source of truth (no CDN tile hosting).

## API contract (frontend ⇄ backend)

### Base URL

In dev, the frontend should be able to fetch via `/api` (Nuxt proxy) to the local FastAPI.

### Endpoints used by the tracker UI

Power (hourly):
- `GET /v1/pt/power/7d.json`
- `GET /v1/pt/power/30d.json`

Energy (daily):
- `GET /v1/pt/energy/{year}.json`
- `GET /v1/pt/energy/all.json`

### Response shape (OpenNEM-style)

Each endpoint returns a JSON object:
- `version`: string
- `network`: `"pt"`
- `region`: `"PT"`
- `created_at`: ISO datetime
- `data`: array of series

Each series (entry in `data`) includes:
- `id`: string (stable; used as domain id)
  - Convention: `pt.fuel_tech.<PSR>.<type>` (e.g. `pt.fuel_tech.B16.power`)
- `type`: `"power"` or `"energy"`
- `network`: `"pt"`
- `region`: `"PT"`
- `fuel_tech`: PSR code (e.g. `B16`)
- `units`: `"MW"` (power) or `"MWh"` (energy)
- `history`:
  - `start`: ISO datetime with explicit offset (frontend expects a `+HH:MM` suffix)
  - `last`: ISO datetime with explicit offset
  - `interval`: `"1h"` for power, `"1d"` for energy
  - `data`: array of numbers or `null`

Non-finite values (NaN/inf) must be emitted as `null` to keep JSON valid and avoid client parsing issues.

## Domain identity + ordering

- Canonical “fuel tech” identity is the PSR code (`B01..B20`) from ENTSO-E.
- Series ordering is the PSR mapping order (do not reorder ad-hoc in the UI).
- Labels come from the PSR mapping (backend + frontend should agree).
- Colors use a fork-defined palette keyed by PSR code.

## Time & timezone policy

- Backend datetimes are naive UTC internally; API emits ISO strings with `+00:00`.
- UI default display timezone is `Europe/Lisbon` (no toggle).

## Interval policy

- UI shows `1h` (enabled) and `15m` (disabled for now).
- Default interval is `1h` until backend supports `15m` end-to-end.

## Portugal-only UI constraints

- Single region only: `pt` (Portugal). Other upstream regions should be hidden/invalid.
- Keep upstream UI reuse as the priority; remove/disable only what is clearly inapplicable.

## Key decisions (short rationale)

- Reuse upstream `/energy/:region` UI rather than build a custom page: minimizes UI work now and keeps a comparable UX for later porting.
- Serve data from the backend (no CDN tiles): reduces infra complexity and keeps an API contract you can reuse from any frontend.
- Use PSR codes as stable identifiers: prevents mapping drift and keeps the backend/frontend contract explicit.

## Replication checklist (for future Svelte fork)

- Implement the endpoints + response shapes above (or keep the backend the same).
- Implement a PT-only region model with `Europe/Lisbon` display timezone.
- Implement PSR ordering/labels/colors, and treat PSR code as canonical series identity.
- Default to `1h`, render `15m` as disabled until supported.
