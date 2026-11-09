# EventHub — Event Discovery & Community Engagement Platform

CS619 Final Year Project · Student ID BC210424561 · Group S26PROJECTA3C38 · Supervisor: Amjad Iqbal Khan
Aptech Metro Star Gate, Karachi · Spring 2026

EventHub lets people discover events on an interactive map, filter by category, search, RSVP, save favourites,
review events and submit their own for admin approval.

| | |
|---|---|
| **Frontend** | Next.js 16.4 (App Router, Cache Components), React 19, Tailwind CSS v3, NextAuth v5, react-leaflet, Swiper |
| **Backend** | Strapi v5 (headless CMS), REST API, JWT auth |
| **Database** | NeonDB (managed PostgreSQL) |
| **Media** | Cloudinary |
| **Hosting** | Vercel (frontend) · Render (backend) |

**Live URLs**

- Frontend: https://eventhub-beige.vercel.app
- API: https://eventhub-api-ywu6.onrender.com
- Strapi admin: https://eventhub-api-ywu6.onrender.com/admin

The API runs on Render's free tier, so the first request after a period of inactivity can take up to a minute.
Outgoing email is disabled on the live site (the free tier blocks SMTP), so sign-up needs no email confirmation
there; confirmation and RSVP emails work when the backend runs locally with Gmail SMTP configured.

## Repository layout

```
backend/    Strapi v5 app (content types, controllers, seed data, permissions bootstrap)
frontend/   Next.js app (pages, components, server actions, API client)
render.yaml Render blueprint for the backend
```

**Pages:** Home (hero, categories, featured, upcoming, how it works, map showcase, features, organizer banner, FAQ),
Events (map + list), Event detail, Categories, About, Contact, Terms, Privacy, Login/Register, Dashboard,
Submit event, Admin panel.

## Sample content

The seed creates 6 categories and 16 events dated between late October and December 2026, each with a written
description and a fictional organizer. To attach photos to the events (free Unsplash images, uploaded to your
Cloudinary through Strapi), run once after the backend is up:

```bash
cd backend
STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=<full-access-token> node scripts/seed-event-photos.mjs
```

