# Coffee Snob — project plan (v1)

Working title: **Coffee Snob**. Flagged risk: an established Australian forum/app already trades as "CoffeeSnobs" (coffeesnobs.com.au, with its own Android app and podcast). Confirm a final name before public launch or any trademark filing — `Bean Beacon` checked clean against the cafe-locator and home-roasting app categories and is the recommended fallback. The codebase below uses `coffee_snob` as a placeholder package id; renaming later is a find-and-replace, not a rebuild.

## 1. Scope for v1

Locate and inform only. No ordering, no payments, no in-app reviews.

- Map and list view of cafes
- Cafe detail screen: hours, address, phone, directions, roaster badges
- Roaster badge system, two-tier trust:
  - **Self-reported** — any cafe owner can tag roasters when they claim their listing
  - **Verified** — confirmed via an Allpress data feed once that partnership exists
- Claim-listing flow for cafe owners
- Search / filter by suburb and "open now"
- Favourites

Deliberately out of scope for v1: ordering (deep-link to Mr Yum/Square comes later), user reviews, push notifications, multi-country expansion.

## 2. Why this stack

- **Flutter** — single codebase for iOS and Android, and you've already got Riverpod and the general Flutter workflow from the chess coaching app.
- **Supabase (Postgres + PostGIS)** — geospatial "cafes near me" queries are a first-class SQL feature with PostGIS, where Firestore would require faking it client-side. Also gives you auth (for the claim flow) and row-level security for free.
- **Google Maps Platform** — best data coverage for Australian addresses. Cost stays low because cafe lat/long is set once at import time, not geocoded live per request; the ongoing cost is just map tile rendering, which has a generous free tier at this scale.

## 3. Data model

Three core tables, sketched in `supabase/schema.sql`:

- `cafes` — name, address, structured hours (jsonb), a PostGIS `geography(point)` column, `claimed_by` (links to the owner's auth user once claimed)
- `roasters` — just a name registry (Allpress, Industry Beans, whoever) so badges aren't free text
- `cafe_roasters` — the join table carrying the badge itself, with a `verified` boolean and `added_by`

This shape is what lets "serves Allpress" exist as a neutral, filterable fact rather than the app's identity — any roaster can have a row here, Allpress just happens to be the one with `verified = true` once the partner feed exists.

## 4. Differentiation (why build this over what already exists)

MyCoffeeRadar already does generic AI-recommended cafe discovery. It has no concept of roaster identity and no reason for a cafe owner to ever open it — it's pure consumer-facing, which also means its data goes stale with nobody to correct it. The owner-claim flow is the actual moat: it's the only mechanism that keeps cafe data fresh without you manually re-checking hundreds of listings every month. Lead marketing and App Store copy with the badge/verification angle, not "find nearby cafes" — that search term and category is already owned by existing apps.

## 5. Build milestones

| Milestone | Deliverable |
|---|---|
| M1 | Project scaffold, Supabase schema live, seed data for a Melbourne pilot |
| M2 | Map + list screens, real "open now" logic |
| M3 | Cafe detail screen with roaster badges (matches the approved mockup) |
| M4 | Claim-listing flow: auth, roaster selection, submit |
| M5 | Search/filter by suburb and open-now, favourites |
| M6 | App store assets, privacy policy, TestFlight + Play internal test |

Pilot scope: Melbourne only, seeded by hand (~50–100 cafes pulled from Google Places, then opened to owner claims) before any national rollout. Use the Williamstown FC network for the first wave of real users when the pilot opens.

## 6. Open items before this goes further

- [ ] Finalise the app name (trademark/App Store search check on the chosen name)
- [ ] Create the Supabase project and run `supabase/schema.sql`
- [ ] Get a Google Maps Platform API key and enable billing (free tier covers early testing)
- [ ] Apple Developer and Google Play Console accounts, if not already set up
- [ ] Privacy policy covering location permissions (required by both stores)
- [ ] Allpress partnership conversation — independent of and in parallel with the build, not a blocker for it

## 7. What's in this repo right now

A hand-written Flutter + Supabase scaffold: data models, a Supabase service layer, the theme, and three screens (map, cafe detail, claim listing) implementing the badge UI already agreed on. It has **not** been run or compiled — this sandbox has no network access to pub.dev or the Flutter SDK, so treat it as a structured starting point, not tested code. Open it in FlutLab.io (same workflow as the chess app) or a local Flutter install, run `flutter pub get`, and work through any compile errors from there — the architecture and logic are real, but package-version drift is likely given how fast `supabase_flutter` and `google_maps_flutter` move.
