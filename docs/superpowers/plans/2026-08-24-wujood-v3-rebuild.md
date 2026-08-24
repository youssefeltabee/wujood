# Wujood v3 Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close all security findings, fix correctness bugs, consolidate architecture, and reach a verified-green, launch-ready v3 on branch `v3/rebuild`.

**Architecture:** In-place re-architecture of the existing Next.js 16 App Router app. Pattern-A module layering (route → controller → service → Prisma) becomes universal; security fixes land before refactors; schema changes precede consumers.

**Tech Stack:** Next.js 16.2.9, React 19.2, Prisma 6.19 + remote Postgres (Supabase), Tailwind 4, zod v4, jose v6, Upstash QStash/Redis, vitest 4.

## Global Constraints

- Branch `v3/rebuild`. Never touch `feat/pre-launch-checklist-and-redesign`.
- Working dir: `C:\Users\youssef besheer\wujood-app`
- Verify loop after EVERY task: `npx tsc --noEmit` PASS, `npm run lint` (no NEW errors), `npm test` (no NEW failures), `npm run build` PASS.
- Spec of record: `docs/superpowers/specs/2026-08-24-wujood-v3-design.md`
- No new dependencies without orchestrator approval. Remove-only policy this run.
- All error responses go through `handleApiError` from `src/lib/errors.ts`; all request bodies through zod (`src/lib/validate.ts` helpers).
- Do NOT print secret values; `.env` is never committed.

---

### Task 1 (W0): Fix stale landing tests

**Files:**
- Modify: `src/components/landing/__tests__/*.test.tsx` (8 files, 16 failures)

**Steps:**
- [ ] Run `npm test -- src/components/landing` — capture each failure.
- [ ] For each failure: update the assertion to match CURRENT component markup (the components are correct; tests drifted). Verify each changed expectation by reading the component source first — never blind-update counts/classes.
- [ ] `npm test -- src/components/landing` → 0 failures.
- [ ] Commit: `test: realign landing section assertions with current markup`

### Task 2 (W0): Lint errors → zero

**Files:**
- Modify: `src/app/audit/[id]/page.tsx` (conditional hooks :64,:72,:78), `src/app/dashboard/admin/page.tsx` (:55 hooks; :12-14 `useState<any[]>` → typed via API response types), `src/app/dashboard/blog/page.tsx:42`, `src/app/dashboard/reviews/page.tsx:94` (set-state-in-effect), `src/app/dashboard/onboarding/page.tsx:132` (escaped entities)
- Policy: conditional hooks → early-return AFTER all hooks; set-state-in-effect → derive during render or move into event/query callbacks; `any` → type from the route's actual JSON shape.

**Steps:**
- [ ] Fix each site per policy above.
- [ ] `npm run lint` → 0 errors (warnings ≤ current count).
- [ ] `npx tsc --noEmit && npm test` green.
- [ ] Commit: `fix: resolve lint errors — hook order, typed admin state, escaped entities`

### Task 3 (W1): Rate limiter profiles (M-1)

**Files:**
- Modify: `src/lib/rate-limit.ts`
- Test: extend `src/lib/__tests__/rate-limit.test.ts`

**Interfaces:**
- Produces: unchanged call signature `rateLimit(key, {interval, maxRequests})` — but options are now HONORED when Upstash configured. Implementation: `Map<string,Ratelimit>` cache keyed `${maxRequests}:${intervalMs}`, built via `Ratelimit.slidingWindow(maxRequests, "${intervalMs} ms")`.
- [ ] Write failing test asserting distinct profiles produce distinct limiters (expose internal cache for test or inject fake Redis).
- [ ] Implement; run lib tests; commit: `fix(rate-limit): honor per-call interval/max under Upstash`

### Task 4 (W1): Auth/session hardening (H-3, M-2, M-7, M-4, L-2, L-6 wiring)

**Files:**
- Modify: `src/modules/auth/auth.session.ts` (store `sha256(token)`; hash-on-lookup in rotate/revoke; reuse-detection: presented token matches a REVOKED row → `revokeAllUserSessions(userId)`), `src/modules/auth/auth.service.ts` (jose HS256 sign/verify replacing jsonwebtoken; startup guard: JWT_SECRET length ≥32 and not matching /change|secret-key|placeholder/i else throw), `src/modules/auth/auth.controller.ts` (zod schemas for login/register/updateMe via existing validateBody util; register IP rate-limit 5/60s + per-email 3/hour; replace ALL bare catch{} with handleApiError), `src/middleware.ts` (jose `jwtVerify` on token cookie; invalid → redirect `/login` for protected routes), delete `jsonwebtoken` usage
- Test: `src/modules/auth/__tests__/auth.session.test.ts` (new): rotation hashing, reuse detection revokes family.

