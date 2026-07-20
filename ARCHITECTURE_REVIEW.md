# Wujood Architecture Review

**Date**: 2026-07-20  
**Reviewer**: JARVIS  
**Scope**: Full-stack Next.js 16 application — modules, components, data flow, state, error handling, scalability

---

## Executive Summary

Wujood is a well-structured SaaS with strong domain separation and clean UI primitives. The architecture has three critical problems and several moderate issues:

### Top 5 Architectural Concerns

1. **CRITICAL: No reusable auth middleware — 20+ controllers duplicate token extraction inline.** Every controller manually reads cookies, parses the JWT, and handles the `null` case. This is the single largest source of maintenance debt and a perfect place for a cross-cutting concern to be centralized.

2. **CRITICAL: No service layer in 6 of 8 modules.** Controllers in `catalog`, `reviews`, `social`, `chat`, `payments`, and `email` directly call Prisma, mix HTTP concerns with business logic, and have no separation between request handling and domain operations. Only `auth` has a proper controller → service → data layer split.

3. **HIGH: Generic error handling across all controllers — every catch block returns `{ error: "Failed to X" }` with no context.** Stack traces are swallowed, client gets no useful information, and debugging production issues requires reproduction. No structured error logging, no error codes, no error type discrimination.

4. **HIGH: Audit scanner runs synchronously in the request lifecycle with no job queue.** A single `fetch()` with a 10-second timeout runs in the API handler. At 100 concurrent requests, the server will exhaust connection pools and time out under load. No background processing, no progress tracking, no retry logic for scan failures.

5. **HIGH: Inconsistency in module boundaries — blog and subscription APIs bypass the module pattern entirely.** Blog CRUD (`src/app/api/blog/route.ts`) and subscription management (`src/app/api/subscriptions/route.ts`) contain all logic inline in route handlers rather than delegating to modules. The debug/db route exposes connection diagnostics in production.

---

## Detailed Findings

### 1. Project Structure

| File | Line | Issue | Severity | Recommendation |
|------|------|-------|----------|----------------|
| `src/app/api/blog/route.ts` | 1-47 | Blog logic inline in route handler (not delegating to a module) | HIGH | Create `src/modules/blog/blog.controller.ts` and move logic there, consistent with every other module |
| `src/app/api/subscriptions/route.ts` | 1-76 | Subscription logic inline, no module | HIGH | Create `src/modules/subscriptions/subscriptions.controller.ts` — this module has tier validation, cancel, and change-tier logic that belongs in a service |
| `src/app/api/debug/db/route.ts` | 1-77 | Debug endpoint exposes DB host, port, connection check results | MEDIUM | Guard with admin check or remove in production; DNS resolution + TCP connect results leak infrastructure info |
| `src/app/not-found.tsx` | 6-19 | References old class names (`bg-w-cream`, `text-w-charcoal`, `bg-w-teal`) that don't match the project's Tailwind theme | LOW | Update to use current CSS variable classes (`bg-bg-primary`, `text-text-primary`, etc.) |

**Positive**: The `src/modules/` directory with per-domain subdirectories is a solid pattern. API routes are thin delegates (2-10 lines) when they follow the pattern.

### 2. Module Architecture — Duplicate Auth Extraction

Every controller repeats the same 3 lines:

