# Trove — Portfolio Dashboard

An investment portfolio dashboard built for the Trove Frontend Engineer
Assessment: a login screen and an authenticated app shell — Dashboard,
Portfolio, Transactions, Markets, and Settings — built around one net worth
card, sector allocation, account summaries, holdings, and transactions.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The login screen accepts
any email/password combination that passes basic validation — there's no real
backend, so submitting the form simulates a network round-trip and then
navigates to `/dashboard`.

```bash
npm run build   # production build
npm run lint     # eslint
npm test         # vitest
```

## Stack

- **Next.js 16** (App Router) + TypeScript
- **CSS Modules** for all component styling, plus a small set of CSS custom
  properties in `app/globals.css` for the Trove design tokens (colors, radii,
  shadow). No UI component library, per the assessment brief.
- **Recharts** for the allocation bar (a single horizontally stacked `Bar`
  chart with one segment per sector).
- **Vitest** for unit tests, scoped to `lib/utils/` — the pure logic layer
  with no React/DOM involved, so no `jsdom`/Testing Library dependency was
  needed. Config lives in `vitest.config.mts` (the `.mts` extension is
  required for Vite's config loader here — a plain `.ts` file fails since one
  of the plugins ships ESM-only).

## Architecture

- **`lib/data/portfolio-data.json`** — the provided mock data, copied as-is.
- **`lib/services/portfolioService.ts`** — the service layer the brief asks
  for. Components never import the JSON directly; they go through
  `fetchPortfolioData()`, which adds artificial latency and can simulate a
  failure (`{ forceError: true }`) so the error state is exercisable. Swapping
  in a real API later means changing only this file.
- **`lib/services/authService.ts`** — simulated auth. `login()` validates
  input, awaits a fake delay, and stores a session flag in a plain
  (non-`httpOnly`) cookie with no explicit expiry, so it behaves like a
  session cookie — cleared when the browser closes, not just the tab. There's
  no real authentication per the brief.
- **`hooks/usePortfolio.ts`** — a client hook wrapping the service call with
  `loading` / `error` / `data` state and a `retry()` for the error UI.
- **`lib/utils/portfolio/portfolio.ts`** — all the derived-data logic (enriching raw
  holdings, computing net worth, sector allocation, account groupings) lives
  here, independent of any component, so it's unit-testable and is where the
  data-quirk decisions below are actually implemented.
- **`components/dashboard/DashboardView/DashboardView.tsx`** — the
  dashboard's auth gate and data-loading shell. It's rendered via
  `next/dynamic({ ssr: false })` from a small client wrapper
  (`app/dashboard/DashboardPageClient.tsx`) because the auth check depends on
  `document.cookie`, which doesn't exist during server rendering — this
  avoids a hydration mismatch rather than papering over one. That wrapper exists
  separately from `app/dashboard/page.tsx` because `page.tsx` needs to stay a
  Server Component to export the `noindex` metadata below — metadata exports
  aren't allowed in Client Components.
- **Stocks and Orders filtering.** `PortfolioList` and `TransactionsList`
  each own a `FilterPills` row alongside the existing search box: sector
  pills (`All` plus whatever sectors are actually present in the holdings —
  derived from the data, not hardcoded) for Stocks, and `All` / `Buy` / `Sell`
  for Orders. Both compose with the search filter rather than replacing it.
- **`components/dashboard/shell/Sidebar/Sidebar.tsx`** / **`Topbar/Topbar.tsx`** — the app-shell
  chrome from the wireframe (nav rail with Dashboard/Portfolio/Transactions/
  Markets/Settings, profile footer, top search bar, notification/help icons).
  All five nav items are real, separately-routed pages (`/dashboard`,
  `/portfolio`, `/transactions`, `/markets`, `/settings`), each rendered
  through its own `PageClient` → `View` pair following the same
  `next/dynamic({ ssr: false })` pattern described below. Markets and
  Settings currently render a shared `ComingSoon` placeholder (icon, title,
  one-line description) rather than being disabled or dead links — the nav
  item, route, and page all genuinely exist, they just don't have real
  content behind them yet. "Add Funds" surfaces a small "not available in
  this demo" toast instead of silently doing nothing. The sidebar is hidden
  below 900px in favor of the single-column mobile layout already verified
  responsive.
- **Sidebar profile name.** Every view resolves `userName` from
  `usePortfolio()`, not from the login session directly — the session only
  stores whatever was typed into the email field, which briefly disagreed
  with the real mock user's name while the simulated fetch was in flight.
  `Sidebar` renders a shimmering skeleton in place of the avatar/name/tier
  until `userName` resolves, rather than flashing the session name and then
  swapping it for the real one.

### A note on the net worth sparkline

