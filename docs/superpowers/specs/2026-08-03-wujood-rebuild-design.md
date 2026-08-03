# Wujood Rebuild — Design Spec

**Date**: 2026-08-03
**Project**: Wujood (وجود)
**Scope**: Full stack rebuild — architecture, UI, and all 4 feature streams

---

## 1. Overview

Wujood is an all-in-one digital presence platform for Egyptian SMEs. The rebuild addresses three architectural debts (no reusable auth, no service layer, no background jobs) while upgrading the UI to shadcn/ui and completing all 4 feature streams.

**Stack**: Next.js 16 + Prisma 6 + PostgreSQL (Supabase) + Fawry + Tailwind CSS 4 + shadcn/ui + TanStack Query + Upstash QStash

---

## 2. Stack Decisions

| Layer | Tech | Rationale |
|-------|------|-----------|
| Framework | Next.js 16 | App router, already invested |
| ORM | Prisma 6 | Schema is clean (21 models), don't rewrite |
| Database | PostgreSQL (Supabase) | Reactivate paused project |
| Payments | Fawry | Stripe doesn't serve Egypt |
| Styling | Tailwind CSS 4 + shadcn/ui | Modern component library |
| Data fetching | TanStack Query | Replace manual useEffect |
| Background jobs | Upstash QStash | Serverless-native, no Redis ops |
| Rate limiting | Upstash Rate Limit | Same ecosystem as QStash |
| Auth | jose (existing) | JWT, already in deps |
| Email | Resend (existing) | Already in deps |
| WhatsApp | Twilio (existing) | Already in deps |

---

## 3. Phase 1: Architecture Foundation

### 3.1 Auth Middleware

**File**: `src/lib/auth.ts`

```typescript
export async function authenticateUser(): Promise<User | NextResponse> {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return user;
}
```

Every controller delegates to this. Eliminates 20+ duplicate extractions.

### 3.2 Service Layer

Extract Prisma calls into `*.service.ts` for:
- `src/modules/catalog/catalog.service.ts`
- `src/modules/reviews/reviews.service.ts`
- `src/modules/social/social.service.ts`
- `src/modules/payments/payments.service.ts`

Controllers become thin: parse request → call service → format response.

### 3.3 Error Handling

**File**: `src/lib/errors.ts`

Typed error classes:
- `ValidationError` (400)
- `AuthError` (401)
- `NotFoundError` (404)
- `ConflictError` (409)
- `ServerError` (500)

Response helper:
```typescript
export function apiError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}
```

### 3.4 SSRF Protection

**File**: `src/lib/url-validation.ts`

Block before `scanUrl()`:
- Private IPs (10.x, 172.16-31.x, 192.168.x)
- localhost, 127.0.0.1
- Internal hostnames (.local, .internal)

### 3.5 Payment Idempotency

Wrap Fawry callback in Prisma `$transaction`:
```typescript
await prisma.$transaction([
  prisma.payment.upsert({ where: { id: paymentId }, ... }),
  prisma.subscription.upsert({ where: { userId }, ... }),
]);
```

### 3.6 Rate Limiting

Upstash rate limiter on audit endpoint:
- Free tier: 5 scans/day
- Kashif: 20 scans/day
- Sane': 50 scans/day
- Ra'ed: unlimited

---

## 4. Phase 2: Background Jobs

### 4.1 Queue Setup

**Files**:
- `src/lib/queue.ts` — Upstash QStash client
- `src/lib/jobs.ts` — job type definitions + handlers

### 4.2 Audit Scanning (async)

1. API creates audit record → enqueues scan job → returns audit ID
2. Worker fetches URL, runs checks, updates audit record
3. Client polls `GET /api/audit/[id]/status` until complete
4. Retry: 3 attempts, exponential backoff

### 4.3 PDF Generation (async)

1. Triggered after audit completes
2. Generates PDF, stores in Supabase Storage
3. Updates audit record with download URL

---

## 5. Phase 3: UI Upgrade

### 5.1 shadcn/ui Migration