It is safe to re-run (events that already have photos are skipped). Landing-page and category photos are stored in
`frontend/public/images/` (from [Unsplash](https://unsplash.com), free to use).

## Run it locally

Requirements: Node.js 20–24, a NeonDB database, a Cloudinary account.

```bash
# 1. Backend
cd backend
cp .env.example .env          # fill in secrets, DATABASE_URL, Cloudinary keys
npm install
npm run develop               # http://localhost:1337  (admin: /admin)
```

On first boot the backend creates the roles/permissions, seeds **6 categories and 16 events**
(`SEED_DATA=true`) and, if `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD` are set, an Administrator account.

Then in Strapi admin (`/admin`): create your Strapi super-admin, go to **Settings → API Tokens**, create a
**Full access** token and put it in the frontend's `STRAPI_API_TOKEN`.

```bash
# 2. Frontend
cd frontend
cp .env.example .env.local    # fill in AUTH_SECRET, STRAPI_API_TOKEN, URLs
npm install
npm run dev                   # http://localhost:3000
```

Production build check: `npm run build && npm run start`.

## Email (Gmail SMTP)

Two emails are sent through Gmail SMTP: a **confirmation link when someone creates an account** (they cannot log in
until they click it) and an **RSVP confirmation** with the event's date, venue and price.

1. Use a Gmail account, turn on **2-Step Verification**, then *Google Account → Security → App passwords* and create one.
2. In `backend/.env` set `SMTP_USER` (the Gmail address), `SMTP_PASS` (the 16-character app password) and
   `FRONTEND_URL` (`http://localhost:3000` locally), then restart Strapi.

While `SMTP_PASS` is empty, emails are switched off and sign-up works without email confirmation, so the project
still runs without Gmail. Email problems never block an RSVP.
On Render set the same three variables. Render's free web services block outgoing SMTP, so Gmail may time out there:
use a paid instance, or swap the Strapi email provider for an HTTP mail API such as Resend or Brevo.

## AI event assistant (Google Gemini)

A floating **Ask AI** button (bottom-right on every public page) opens a chat where visitors ask in plain language,
for example "free events this month" or "cheap tech events in November". The assistant answers only from the live
events in the database and shows tappable event cards, so it cannot invent events. The key stays on the server
(`/api/assistant`), questions are length-limited and rate-limited, and the model's answer is checked against real
event slugs before anything is shown.

1. Create a free key at <https://aistudio.google.com/apikey>.
2. Put it in `frontend/.env.local` as `GEMINI_API_KEY=...` (optional: `GEMINI_MODEL`, default `gemini-3.8-flash`) and restart `npm run dev`.
3. On Vercel add the same `GEMINI_API_KEY` variable **before** deploying.

Without a key the button still shows, but the chat explains that the assistant isn't switched on. The free tier has request limits, so very busy moments can show
"The assistant is busy".

## Roles

| Role | Can do |
|---|---|
| **Guest** | Browse the map and list, filter, search, view events and reviews, see featured events |
| **Member** | Everything above + RSVP, save events, review, submit events (go to *pending*), edit profile/photo/password |
| **Administrator** | `/admin` panel: approve/reject submissions, feature events, change status, delete events, block/unblock users. Categories, roles and deeper edits via the Strapi admin |

To make someone an Administrator: set `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD`, or in Strapi admin open
*Content Manager → User* and set the user's role to **Administrator**.

## Deployment (Days 13–15)

**1. Backend on Render**

1. Push the repo to GitHub (see the note below about `frontend/.git`).
2. Render → *New → Blueprint* → select the repo. It reads `render.yaml`.
3. Fill the prompted variables: `DATABASE_URL` (Neon pooled string), `APP_KEYS` (4 comma-separated random keys),
   `PUBLIC_URL` (the Render URL), `CORS_ORIGINS` and `FRONTEND_URL` (your Vercel URL, add after step 2), `SMTP_USER` / `SMTP_PASS` (see *Email*), Cloudinary keys, and
   `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` (a strong password).
4. After the first deploy open `https://<api>/admin`, create the Strapi super-admin and a **Full access API token**.
5. Check `https://<api>/api/events` returns the 16 seeded events.

**2. Frontend on Vercel**

1. Import the repo, set *Root Directory* to `frontend`.
2. Environment variables: `NEXT_PUBLIC_STRAPI_URL`, `NEXT_PUBLIC_STRAPI_API_URL` (`…/api`), `NEXT_PUBLIC_SITE_URL`
   (the Vercel URL), `AUTH_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (the Vercel URL), `STRAPI_API_TOKEN`,
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `GEMINI_API_KEY`.
3. Deploy, then add the Vercel URL to the backend's `CORS_ORIGINS` on Render and redeploy the backend.

**3. Final QA** — log in as a member (RSVP, save, review, submit an event), log in as admin and approve it,
confirm it shows on the map, and try the site at 375 / 768 / 1280 px.

### Notes for deployment

- **Region matters.** Put NeonDB and the Render service in the **same region** (and as close to Karachi as
  possible, e.g. Singapore). A Neon project far from the API makes every request 2–3 s slower.
- **Render free tier sleeps** after inactivity; the first request after a nap can take ~30–60 s. Open the API URL
  once before a demo.
- **Nested git repository.** `frontend/` was created with its own `.git`. For a single monorepo remove it
  (`rm -rf frontend/.git`) before the first `git init` at the repository root.
- Rotate any credentials that were shared while developing (Neon password, Cloudinary secret, API token).

## Quality checks run on this build

- Strict TypeScript, ESLint-clean production build (`next build`).
- **194 automated browser checks** (Chrome, desktop + 375px mobile) against the production build:
  map & list sync, filters and search, event detail, RSVP/save/review flows, dashboard, event submission with
  photo upload, the full admin moderation lifecycle, and a site-wide smoke test (every page and nav/footer link:
  no broken images, no horizontal scroll, FAQ, hero search, contact validation, 404 page).
- Lighthouse (mobile emulation): Accessibility 100, Best Practices 100, SEO 92–100 on the main pages;
  Performance 52–67 (image-heavy design plus the remote-database round trips in this setup).
- Security: user updates are restricted to the owner and cannot change role/blocked; owner-scoped RSVPs,
  bookmarks and reviews; submitted events are forced to *pending*; admin actions re-check the role on the server;
  the API token is server-only.
