# Fork Notes

Short log of changes diverging from upstream. Keep this file updated when adding or removing fork-only adjustments.

## UI toggles and removals
- Newsletter banner: hidden by default via `publicRuntimeConfig.newsletterBannerEnabled` (see `layouts/main.vue`, `layouts/facility-main.vue`, `layouts/facility.vue`).
- Footer meta (version/dev docs/API): hidden by default via `publicRuntimeConfig.footerMetaEnabled` (see `components/layout/AppFooter.vue`, `nuxt.config.js`).
- Footer sources: hardcoded to ENTSOe with prior AEMO/APVI/BoM links left commented in `components/layout/AppFooter.vue`.
- Navigation: Facilities, Scenarios, Records, and Analysis links hidden in header (set `enabled: false` in `components/layout/NewAppHeader.vue` but left in source for future use). Requests to these sections redirect to `/energy` via `middleware/disabled-sections.js` (registered globally in `nuxt.config.js`).

## Notes
- Keep these changes minimal to reduce merge conflicts with upstream; prefer flags over deletions.