```typescript
const token = (await cookies()).get("token")?.value;
const user = token ? verifyAccessToken(token) : null;
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `audit.controller.ts` | 15-17, 44-46, 69-71 | Repeated 3 times | HIGH |
| `catalog.controller.ts` | 8-10, 27-29, 45-47, 73-75 | Repeated 4 times | HIGH |
| `chat.controller.ts` | 9-11, 26-28, 45-47, 91-93 | Repeated 4 times | HIGH |
| `reviews.controller.ts` | 8-10, 24-26, 44-46, 70-72 | Repeated 4 times | HIGH |
| `social.controller.ts` | 8-10, 25-27, 52-54, 70-72, 97-99, 126-128, 145-147 | Repeated 7 times | HIGH |
| `payments.controller.ts` | 26-28 | Once | MEDIUM |
| `blog/route.ts` | 8-10, 25-27 | Repeated 2 times inline | HIGH |
| `subscriptions/route.ts` | 6-11, 14-15 | Helper function exists but used inconsistently | MEDIUM |
| `admin/stats/route.ts` | 7-12 | Inline again | MEDIUM |

**Recommendation**: Create a single `authenticateUser()` helper in `src/lib/auth.ts` that returns the user or throws/returns a 401 response. Also consider using Next.js middleware for route-level auth, but the middleware already handles dashboard routes — API routes need their own solution.

### 3. Module Architecture — Missing Service Layer

| Module | Has Service Layer? | Controllers Do |
|--------|-------------------|----------------|
| `auth` | YES (`auth.service.ts`, `auth.session.ts`) | Delegates to services |
| `audit` | PARTIAL (scanner + scorer are service-like) | Scanner/scorer are pure functions |
| `catalog` | NO | Directly calls Prisma |
| `chat` | PARTIAL (has `chat.service.ts` for AI) | Rest calls Prisma directly |
| `email` | YES (service only, no controller) | N/A |
| `payments` | NO | Fawry signature logic + Prisma inline |
| `reviews` | NO | Directly calls Prisma |
| `social` | NO | Directly calls Prisma |

**Recommendation**: Extract Prisma queries into service files (`*.service.ts`) for catalog, reviews, social, and payments. Controllers should only parse request input, call a service, and format the response.

### 4. Error Handling

| File | Line | Issue | Severity |
|------|------|-------|----------|
| Every controller | All `catch` blocks | Generic empty `catch` with no error differentiation | HIGH |
| Every controller | All `catch` blocks | `{ error: "Failed to X" }` — no error code, no details, no logging | HIGH |
| `chat.service.ts` | 34-36 | OpenAI API failure silently falls back to mock responses — user gets fake AI | MEDIUM |
| `email.service.ts` | 17 | Error is `console.error`'d but return value `false` is ignored by callers | MEDIUM |
| `auth.controller.ts` | 67 | `sendWelcomeEmail().catch(() => {})` — fire-and-forget with silent failure | MEDIUM |

**Recommendation**: 
- Create a typed error response helper: `apiError(status, code, message)`
- Log errors with structured logging (pino/winston or at minimum `console.error` with correlation ID)
- Differentiate between validation errors (400), not-found (404), conflict (409), and server errors (500)
- Rate-limit the silent catch at chat.service.ts — falling back to mock replies when OpenAI is down is misleading

### 5. Data Flow — N+1 and Transaction Risks

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `chat.controller.ts` | 13-17 | `findMany` with `include` inside a loop of conversations — if expanded, N+1 risk | LOW (currently one query) |
| `social.controller.ts` | 84-88 | `findMany` with `include: { account: ..., analytics: true }` — but `analytics` is optional, could cause extra joins | LOW |
| `payments.controller.ts` | 116-138 | Payment callback creates/updates subscriptions without a Prisma transaction | HIGH |
| `payments.controller.ts` | 141-143 | Payment update happens after subscription create — if it fails, subscription is orphaned | HIGH |
| `audit.controller.ts` | 22-34 | Audit create and scan run sequentially — scan is the bottleneck | MEDIUM |

**Recommendation**:
- Wrap payment callback logic in a Prisma `$transaction` to ensure atomicity
- The subscription creation in the Fawry callback should be idempotent (if callback is retried, don't double-create)

### 6. State Management

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `src/hooks/useScrollReveal.ts` | 1-26 | Clean, well-implemented IntersectionObserver hook | ✅ POSITIVE |
| `src/lib/i18n.ts` | 1-31 | Client-side i18n with a flat dictionary — works for MVP but doesn't scale | LOW |
| `src/app/dashboard/page.tsx` | 54-69 | Simple `useState` + `useEffect` for data fetching — no caching, no SWR/React Query | LOW |
| `src/app/audit/[id]/page.tsx` | 23-48 | Same pattern — manual fetch with loading state | LOW |

**Recommendation**: For a SaaS with multiple data-fetching pages, introduce a lightweight data-fetching library (SWR or TanStack Query) to eliminate manual `useEffect` + `useState` patterns and get caching/refetching for free.

### 7. Code Quality Patterns

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `subscriptions/route.ts` | 48 | Valid tier list contains `"mutamayiz"` but site config only defines `"kashif"`, `"sane"`, `"raed"` | HIGH |
| `subscriptions/route.ts` | 67 | Fallback price `999` doesn't match any tier in site config | HIGH |
| `dashboard/layout.tsx` | 11-14 | Admin check fires a fetch to `/api/auth/me` on every dashboard page load | MEDIUM |
| `audit.scanner.ts` | 137-138 | `AbortSignal.timeout(10000)` — 10-second timeout for an external fetch that holds the entire request | MEDIUM |
| `audit.scanner.ts` | 17-18 | In-memory cache with 30s TTL — per-instance, lost on restart | MEDIUM |
| `audit.scanner.ts` | 18 | Per-domain rate limit of 10s is enforced in-memory only | MEDIUM |
| `payments.controller.ts` | 97-150 | Fawry callback is a `POST` that creates records — should be idempotent | HIGH |
| `audit.controller.ts` | 100-126 | PDF generation uses dynamic `import()` at request time — first request pays cold-start penalty | MEDIUM |

### 8. Scalability Concerns

| Issue | Current Behavior | Impact at 100 Concurrent Requests |
|-------|-----------------|-----------------------------------|
| Audit scan blocks request | `fetch()` with 10s timeout synchronous | 100 concurrent requests = 100 concurrent outbound fetches. Server may exhaust HTTP connection pool |
| Prisma connection pool | Default pool size (~10 connections) | Requests will queue waiting for DB connections. Audit scans hold connections for up to 10s |
| In-memory cache | Per-instance, 30s TTL | Multiple instances (Vercel/serverless) have inconsistent cache state |
| PDF generation | Synchronous, uses `@react-pdf/renderer` | CPU-intensive, blocks the event loop |
| No rate limiting | Audit endpoint unprotected | Single user can trigger 100 scans simultaneously, exhausting the outbound fetch pool |
| Background jobs | None — everything is synchronous | Async email sends, PDF gen, and audit scans all block the response |

**Recommendation**:
- Move audit scanning to a background job (Vercel waiting room, Bull with Redis, or at minimum async with polling)
- Configure Prisma connection pool limits explicitly
- Add rate limiting middleware for the audit endpoint (e.g., upstash-rate-limiter or Vercel KV)
- Move PDF generation to a background task with a "download ready" notification
- Replace in-memory cache with Redis (Upstash or Vercel KV) for multi-instance consistency

### 9. Security Observations

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `auth.service.ts` | 10 | Fallback to `"wujood-dev-secret"` in non-production — acceptable pattern | INFO |
| `audit.scanner.ts` | 137 | No URL validation before fetch — server could be used to scan internal networks (SSRF) | HIGH |
| `payments.controller.ts` | 79-83 | Fawry charge request sends customer data without PII audit | MEDIUM |
| `chat.service.ts` | 1 | `OPENAI_API_KEY` loaded from env — ensure it's server-only | INFO |
| No input sanitization evidence on user-submitted content stored in DB | Catalog, reviews, blog | No visible sanitization | MEDIUM |

**Recommendation**: Add SSRF protection to `scanUrl()` — reject private IP ranges, localhost, and internal hostnames before fetching.

### 10. Testing Coverage

| Area | Status | Severity |
|------|--------|----------|
| UI component tests exist | ✅ (under `__tests__/` in ui/ and landing/) | POSITIVE |
| Module/controller tests | ❌ No tests found for any controller | HIGH |
| Integration tests | ❌ None visible | HIGH |
| E2E tests | ❌ Not found | HIGH |

---

## Positive Patterns Worth Preserving

| Pattern | Location | Why It's Good |
|---------|----------|---------------|
| Thin API route files | `src/app/api/*/route.ts` | Routes are 2-10 line delegates — perfect separation of concerns |
| Domain-module isolation | `src/modules/*/` | Each feature is in its own directory with clear boundaries |
| UI primitive pattern | `src/components/ui/` | Consistent, well-typed, composable design system components |
| Reusable config | `src/config/site.ts` | Single source of truth for tiers, audit categories, ghost levels |
| `MemoryCache` abstraction | `src/lib/cache.ts` | Clean interface, TTL, auto-pruning — easy to swap for Redis later |
| Auth has service layer | `src/modules/auth/` | The only module with proper controller → service → session separation — model for others |
| `cn()` utility | `src/lib/utils.ts` | Simple, focused, no unnecessary abstraction |
| Seed script | `prisma/seed.ts` | Exists for development data |
| Vitest configured | `vitest.config.ts` | Testing framework ready to use |
| TypeScript strict mode | `tsconfig.json` → `strict: true` | Full type safety enabled |
| Dynamic imports for heavy deps | `HeroSection.tsx` → ThreeScene | Conditional SSR for Three.js — good pattern |

---

## Quick Wins (High Impact, Low Effort)

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 1 | Create `src/lib/auth.ts` with `authenticateUser()` — removes 30+ lines of duplicated token extraction across all controllers | 30 min | Removes the #1 source of duplication |
| 2 | Add URL validation + SSRF block in `scanUrl()` — reject private IPs, `localhost`, `10.x`, `192.168.x` | 15 min | Prevents SSRF vulnerability |
| 3 | Fix `not-found.tsx` to use current Tailwind theme classes | 5 min | Visual consistency |
| 4 | Add Prisma `$transaction` wrapper to payment callback | 30 min | Prevents orphaned subscription records |
| 5 | Remove or guard `debug/db` route behind admin check | 10 min | Stops leaking infrastructure info |
| 6 | Create `blog.controller.ts` and `subscriptions.controller.ts` to follow the module pattern | 1 hour | Codebase consistency |
| 7 | Fix `"mutamayiz"` → `"sane"` in subscriptions route to match site config | 5 min | Bug fix — correct tier name |
| 8 | Add structured `console.error` with context to every catch block | 1 hour | Vastly improved debuggability |

---

## Medium-Term Recommendations

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Extract service layers for catalog, reviews, social, chat, payments | HIGH |
| 2 | Add SWR/TanStack Query for client-side data fetching | MEDIUM |
| 3 | Replace `MemoryCache` with Redis (Upstash/Vercel KV) | MEDIUM |
| 4 | Move audit scanning + PDF generation to background jobs | HIGH |
| 5 | Implement rate limiting on the audit endpoint | MEDIUM |
| 6 | Add idempotency key to payment callback handling | HIGH |
| 7 | Create a global error boundary + standardized API error format | MEDIUM |
| 8 | Add controller/module tests with Vitest | MEDIUM |

---

## Metrics Summary

| Metric | Count |
|--------|-------|
| Total controllers | ~25 exported functions |
| Controllers with direct Prisma calls | ~20 |
| Controllers with service delegation | ~2 (auth) + partial (audit scanner/scorer) |
| Duplicate auth extraction points | ~20+ |
| Files with inline API logic (bypassing module pattern) | 2 (blog, subscriptions) |
| In-memory-only caches | 1 (audit scanner) |
| Background job queues | 0 |
| Transaction-wrapped operations | 0 |
| Rate-limited endpoints | 0 |
| API routes following the thin-delegate pattern | ~25 |
| API routes with logic inline | 2 |