The wireframe's net worth card has a historical line chart with 1D/1W/1M/ALL
range tabs. The provided JSON is a single snapshot with no time series behind
it, so rather than skip the chart or fake a data source, `lib/utils/trend/trend.ts`
generates a deterministic illustrative curve between cost basis and current
net worth (no `Math.random`, so it's stable across reloads). The range tabs
switch between different deterministic variants so the control still feels
responsive. The card's caption says "Illustrative trend" so it's not
mistaken for real historical data.

## SEO

- **`app/layout.tsx`** sets the shared metadata: a title template (`%s · Trove`,
  so `app/dashboard/page.tsx`'s `"Dashboard"` renders as "Dashboard · Trove"),
  description, keywords, and Open Graph/Twitter card fields.
- **`app/opengraph-image.tsx`** generates a branded 1200×630 share-preview
  image at build time via `next/og`'s `ImageResponse` — no static asset to
  keep in sync with the palette.
- **`app/robots.ts`** allows `/` but disallows `/dashboard`, and points at
  **`app/sitemap.ts`**, which only lists `/`. The dashboard is a per-session
  authenticated view with nothing for a crawler to usefully index.
- **`app/dashboard/page.tsx`** additionally sets `robots: { index: false,
  follow: false }` directly on the route (belt-and-suspenders alongside the
  `robots.txt` disallow — the meta tag is what actually keeps a page out of
  the index if it's ever linked from somewhere crawlable, since a robots.txt
  disallow only stops crawling, not indexing of a known URL).
- All of the above resolve absolute URLs from `lib/constants.ts`'s
  `SITE_URL`, which reads `NEXT_PUBLIC_SITE_URL` and falls back to
  `http://localhost:3000`. **Set `NEXT_PUBLIC_SITE_URL` to the real deployed
  URL** (e.g. in Vercel's environment variables) so OG images, canonical
  URLs, and the sitemap resolve correctly in production.

## Handling the data quirks

1. **NVDA `currentPrice: 0`.** Treated as "price unavailable," not "worth
   $0." The holding still appears in the Stocks list with its ticker, name,
   and share count, but shows a "Price unavailable" badge instead of a
   value or gain/loss, and it's excluded from net worth, the allocation bar,
   and the account totals — including it at $0 would understate the
   portfolio and silently corrupt the % change calculation.

2. **DIS with 0 shares.** Treated as a closed position rather than an active
   holding. It's filtered out of the Stocks list, account groupings, and
   allocation entirely, since a 0-share row is a historical fact, not a
   current holding. A small note under the Stocks list ("1 closed position
   (0 shares) not shown") surfaces that it was seen and intentionally
   excluded, rather than silently dropping it.

3. **`PENDING` transactions.** Shown with a distinct amber/cream status pill
   (`StatusBadge`) so they read as "in flight," visually separate from
   completed orders.

4. **`FAILED` transactions.** Get a red status pill, the whole row is
   dimmed, and the amount is struck through — a failed order shouldn't look
   like money that actually moved.

5. **Negative gain/loss.** Colored with the palette's negative red, prefixed
   with a down arrow, and signed explicitly (e.g. `▼ -$161.00 (6.08%)`)
   rather than relying on color alone.

Net worth's "% change" has no historical time series in the data, so it's
computed as (current market value − cost basis) / cost basis across priced,
open holdings — effectively "return since purchase," which is the only
notion of "change" the given data supports. This is called out in the
Net Worth card's caption ("Computed from all priced, open holdings").

"Accounts" are derived by grouping open holdings by `sector`, since the data
has no separate account/portfolio concept.

## Testing

`lib/utils/portfolio/portfolio.ts`, `format.ts`, and `validation.ts` have unit tests
(`*.test.ts`, colocated) covering the derived-data math and, deliberately,
the data-quirk behavior itself: there's a test asserting NVDA's zero price
nulls out its value/gain-loss instead of computing against $0, one asserting
DIS's zero shares excludes it from every aggregate, and one asserting a
zero-cost-basis holding doesn't produce `NaN`/`Infinity` for gain/loss
percent. Run with `npm test`.

## What I'd improve with more time

- Persist search and filter-pill state to the URL (`searchParams`) so a
  filtered Stocks or Orders view is shareable/bookmarkable.
- Add a real historical net-worth series (even mocked) to back a proper
  day/week/month change indicator instead of the all-time proxy.
- Virtualize the holdings/transactions lists if the dataset grew large.
- Component tests (React Testing Library) for the interactive pieces —
  `PortfolioList`/`TransactionsList` filter-pill behavior, the login form's
  validation states — the current suite only covers the pure `lib/utils`
  layer.
- Build out real Markets and Settings content instead of the `ComingSoon`
  placeholder.
- Keyboard navigation polish for `FilterPills` (currently clickable and
  screen-reader-labeled via `role="tablist"`/`role="tab"`, but no arrow-key
  roving tabindex).
