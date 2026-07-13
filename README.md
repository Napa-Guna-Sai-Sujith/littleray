# Little Ray Interio

A production-grade Next.js 16 (App Router) application for a South Indian home interior design company. Built to grow: new states/cities are added purely through data — never new page code.

Live in **Telangana** today. **Andhra Pradesh** and **Karnataka** launching soon.

## Tech stack

- **Frontend:** Next.js 16 App Router · React 19 · Tailwind CSS v4 · TypeScript
- **Backend:** Next.js API routes (server actions where useful)
- **Database:** PostgreSQL via Drizzle ORM
- **Auth:** JWT-in-cookie, bcrypt-hashed passwords, role-based (customer / designer / sales / admin)
- **Caching:** in-memory TTL cache for city/state reads
- **Tests:** `node --test` (unit tests for the pricing engine)

## Quick start

```bash
# 1. Install
npm install

# 2. Configure — .env is pre-set for the sandbox
# DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
# JWT_SECRET=your-secret

# 3. Push schema & seed
npm run db:push
npm run seed

# 4. Dev
npm run dev
# → http://localhost:3000
```

## Demo credentials

| Role      | Email                       | Password     |
|-----------|-----------------------------|--------------|
| Customer  | customer@littleray.local    | customer123  |
| Designer  | designer@littleray.local    | designer123  |
| Sales     | sales@littleray.local       | sales123     |
| Admin     | admin@littleray.local       | admin123     |

## Launching a new city or state (no code changes)

The core idea: **State → City → status** drives every part of the UI (header dropdown, sitemap, city page shape, calculator regional pricing).

### Option A — Admin UI
1. Log in as `admin@littleray.local` → **/admin/cities**
2. Click any city or state pill to flip between **Coming soon** and **Live**
3. The in-memory geo cache invalidates immediately

### Option B — SQL / seed
```sql
UPDATE cities SET status = 'live' WHERE slug = 'vijayawada';
UPDATE states SET status = 'live' WHERE slug = 'andhra-pradesh';
```

### Option C — Add a brand-new state or city
Edit `src/db/seed.ts`, re-run `npm run seed`, or insert directly:
```sql
INSERT INTO states (slug, name, status, launch_quarter, tagline, price_multiplier)
VALUES ('tamil-nadu', 'Tamil Nadu', 'coming_soon', 'Q2 2027', 'Coming to Chennai.', 1.1);

INSERT INTO cities (state_id, slug, name, status, price_multiplier, hero_image, description)
VALUES ((SELECT id FROM states WHERE slug='tamil-nadu'), 'chennai', 'Chennai',
        'coming_soon', 1.10, 'https://…', 'Chennai homes deserve…');
```

The new city:
- appears in the header **Cities** dropdown under its state
- shows on **/where-we-operate** with a state-level waitlist card
- gets a `/cities/chennai` page (waitlist mode until `status = 'live'`)
- is included in `/sitemap.xml` automatically
- appears in the calculator city selector, with its own regional multiplier

## What's built

### For visitors
- **Homepage** with hero, four-step process, featured projects, reviews, expansion teaser
- **/portfolio** — 20+ projects with style/BHK filters, before/after slider on detail pages
- **/services** — six service cards + AI style quiz (`/api/style-quiz`)
- **/calculator** — 4-step wizard with live estimate, save-to-account, PDF download, per-city regional pricing
- **/shop** — 22 furnishings & decor items with category filter
- **/magazine** — 12 blog posts with cover images and detail view
- **/where-we-operate** — expansion roadmap with per-state waitlist
- **/cities/[slug]** — full landing for live cities, lightweight waitlist page for coming-soon cities. SEO metadata differs by status.
- **/consultation** — full booking flow with slot picker and mode toggle
- **/login** — combined login/signup, JWT session in httpOnly cookie
- **Chat widget** — rules-based FAQ bot with lead capture (bottom-right)

### For customers (logged in)
- **/account** — saved quotes, wishlist counter, consultation history

### For staff (`/admin` — role-gated)
- Metrics dashboard: leads, conversion rate, leads-by-city, activity feed
- **/admin/leads** — kanban pipeline (new → contacted → site visit → quoted → booked → in progress → delivered)
- **/admin/cities** — toggle city/state live status (the AP/Karnataka rollout switch)
- **/admin/waitlist** — expansion signups table

### APIs
- `POST /api/leads` · `POST /api/waitlist` · `POST /api/calculator` · `POST /api/style-quiz`
- `POST /api/auth/{signup,login,logout}`
- `PATCH /api/admin/leads` · `PATCH /api/admin/city-status` (role-guarded)

### SEO
- Dynamic `<title>` and OG tags per city/state/project/post
- `sitemap.xml` with per-item `lastModified`, `priority` reflecting live vs coming-soon
- `robots.txt` with `/admin`, `/account`, `/api` disallowed

### Analytics
- Every lead, waitlist signup, saved quote, and calculator completion is written to the `events` table. Trivially swappable for GA4.

### Accessibility & performance
- Semantic HTML (nav / main / header / footer / figure / figcaption / etc.)
- `role="img"` and `aria-label` on background-image tiles
- Visible focus ring; keyboard-reachable dropdown; contrast-tested clay palette
- Server components everywhere possible; client components isolated to interactive widgets
- In-memory TTL cache on the geo query (60s) — swap to Redis with a one-line change in `src/lib/cache.ts`

### Tests
```bash
npm run test         # runs the pricing engine unit tests
```

## Project layout

```
src/
├── app/
│   ├── layout.tsx / page.tsx
│   ├── cities/[slug]/         # data-driven — one component powers 14 cities
│   ├── portfolio/[slug]/
│   ├── magazine/[slug]/
│   ├── admin/{leads,cities,waitlist}/
│   ├── account/, login/, consultation/, calculator/, services/, shop/, where-we-operate/, about/
│   ├── api/{auth,leads,waitlist,calculator,style-quiz,admin,health}/
│   ├── sitemap.ts / robots.ts
│   └── globals.css            # warm clay + sage palette, Fraunces + Inter
├── components/                # Header, Footer, ChatWidget, Calculator, Kanban, etc.
├── lib/{pricing,auth,cache,geo,site}.ts
├── db/{schema,seed,index}.ts
└── tests/pricing.test.mjs
```

## Environment variables

| Name           | Purpose                                | Default (dev)                                            |
|----------------|----------------------------------------|----------------------------------------------------------|
| `DATABASE_URL` | Postgres connection string             | `postgresql://postgres:postgres@127.0.0.1:5432/app_db`   |
| `JWT_SECRET`   | Session token signing key              | `dev-secret-change-me-in-production`                     |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO     | `https://littleray.example`                              |

## Notes

- Notification hooks (SMS/email) are logged to console — swap in SendGrid/Twilio SDKs where you see `// [notify]` comments in `src/app/api/leads/route.ts`.
- Checkout is a mock; wiring up Razorpay test mode is a straightforward addition on `/shop`.
- All imagery is Unsplash-hosted for the demo — replace with owned photography for production.
