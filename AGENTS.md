A overview of this project is in `AGENTS - OVERVIEW.md`.

## Global rules

- **Don't make changes until I explicitly say so.**
- This is a fork; keep changes minimal and avoid unnecessary churn to reduce future merge conflicts.
  - Prefer additive files over rewrites when possible.
  - Keep fork-only logic isolated and well documented.

## Agent notes (keep up to date)

This section is where we keep operational knowledge that’s easy to lose between conversations (API contract, non-obvious decisions, and deferred risks).

If any subsections below are missing, create them using the same structure.

### “Memorize” convention

If I directly tell you to “memorize” something (e.g. “memorize this”, “can you memorize …”), treat it as a request to persist that information by updating the appropriate section below and/or linked docs.

Do not treat “memorize” as a persistence request when I’m talking about myself (e.g. “I need to memorize …”).

### Portugal adaptation contract

Framework-agnostic contract + key decisions live in `docs/PORTUGAL_ADAPTATION.md`.

If you change endpoints, response shapes, interval/timezone rules, PSR identity, or other porting-critical decisions, update that doc.

### ADRs (deep decisions)

For a small number of non-obvious decisions that are expensive to reverse and/or important to replicate in a future frontend (e.g. a Svelte port), write a short Architecture Decision Record (ADR) under `docs/adr/`.

Keep ADRs small (typically 10–30 lines) and link to deeper docs if needed.

Suggested ADR template:
- Context
- Decision
- Alternatives considered
- Consequences / tradeoffs

If a decision is already captured adequately in `docs/PORTUGAL_ADAPTATION.md`, prefer updating that doc instead of adding a new ADR.

### Diary

Intent: record decisions that aren’t obvious from the code alone (often driven by constraints or tradeoffs).

- Format: `YYYY-MM-DD: <short decision + why>`
- Keep it concise; link to deeper docs when available.

- 2026-01-15: Portugal-only tracker reuses the upstream `/energy/:region` UI and is backed by local FastAPI “stats” endpoints (no CDN tiles). Decision: optimize for UI reuse now and keep a stable API contract for future Svelte porting (details in `docs/PORTUGAL_ADAPTATION.md`).

### Heads-up (deferred)

Intent: keep a short list of known issues/risks we intentionally aren’t addressing yet.

- 15m interval is displayed but disabled until backend supports it end-to-end.
- Frontend does not implement client-side time-tile caching anymore; load-time depends on backend responsiveness.

## Fork notes

Fork-specific changes summary lives in `FORK_NOTES.md`. Keep it updated when diverging from upstream.

## Running dev server

The dev server can be launched with:
```
pnpm run docker:dev  # serves http://localhost:3000/

# or using native dev server:
yarn dev
```

Playwright is available (via the Docker MCP gateway).

## Backend dev (for local API)

FastAPI runs separately (repo: `../backend`). Typical command:
```
uvicorn api.generate_plot:app --reload --port 8000
```
