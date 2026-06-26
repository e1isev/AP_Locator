# AP Locator — v1 Plan (Allpress Cafe Locator)

## Context
The goal is an iOS/Android app that helps people find cafes in Australia that serve Allpress coffee. There's no public Allpress stockist API, so the cafe directory has to be built and maintained directly. Real in-app ordering is a much bigger undertaking (per-cafe onboarding, menus, order workflows) and is explicitly out of scope for v1 — the goal here is to validate demand with a fast, well-built locator first.

**v1 scope:** map-based cafe locator with detail pages (hours, address, contact, photos). No ordering, no accounts required to browse.
**Data sourcing:** manually curated seed list, entered through an admin tool, stored in a real database (not hardcoded) so it can grow later.
**Stack:** React Native + Expo for the app; a small backend + Postgres for the cafe data.

## Architecture

### Backend
- **Postgres with PostGIS** (via Supabase — gives hosted Postgres, PostGIS, auth, storage, and a REST/Realtime API out of the box, minimal ops).
- **`cafes` table**: id, name, address, lat/lng (geography point), phone, website, hours (structured per-day open/close), photo_url(s), allpress_verified (bool), notes, created_at/updated_at.
- **Admin write access**: simplest v1 path is Supabase's own table editor / a tiny internal script for seeding and edits — no need to build a custom admin UI yet given a single curator.
- **Read API**: app queries Supabase directly via its client SDK with a PostGIS radius/bounding-box query (`ST_DWithin`) to fetch cafes near the map viewport — avoids shipping the whole dataset to the client as it grows.

### Mobile App (React Native + Expo)
- **Navigation**: Expo Router or React Navigation — two main screens: Map and Cafe Detail (modal/sheet).
- **Map**: `react-native-maps` (Apple Maps on iOS, Google Maps on Android) with marker clustering (`react-native-map-clustering`) so dense areas (Sydney/Melbourne CBD) stay readable.
- **Data fetching**: `@supabase/supabase-js`, fetch cafes within current map bounds on move/zoom (debounced), cache with React Query.
- **Cafe detail sheet**: bottom sheet (`@gorhom/bottom-sheet`) showing name, photo, open/closed-now status computed from structured hours, address with "Get Directions" (opens native Maps app), phone tap-to-call, website link.
- **Search**: simple text search/autocomplete by suburb or cafe name, list view fallback for accessibility.
- **No auth required** for browsing in v1 — keeps onboarding friction at zero.

### Seed data
- Build the initial list (~50-200 cafes) manually: Allpress's own "Find a Cafe" page/socials, Google Maps searches, and direct knowledge — compiled into a CSV, then imported into Supabase via a one-off script (`scripts/seed-cafes.ts` using the Supabase service-role client).

## Build Order
1. Scaffold Expo app (`npx create-expo-app`), set up TypeScript, navigation skeleton.
2. Set up Supabase project, `cafes` table + PostGIS extension, RLS policy (public read-only).
3. Write and run the CSV → Supabase seed script with an initial cafe list (start with 10-20 real ones to unblock app dev, expand later).
4. Build Map screen: render markers from a bounding-box query, clustering, current-location centering.
5. Build Cafe Detail bottom sheet: hours parsing/"open now" logic, directions/call/website actions.
6. Add search/list fallback view.
7. Polish: empty states, loading states, app icon/splash, basic analytics (e.g. PostHog or Supabase logs) to see if anyone's using it.
8. TestFlight + Android internal testing release for personal/friends testing before public store submission.

## Verification
- Run the app in Expo Go / iOS simulator and Android emulator; confirm markers load for the seeded cafes and clustering works when zoomed out over a city.
- Tap a marker → detail sheet shows correct hours/open-now status; verify against at least 3 real cafes' actual posted hours.
- Test "Get Directions" and "Call" actions open the correct native apps.
- Test search by suburb name returns expected results.
- Confirm bounding-box queries don't refetch excessively while panning (check network tab/Supabase logs).

## Explicitly deferred (not v1)
- In-app ordering / payments (Stripe) — requires per-cafe onboarding and operational buy-in, separate future phase.
- Crowdsourced cafe submissions + moderation queue.
- User accounts, favorites, push notifications.
- Admin web dashboard (use Supabase's built-in table editor for now).
