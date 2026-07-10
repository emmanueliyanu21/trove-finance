# Trove — Investment Portfolio Dashboard

Built for the Trove Frontend Engineer Assessment: a login screen plus an
authenticated dashboard (net worth, sector allocation, account summaries,
holdings, transactions) and a five-item app shell (Dashboard, Portfolio,
Transactions, Markets, Settings), driven entirely by the provided mock JSON
through a service layer — no backend.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The login screen accepts
any email/password that passes basic validation (non-empty, valid email
format) — there's no real backend, so submitting simulates a network
round-trip and then navigates to `/dashboard`. For example:

```
Email:    demo@trove.com
Password: demo1234
```

```bash
npm run build   # production build
npm run lint    # eslint
npm test        # vitest
```

## Approach & architectural decisions

- **Next.js 16** (App Router) + TypeScript, **CSS Modules** for every
  component (plus shared design tokens as CSS custom properties in
  `app/globals.css` — colors, radii, shadows from the Trove v3 palette). No
  UI component library, per the brief. **Recharts** powers the allocation
  bar (a single horizontally-stacked `Bar`) and the net worth sparkline.

- **Service layer** (`lib/services/`). Components never import the JSON
  directly.
  - `portfolioService.ts` — `fetchPortfolioData()` adds artificial latency
    and accepts `{ forceError: true }` to simulate a failed request, so the
    error state is exercisable. Swapping in a real API later means changing
    only this file.
  - `authService.ts` — `login()` validates input, awaits a fake delay, and
    stores the session in a plain (non-`httpOnly`) cookie with no explicit
    expiry — behaves like a real session cookie, cleared when the browser
    closes. No real authentication, per the brief.

- **Derived data lives outside components.** `lib/utils/portfolio/portfolio.ts`
  turns raw holdings into enriched ones (cost basis, market value,
  gain/loss) and computes sector allocation and account groupings, all as
  pure functions independent of React — which is also where the data-quirk
  decisions below are actually implemented. `hooks/usePortfolio.ts` wraps
  the service call in `loading` / `error` / `data` state with a `retry()`.

- **App shell** (`components/Layout/Layout.tsx`) owns both the sidebar
  (nav rail, profile card, "Add Funds") and the topbar (search, notification
  icon), and is also where the auth gate lives: it reads the session cookie
  and redirects to `/` if there isn't one. Every view — Dashboard, Portfolio,
  Transactions, Markets, Settings — renders through the same
  `PageClient → View` pair, loaded via `next/dynamic({ ssr: false })`, since
  the auth check depends on `document.cookie`, which doesn't exist during
  server rendering. Markets and Settings render a shared `ComingSoon`
  placeholder rather than being disabled or dead links — the nav item,
  route, and page all genuinely exist, they just don't have real content
  yet. All five routes are real; the sidebar collapses below 900px in favor
  of a single-column mobile layout.

- **Filtering.** `PortfolioView` and `TransactionsView` each pair their
  search box with a `FilterPills` row (`role="tablist"`/`role="tab"`):
  sector pills derived from whatever's actually in the holdings (not
  hardcoded) for Stocks, `All`/`Buy`/`Sell` for Orders. Both compose with
  the search filter rather than replacing it.

- **Net worth sparkline.** The wireframe's net worth card has a historical
  line chart with 1D/1W/1M/ALL range tabs, but the provided JSON is a single
  snapshot with no time series behind it. Rather than skip the chart or fake
  a data source, `lib/utils/trend/trend.ts` generates a deterministic
  illustrative curve between cost basis and current net worth (no
  `Math.random`, so it's stable across reloads); the range tabs switch
  between different deterministic variants so the control still feels
  responsive.

## Handling the data quirks

1. **NVDA `currentPrice: 0`.** Treated as "price unavailable," not "worth
   $0." `buildHoldings()` flags it (`priceUnavailable`) and nulls out
   `marketValue`/`gainLossAmount`/`gainLossPercent` rather than computing
   against 0. It still appears in the Stocks list with its ticker, name, and
   share count, but shows a "Price unavailable" badge instead of a value —
   and it's excluded from net worth, the allocation bar, and account
   totals, since including it at $0 would understate the portfolio and
   silently corrupt the % change math.

2. **DIS with 0 shares.** Treated as a closed position, not an active
   holding — `isClosedPosition` — and filtered out of the Stocks list,
   account groupings, and allocation entirely via `activeHoldings()`, since
   a 0-share row is a historical fact, not a current position.

3. **`PENDING` transactions.** Get a distinct amber/cream `StatusBadge` so
   they read as "in flight," visually separate from completed orders.

4. **`FAILED` transactions.** Get a red status pill, the whole row is
   dimmed, and the amount is struck through — a failed order shouldn't look
   like money that actually moved.

5. **Negative gain/loss.** Colored with the palette's negative red and
   signed explicitly via `formatSignedCurrency`/`formatPercent({ signed:
   true })` (e.g. `-$161.00 (6.08%)`), plus directional iconography
   (▲/▼, trending-up/down) on the net worth card and account cards — never
   color alone.
