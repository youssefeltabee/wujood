# Wujood (وجود)

From Digital Ghost to Digital Presence. All-in-one digital presence platform for Egyptian SMEs.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Prisma 6 + PostgreSQL (Supabase)
- **Auth**: JWT via jose (Edge-compatible) + bcrypt
- **Background jobs**: Upstash QStash
- **Rate limiting**: Upstash Redis (`@upstash/ratelimit`)
- **Hosting**: Vercel

## Architecture (v3)

Every API module follows one layering pattern:

```
route (src/app/api/**)  →  controller (src/modules/<m>/<m>.controller.ts)  →  service (<m>.service.ts)  →  Prisma
```

Route files are thin delegates. Controllers own zod request validation and HTTP responses. Services own Prisma access and domain errors. Errors funnel through `handleApiError` (`src/lib/errors.ts`).

### Security shipped in v3

| Control | Where |
|---------|-------|
| Paid-tier gate: tier changes require a completed Fawry payment within 35 days (402 otherwise) | `src/app/api/subscriptions/route.ts`, `src/modules/payments/payments.gate.ts` |
| SSRF defense: single DNS resolution with IP pinning and private-range rejection on audit scans, response body capped | `src/modules/audit/audit.scanner.ts` |
| Refresh tokens stored as SHA-256 hashes with rotation + reuse detection (reuse revokes the whole session family) | `src/modules/auth/auth.session.ts` |
| Access-token verification in Edge middleware via `jose` (no `jsonwebtoken`) | `src/middleware.ts`, `src/lib/jwt.ts` |
| Per-profile rate limits honored under Upstash (sliding windows keyed by interval+max) | `src/lib/rate-limit.ts` |
| WhatsApp abuse controls: 50 msgs/user/hour, E.164 recipient validation, live sends gated behind `WA_MOCK=true` mock mode | `src/app/api/whatsapp/send/route.ts` |
| Chat abuse controls: 10 msgs/user/min, messages capped at 2000 chars, stored history truncated before the OpenAI call | `src/modules/chat/chat.controller.ts` |
| Startup env validation (zod): JWT_SECRET length ≥32 + placeholder rejection, DATABASE_URL required, TOKEN_ENCRYPTION_KEY enforced when the social module is used — all in one edge-safe place | `src/lib/env.ts` |

### Background jobs

QStash-signed endpoints under `src/app/api/jobs/*`: `audit-scan` (run scan → score), `pdf-generation` (report render), `cleanup` (delete expired refresh tokens, flip expired ACTIVE subscriptions to EXPIRED). A Vercel Cron hits `/api/jobs/cleanup` daily at 03:00 UTC (`vercel.json`); set `CRON_SECRET` so cron calls authenticate. Job types are typed in `src/lib/queue.ts`.

## Setup

### 1. Database

Create a PostgreSQL database (Supabase or Neon). Copy the pooled connection string plus the direct connection string.

### 2. Environment

```bash
cp .env.example .env
```

Fill in every variable — `.env.example` documents what breaks when each is missing. At minimum set `DATABASE_URL`, `DIRECT_URL`, and a random 32+ char `JWT_SECRET` (placeholder words like "change" are rejected at startup).

### 3. Push schema

```bash
npm install
npx prisma db push && npx prisma generate
```

### 4. Seed (optional)

Creates the admin account (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars, random password printed once if unset) and website design templates:

```bash
npx prisma db seed
```

> Restoring a pre-v3 database with existing rows? Normalize legacy lowercase status values to the v3 enums before `db push` — see CHANGELOG 3.0.0. Skip on fresh databases.

### 5. Commands

```bash
npm run dev          # http://localhost:3000
npx tsc --noEmit     # typecheck
npm run lint         # eslint
npm test             # vitest run
npm run build        # prisma generate && next build
```

### 5. Deploy

Push to GitHub, connect repo to Vercel, add every `.env.example` variable in the Vercel dashboard. The cleanup cron in `vercel.json` runs daily at 03:00 UTC in the default region (iad1).

## Modules

| Module | API Routes | Dashboard Page | Status |
|--------|-----------|----------------|--------|
| Auth | `/api/auth/*` | Login / Register | ✅ |
| Audit | `/api/audit/*` | Dashboard + `/audit/[id]` | ✅ |
| Social Commander | `/api/social/*` | `/dashboard/social` | ✅ |
| Catalog Builder | `/api/catalog/*` | `/dashboard/catalog` | ✅ |
| Review System | `/api/reviews/*` | `/dashboard/reviews` | ✅ |
| AI Chatbot | `/api/chat/*` | `/dashboard/chat` | ✅ |
| E-commerce | `/api/payments/*` | On catalog items | ✅ |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Login
│   ├── register/             # Register
│   ├── dashboard/            # Dashboard + sub-pages
│   │   ├── page.tsx          # Main dashboard
│   │   ├── social/           # Social Commander
│   │   ├── catalog/          # Catalog Builder
│   │   ├── reviews/          # Review System
│   │   └── chat/             # AI Chatbot
│   ├── audit/[id]/           # Audit report (protected)
│   └── api/                  # API routes (thin delegates)
│       └── jobs/             # QStash-signed background jobs
├── components/
│   ├── ui/                   # UI primitives (Button, Card, Modal, etc.)
│   ├── audit/                # Audit UI components
│   └── catalog/              # Catalog checkout
├── config/site.ts            # Tiers, pricing, labels
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── env.ts                # zod-validated server env (edge-safe, single source)
│   ├── errors.ts             # AppError hierarchy + handleApiError
│   ├── queue.ts              # QStash enqueue + job-type union
│   ├── rate-limit.ts         # Upstash-backed profiles with memory fallback
│   └── utils.ts              # cn() utility
├── modules/
│   ├── auth/                 # controller + service + session (hashed refresh tokens)
│   ├── audit/                # scanner, scorer, controller
│   ├── blog/                 # controller + service
│   ├── social/               # controller + service
│   ├── website/              # controller + service
│   ├── catalog/              # catalog controller
│   ├── reviews/              # reviews controller
│   ├── chat/                 # chat controller + OpenAI service
│   ├── payments/             # Fawry controller + tier-payment gate
│   └── email/                # Resend service
├── hooks/                    # TanStack Query hooks
└── middleware.ts             # Subdomain rewrite + jose token verification
```

## License

Private — Wujood Inc.