**Steps:**
- [ ] Failing tests first (hash-at-rest, reuse-revocation).
- [ ] Implement session changes → tests pass.
- [ ] Swap to jose (sign: `new SignJWT({...}).setProtectedHeader({alg:"HS256"}).setExpirationTime(...)`; verify: `jwtVerify(token, secret)`).
- [ ] Middleware verify + controller zod + rate limits.
- [ ] `npm uninstall jsonwebtoken @types/jsonwebtoken`
- [ ] Full loop green. Commit: `feat(security): hashed refresh tokens w/ reuse detection, jose everywhere, env+register hardening`

### Task 5 (W1): Money & network closure (C-1, H-1, H-2, M-5, M-3-partial)

**Files:**
- Modify: `src/app/api/subscriptions/route.ts` (change-tier: require Payment{status:"completed", metadata.tier===target} owned by user within last 35 days, else 402 `{error:"payment_required"}`), `src/modules/payments/payments.controller.ts` (callback: assert `amount === payment.amount` before completePayment), `src/modules/payments/payments.service.ts` (completePayment: if metadata.catalogItemId → mark payment complete ONLY, no subscription create/extend), `src/modules/audit/audit.scanner.ts` (SSRF: single resolution via undici `Agent` with custom `lookup` pinning first-resolved IP; reject private ranges inside connect callback; cap response body 5MB), `src/app/api/whatsapp/send/route.ts` (rateLimit wa:${userId} 50/3600000ms; E.164 regex `^\+[1-9]\d{7,14}$`; mock mode only when `process.env.WA_MOCK==="true"`), `src/modules/chat/chat.controller.ts` (rateLimit chat:${userId} 10/60000ms; message ≤2000 chars; truncate stored history to last 20 turns before OpenAI call)
- Test: extend `src/lib/__tests__/url-validation.test.ts` with rebinding-vector cases (mocked dns); add `src/modules/payments/__tests__/payments.gate.test.ts` for tier-gate logic (pure fn extracted: `assertTierPayment(payment, tier)`).

**Steps:**
- [ ] Extract pure gate fn → TDD it → wire into route.
- [ ] Scanner: implement pinned-IP fetch (undici Agent, `lookup` returning fixed IP, connect-time range check); unit-test range rejection logic as pure fn.
- [ ] WA/chat/payment-controller edits.
- [ ] Full loop green. Commit: `feat(security): paid-tier gate, SSRF IP pinning, WA/chat abuse controls, amount assertion`

### Task 6 (W2): Schema correctness (enums, indexes, template ownership, status bug, deletedAt, domain)

**Files:**
- Modify: `prisma/schema.prisma`: enums `Role{CUSTOMER ADMIN}`(map values "customer"/"admin"), `Tier`, `SubscriptionStatus`, `PaymentStatus`, `PaymentProvider`, `AuditStatus{PENDING RUNNING COMPLETED FAILED}`, `SocialPostStatus`; `Audit.status AuditStatus` default PENDING; `@@index([domain, deletedAt])` Website + `@unique domain`; index `Audit.status`, `Conversation.waId`; `WhatsAppTemplate.userId User` required relation
- Modify consumers: `audit.controller.ts` (create→PENDING; status compare enum values), `jobs/audit-scan/route.ts` (COMPLETED/FAILED), `hooks/use-audit.ts` (uppercase), `api/whatsapp/templates/route.ts` (scope all queries by userId from auth; backfill script line in seed for orphan rows → first admin), `auth.controller.ts` login/me (`where: {email, deletedAt:null}`), `api/website/route.ts` (slugify both POST/PUT, catch P2002 → 409)
- Fix: `AuditForm.tsx:30` read `data.id` not `data.audit.id` (response shape `{success,data:{id}}`)
- Data migration: since db-push flow, run `npx prisma db push` then one-off SQL via prisma/seed or script: normalize existing Audit.status lowercase→UPPERCASE before push.