Replace 19 custom primitives:
| Custom | shadcn/ui Replacement |
|--------|----------------------|
| Button.tsx | Button |
| Input.tsx | Input |
| Select.tsx | Select |
| Badge.tsx | Badge |
| Card.tsx | Card |
| Modal.tsx | Dialog |
| Tabs.tsx | Tabs |
| Tooltip.tsx | Tooltip |
| Toast.tsx | Toast (sonner) |
| Skeleton.tsx | Skeleton |
| Spinner.tsx | custom (no shadcn equivalent) |

Keep custom: GeometricPattern, HeroIllustration, Logo, ScrollReveal, TiltCard, WhatsAppButton

### 5.2 TanStack Query

Install `@tanstack/react-query`. Create query hooks for:
- Audit data
- Catalog items
- Reviews
- Social accounts
- Subscription status

Replace all `useEffect` + `useState` fetch patterns.

### 5.3 Landing Page

- Use shadcn/ui components
- Maintain Arabic-first typography and RTL
- Keep teal/cream palette

---

## 6. Phase 4: Stream A — Payments & Subscriptions

### 6.1 Subscription Billing
- Link Fawry payments to Subscription model
- Auto-extend on payment completion
- Webhook handler for confirmation

### 6.2 Subscription UI
- `/dashboard/subscription/page.tsx` — tier, status, usage
- Change tier with proration
- Cancel with confirmation

### 6.3 API Routes
- `GET /api/subscriptions` — current subscription
- `POST /api/subscriptions/cancel` — cancel with reason
- `POST /api/subscriptions/change-tier` — upgrade/downgrade

---

## 7. Phase 5: Stream B — Micro-sites

### 7.1 Subdomain Routing
- Middleware: `*.wujood-app.vercel.app` → look up Website by slug
- Rewrite to `/website/[slug]`

### 7.2 Public Website
- `src/app/website/[slug]/page.tsx` — published content
- SEO metadata, Open Graph
- Mobile-responsive

### 7.3 Dashboard Editor
- `/dashboard/website/page.tsx` — configure, publish
- Live preview
- Page builder

---

## 8. Phase 6: Stream C — Admin & Onboarding

### 8.1 Admin Panel
- `/dashboard/admin/page.tsx` — users, payments, stats
- Guard with admin role check

### 8.2 Admin API
- `GET /api/admin/users` — paginated
- `GET /api/admin/payments` — history
- `GET /api/admin/stats` — aggregates

### 8.3 Onboarding Wizard
- `/dashboard/onboarding/page.tsx` — first-time flow
- Steps: company info → first audit → subscription
- Skip if completed

### 8.4 Email Notifications
- Resend wrapper
- Templates: welcome, audit-complete, payment-confirmed
- Arabic + English

---

## 9. Phase 7: Stream D — Blog & WhatsApp & Arabic

### 9.1 Blog
- Public: `/blog/page.tsx`, `/blog/[slug]/page.tsx`
- Dashboard: `/dashboard/blog/page.tsx` — CRUD
- API: `GET/POST /api/blog`, `PUT/DELETE /api/blog/[id]`

### 9.2 WhatsApp
- `POST /api/whatsapp/send` — via Twilio
- `/dashboard/whatsapp/page.tsx` — templates
- Template CRUD with variables

### 9.3 Arabic Polish
- RTL in all new pages
- Arabic translations for all new strings
- Direction-aware layouts

---

## 10. Phase 8: Production Readiness

### 10.1 Supabase
- Resume paused project
- Verify connection
- Run pending migrations

### 10.2 Vercel
- Fix environment variables
- Configure build settings
- Set up `wujood.app` domain

### 10.3 Testing
- Unit tests for services
- Integration tests for API routes
- E2E tests for critical flows

### 10.4 Monitoring
- Error tracking (Sentry)
- Performance monitoring
- Uptime checks

---

## 11. Migration Strategy

**Order**: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

Each phase is independently deployable. Roll back that phase only if something breaks.

**Rollback**: Git revert + redeploy. No irreversible data migrations.

---

## 12. Workflow

After each phase:
1. Finish phase
2. Wait 1 minute
3. Check emails (expect feedback from stack tools + CodeRabbit)
4. Address any issues
5. Proceed to next phase

---

## 13. What We're NOT Doing

- Rewriting the Prisma schema
- Switching frameworks
- Adding micro-frontends or monorepos
- Building a custom design system (shadcn/ui replaces it)
- Adding features not in the existing codebase
