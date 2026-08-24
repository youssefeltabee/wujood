# Changelog

## v3.0.0 — Security Closure & Launch Polish (2026-08-24)

### Security

- **Paid-tier gate**: subscription tier changes now require a completed Fawry payment for the target tier within the last 35 days; otherwise `402 payment_required`.
- **SSRF hardening**: audit scanner resolves each URL once and pins the connection to the first-resolved IP via undici, rejecting private ranges at connect time; response bodies capped.
- **Refresh tokens hashed**: only SHA-256 hashes are stored; rotation re-hashes on lookup; presenting a revoked token (reuse attack) revokes every session in the family.
- **JWT stack unified on jose** (`jsonwebtoken` removed): HS256 sign/verify everywhere, including Edge middleware route protection.
- **Rate-limit profiles honored** under Upstash Redis: per-call interval/max build distinct sliding-window limiters (in-memory fallback without Upstash).
- **WhatsApp abuse controls**: 50 msgs/user/hour, E.164 recipient validation, live Twilio sends only when configured.
- **Chat abuse controls**: 10 msgs/user/min, messages capped at 2000 chars, stored history truncated before OpenAI calls.
- **Startup env validation**: `src/lib/env.ts` — single edge-safe zod source validating JWT_SECRET (≥32 chars, placeholder words rejected), DATABASE_URL presence, TOKEN_ENCRYPTION_KEY when the social module is used.

### Schema

- Prisma enums formalized (`Role`, `Tier`, `SubscriptionStatus`, `PaymentStatus`, `PaymentProvider`, `AuditStatus`, `SocialPostStatus`); `Audit.status` migrated to the `AuditStatus` enum with a PENDING→COMPLETED/FAILED lifecycle enforced end-to-end.
- Ownership + integrity: WhatsApp templates scoped to their owner user, website domain uniqueness, soft-delete-aware indexes (`[domain, deletedAt]`), conversation/audit status indexes.
- db-push workflow: run `npx prisma db push`, then apply `prisma/normalize-status.sql` once when restoring a pre-v3 database.

### Ops

- Nightly cleanup cron (`vercel.json`, 03:00 UTC daily) hitting `/api/jobs/cleanup`: deletes expired refresh tokens and flips expired ACTIVE subscriptions to EXPIRED. Authenticated by QStash signature or `CRON_SECRET` bearer token.
- `.env.example` completed: every variable the code reads is listed with its failure mode documented.

### Breaking changes

- `POST /api/subscriptions` change-tier requires a completed payment — returns `402 { error: "payment_required" }` otherwise.
- WhatsApp mock mode is opt-in: outbound sends hit live Twilio unless `WA_MOCK=true`.
- `jsonwebtoken` dependency removed — all JWT operations use `jose`; tokens signed before this release must be reissued.
- Weak/placeholder `JWT_SECRET` values (<32 chars or containing "change"/"placeholder"/"your-secret"/"secret-key") abort startup.

## v2.0.0 — Production-Grade UI System + Clean Architecture

### UI Component System (12 Primitives)

New `src/components/ui/` system — zero dependencies beyond React + Tailwind:

| Component | File | Features |
|-----------|------|----------|
| `cn()` | `src/lib/utils.ts` | Class name utility |
| `Button` | `Button.tsx` | 4 variants, 3 sizes, loading state, icon slots, full-width |
| `Input` | `Input.tsx` | Label, error/helper text, left icon, required indicator |
| `Card` | `Card.tsx` | 4 variants, 4 padding sizes, Header/Body/Footer sub-components |
| `Badge` | `Badge.tsx` | 6 color variants, 2 sizes |
| `Spinner` | `Spinner.tsx` | 3 sizes, gold accent |
| `Skeleton` | `Skeleton.tsx` | 3 variants (text/circle/card), shimmer animation |
| `Modal` | `Modal.tsx` | Native `<dialog>` element, 5 sizes, backdrop blur, escape close |
| `Select` | `Select.tsx` | Custom styled native select, label, error, placeholder |
| `Toast` | `Toast.tsx` | Provider + hook pattern, 4 variants, auto-dismiss, stack |
| `Tabs` | `Tabs.tsx` | 2 variants (underline/pill), controlled, badge support |
| `Tooltip` | `Tooltip.tsx` | 4 positions, configurable delay, CSS-only |

### Migrated Pages

- **Login/Register** → Use `Card`, `Input`, `Button`
- **Dashboard** → Use `Card`, `Skeleton`, `Badge`
- **Audit Report** → Use `Button`, `Card`, `Spinner`, `Badge`
- **AuditForm** → Use `Input`, `Button`
- **ScoreCard** → Use `Card`, `Badge`
- **CategoryBreakdown** → Use `Card`, `Badge`

### Architecture

- Controller pattern: route handlers → controllers → services
- `src/modules/auth/` — auth.service (pure JWT/bcrypt), auth.session (Prisma), auth.controller
- `src/modules/audit/` — scanner, scorer, report, controller
- `src/lib/cache.ts` — generic `MemoryCache<T>` with TTL + auto-prune
- Middleware stripped to routing-only (cookie check, no JWT verify)
- All route handlers are ≤3 line stubs

### Performance

- Prisma `select` projections on all GET routes (payload -70%)
- `useMemo` on audit page data transforms
- `Cache-Control` headers on GET endpoints
- Scanner cache periodic cleanup (5 min interval)
- Hoisted `Intl.DateTimeFormat` instance

### Debugged

- Tab refresh race condition
- Contact regex false positives (Egyptian phone format)
- Silent 500 → empty state fallback
- PDF module dynamic import crash
- Input validation (min 6-char password, email regex)

## v2.1.0 — Engineering Backlog Complete (2026-07-11)

### New Modules

#### Social Commander
- SocialAccount CRUD (connect FB/IG/LinkedIn, manage accounts)
- SocialPost CRUD (create, schedule, publish posts)
- Post analytics (likes, shares, comments, clicks, reach)
- API: `/api/social/*`, UI: `/dashboard/social`

#### Online Catalog Builder
- CatalogItem CRUD with categories and pricing
- Soft-delete, category filtering
- Fawry checkout on each item (Buy Now)
- API: `/api/catalog/*`, UI: `/dashboard/catalog`

#### Review & Trust Builder
- Review CRUD with star ratings
- Approve/reject moderation workflow
- Public approved reviews endpoint for embedding
- API: `/api/reviews/*`, UI: `/dashboard/reviews`

#### AI Chatbot
- OpenAI gpt-4o-mini via fetch() (Arabic/English)
- Graceful mock fallback when no API key
- Conversation history with contact integration
- API: `/api/chat/*`, UI: `/dashboard/chat`

#### E-commerce Lite
- Fawry checkout for catalog items
- Payment model + callback handling
- API: `/api/payments/fawry/*`

### Architecture
- 5 new modules: `social/`, `catalog/`, `reviews/`, `chat/`, `payments/`
- Payment model added to Prisma schema
- DashboardClientWrapper for ToastProvider across dashboard pages
- All modules follow controller → route pattern

### Pricing Notes
- All external API calls (OpenAI, Fawry) gracefully degrade to mock/local mode when keys aren't set
- Zero-cost to run until API keys are activated