**Steps:**
- [ ] Normalize existing rows (script) → schema edit → `npx prisma db push` → `npx prisma generate`.
- [ ] Update all writers/readers listed above.
- [ ] Manual smoke: `npm run build` includes route compile; run audit-related vitest files.
- [ ] Full loop green. Commit: `feat(schema): enums, ownership, indexes; fix audit status lifecycle end-to-end`

### Task 7 (W3): Module extraction — website, blog, whatsapp templates, admin guard

**Files:**
- Create: `src/modules/website/{website.service,website.controller}.ts`, `src/modules/blog/{blog.service,blog.controller}.ts`, `src/modules/admin/admin.guard.ts` (`requireAdmin(): Promise<User>` using authenticateUser + role!==ADMIN → ForbiddenError)
- Rewrite thin: `api/website/route.ts`, `api/website/pages/route.ts` (+add PUT/DELETE for pages while extracting — same service), `api/blog/route.ts`, `api/blog/[id]/route.ts` (drop own cookie parsing), `api/whatsapp/templates/route.ts`, `api/admin/users|payments|stats/route.ts` (all three → requireAdmin + handleApiError), `api/debug/db/route.ts` (return 404 when NODE_ENV==="production")
- Delete: dead code — `src/types/*` (move needed api types into `utils/api.ts`), unused exports flagged in audit (logger.ts ADOPTED instead: handleApiError logs via logger; job routes log via logger), `magic-string`, `resend`, `next-themes` deps; `shadcn` → devDependencies

**Interfaces:**
- Consumes: Task 4's zod/auth patterns, Task 6 template userId scoping.
- Produces: services own Prisma+domain errors; controllers parse/validate/respond. Route files ≤10 lines each.
- [ ] Extract service+controller per module, rewrite route files as delegates (copy pattern from `api/catalog/route.ts`).
- [ ] Add website-pages PUT/DELETE endpoints + minimal vitest for service slug logic.
- [ ] Dep cleanup + `npm install`.
- [ ] Full loop green. Commit: `refactor: extract website/blog modules, unify admin guard, adopt logger, prune dead code`

### Task 8 (W3): React Query completion on dashboard

**Files:**
- Modify dashboard pages: audits (`dashboard/page.tsx`), catalog, reviews, social, chat (read paths) — consume existing hooks `use-audit/use-catalog/use-reviews/use-social`; delete their local fetch+useEffect+loading-state blocks; keep optimistic chat send local (fine as-is) but list reads via hook if present.
- Admin page already typed in Task 2 — convert its 5 fetches to useQuery with enabled flag on admin role.

**Steps:**
- [ ] One page at a time; after each, `npx tsc --noEmit` + click-path vitest still green.
- [ ] Full loop. Commit: `refactor(frontend): dashboard pages on TanStack Query hooks`

### Task 9 (W4): Launch polish

**Files:** `.env.example` (add QSTASH_TOKEN, QSTASH_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY, UPSTASH_REDIS_REST_URL/TOKEN, WA_MOCK with comments), `vercel.json` (crons: nightly refresh-token cleanup hitting `api/jobs/cleanup` — create tiny job route deleting expired RefreshTokens + expired subscriptions status flip; region note comment), `README.md` (v3 architecture section), `CHANGELOG.md` (3.0.0 entry listing security closures)
- Startup env validation: `src/lib/env.ts` zod schema imported by middleware-independent server entries (auth.service already guards JWT_SECRET; extend there minimally).

**Steps:**
- [ ] Env example + validation + cleanup job + cron config.
- [ ] Docs updated truthfully (no feature claims beyond what ships).
- [ ] Commit: `chore(release): v3.0.0 — launch polish, docs, cleanup cron`

### Task 10: Final gate

- [ ] `npm run lint && npx tsc --noEmit && npm test && npm run build` — all green, output captured verbatim.
- [ ] Production-readiness checklist pass; document exceptions in final report.
- [ ] Session summary → hippocampus; report for Boss.

---

## Self-review notes

- Spec coverage: C-1(T5) H-1(T5) H-2(T5) H-3(T4) M-1(T3) M-2(T4) M-3(T5) M-4(T4) M-5(T5) M-6(T6) M-7(T4) L-items(T4,T7) W2-correctness(T6) W3(T7,T8) W4(T9). Partner dormant = spec non-goal ✓.
- Type consistency: `assertTierPayment(payment,tier)` defined T5, consumed only in T5 route ✓. Enum names single source in schema ✓.
- No placeholders: all steps name exact files/actions/commands ✓.
