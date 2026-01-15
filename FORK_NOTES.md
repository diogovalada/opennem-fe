# Fork Notes

Short log of changes diverging from upstream. Keep this file updated when adding or removing fork-only adjustments.

## UI toggles and removals
- Newsletter banner: hidden by default via `publicRuntimeConfig.newsletterBannerEnabled` (see `layouts/main.vue`, `layouts/facility-main.vue`, `layouts/facility.vue`).
- Footer meta (version/dev docs/API): hidden by default via `publicRuntimeConfig.footerMetaEnabled` (see `components/layout/AppFooter.vue`, `nuxt.config.js`).
- Footer sources: hardcoded to ENTSOe with prior AEMO/APVI/BoM links left commented in `components/layout/AppFooter.vue`.
- Navigation: Facilities, Scenarios, Records, and Analysis links hidden in header (set `enabled: false` in `components/layout/NewAppHeader.vue` but left in source for future use). Requests to these sections redirect to `/energy` via `middleware/disabled-sections.js` (registered globally in `nuxt.config.js`).
- Routing: catch-all page canonicalizes missing trailing slashes (`/path` → `/path/` with query/hash preserved); `nuxt.config.js` router config merged so `disabled-sections` middleware runs alongside `base`/`trailingSlash`.

## Portugal-only energy tracker
- The main `/energy/:region` experience is now Portugal-only (`pt`) with PSR fuel-tech categories, PSR ordering, and a custom palette; grouping defaults to PSR (see `constants/energy-fuel-techs/group-psr.js`, `constants/energy-fuel-techs/index.js`).
- Data is fetched from the local FastAPI via `/api` proxy and PT stats endpoints (`/v1/pt/power/*.json`, `/v1/pt/energy/*.json`) instead of OpenNEM CDN (see `services/Data.js`, `nuxt.config.js`).
- Power ranges use 1h by default; 15m is shown but disabled pending backend support (see `constants/ranges.js`, `components/Energy/DataOptionsBar.vue`, interval parsing helpers).

## Notes
- Keep these changes minimal to reduce merge conflicts with upstream; prefer flags over deletions.
