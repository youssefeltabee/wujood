# Wujood v3 — Re-architecture Design Spec

**Date**: 2026-08-24 · **Status**: APPROVED (delegated — Boss authorized full autonomous execution before sleep)
**Branch**: `v3/rebuild` (cut from `feat/pre-launch-checklist-and-redesign` @ 87c4719)

## Goal

In-place re-architecture of wujood-app: launch-ready product AND tech-debt paydown. Keep repo, Prisma/Postgres data, and what works; rebuild weak modules; close all security findings.

## Non-goals (explicitly out)

- New features: Partner/affiliate program stays schema-only (dormant), no real social-platform adapters (needs API keys), no UI redesign beyond fixes.
- Activating live keys (Stripe/Fawry/Twilio/OpenAI) — Saif's side.
- Migration from `db push` to `prisma migrate` baseline — flagged for when real data exists.

## Audit evidence (inputs to this design)

Three parallel audits completed 2026-08-24:

1. **Ground truth**: build PASS, tsc PASS, lint 27 errors/28 warnings, tests 411/427 (16 stale landing assertions).
2. **Security**: C-1 free tier upgrade (`api/subscriptions/route.ts:45-75`); H-1 SSRF DNS rebinding (`audit.scanner.ts:312-333`); H-2 WhatsApp toll fraud (no rate limit/ownership, `whatsapp/send/route.ts`); H-3 plaintext refresh tokens (`auth.session.ts`); M-1 rate-limit options ignored under Upstash; M-2 middleware checks cookie presence not validity + dual JWT libs; M-3 unbounded chat spend; M-4 register rate limit missing; M-5 Fawry amount not asserted + catalog purchase grants subscription; M-6 Website.domain race/format; M-7 JWT_SECRET accepts placeholder; L-1..L-6 minor.
3. **Architecture**: Pattern-A modules (clean service→controller) vs Pattern-B inline routes (website, blog, subscriptions, whatsapp, admin) with bare `catch{}` → 500s; audit status-case bug ("PENDING" vs "pending") makes status polling permanently report incomplete; WhatsAppTemplate has no owner (cross-tenant deletes); React Query hooks written but unused in 11 dashboard pages (33 raw-fetch sites); dead code census (types/, logger.ts, jobs.ts, utils barrel, jose, magic-string, resend SDK, shadcn in prod deps); schema gaps (missing enums, unindexed domain/status/waId, base64 PDFs in Postgres, JSON-blob transcripts).

## Chosen approach

Phased in-place hardening on one branch, wave-based parallel agent execution with file-disjoint work assignments, verification gate after every wave. Big-bang rewrite rejected: destroys working tenant isolation and audit engine for zero user-visible gain. Pure frontend rebuild rejected: leaves C-1/H-1/H-2 revenue-and-spend holes open.

## Workstreams

### W0 — Hygiene (mechanical)
- Fix 16 stale landing tests (assertions follow current markup).
- Fix 27 lint errors: conditional hooks (`audit/[id]/page.tsx`, `admin/page.tsx`), `any` typing, set-state-in-effect, unescaped entities; warnings where trivial.
- Remove unused deps: `magic-string`, `resend`, `next-themes`; move `shadcn` to devDeps. Keep `jose` (becomes the JWT lib). Keep three.js stack (brand feature, lazy-loaded).

### W1 — Security closure
- **C-1**: `change-tier` requires verified completed Payment for target tier; else 402.
- **H-1**: resolve once via undici Agent with pinned IP + connect-callback revalidation; block private ranges at connection time.
- **H-2**: WA send — rate limit 50/hr/user, E.164 validation, recipient must be caller's contact/template-bound; remove silent mock success (explicit `WA_MOCK=true` env only).
- **H-3**: store sha256(refreshToken); hash-on-lookup; reuse detection → revokeAllUserSessions.
- **M-1**: rate-limit.ts builds cached per-profile Upstash instances honoring {interval,maxRequests}.
- **M-2**: middleware verifies JWT via jose (Edge-safe); delete `jsonwebtoken`; standardize auth.service on jose.
- **M-3/M-4**: chat 10/min + 2k-char cap + history truncation (20 turns); register IP+email throttling.
- **M-5**: assert callback amount ≈ payment.amount; completePayment honors metadata.catalogItemId (no subscription side-effect for catalog buys).
- **M-6**: `@unique` Website.domain + P2002 handling; slugify on create AND update.
- **M-7**: startup env validation (zod): JWT_SECRET ≥32 chars, reject placeholders.
- **L-1..L-6**: select-list social accounts, zod on updateMe, debug route 404 in prod, logoUrl http(s)-only, document IP trust assumption, wire revokeAll into password change path (future-proof stub ok).

### W2 — Correctness
- Audit status → Prisma enum `AuditStatus {PENDING RUNNING COMPLETED FAILED}`; fix all writers/readers incl. use-audit hook; status polling now actually works.
- AuditForm response shape bug (`data.audit.id` vs `{success,data:{id}}`).
- WhatsAppTemplate.userId added + enforced in CRUD (migration backfills existing rows to first admin).
- Login/me filter `deletedAt IS NULL`.
- Composite indexes: `Website@@index([domain,deletedAt])`, `Audit.status`, `Conversation.waId`.

### W3 — Architecture consolidation
- Extract modules: `modules/website`, `modules/blog`, `modules/whatsapp`; admin guard helper `requireAdmin()` used by all three admin routes; delete inline duplicates.
- Standardize ALL controllers/routes on zod validateBody + handleApiError (kill every bare catch{}).
- Finish React Query migration: consume existing hooks (use-audit/catalog/reviews/social) in their dashboard pages; typed admin page state.
- Delete dead code: src/types/* (inline the one type utils/api needs), utils barrel dead exports, jobs.ts (or adopt types in queue.ts — whichever is smaller diff), adopt logger.ts in handleApiError + job routes (observability), remove console.* in touched files only.
- CSP: drop `unsafe-eval` if build confirms no devtools need; keep rest of header set.

### W4 — Launch readiness
- README + CHANGELOG v3.0.0; .env.example complete (QStash/Upstash vars documented).
- vercel.json: cron for expired-token cleanup + region pinning note; PDF function memory bump comment.
- Full verify loop green: lint / test / build / tsc.
- Production readiness gate run; exceptions documented.

## Verification protocol

Per-wave: agents self-verify (lint+tsc+targeted tests). Orchestrator re-runs full gate after each merge-to-branch commit. Final: full suite + build + production-readiness checklist. No "done" claims without command output.

## Risks & rollback

Single branch `v3/rebuild`; prior branch untouched = instant rollback. Schema changes are additive (enums via safe migration order: add enum → switch values → drop text column pattern replaced by direct push since pre-launch db push flow retained; data loss risk accepted as DB currently dev-seeded only — confirmed remote but pre-launch).

## Decision log (autonomous, delegated authority)

| # | Decision | Rationale |
|---|---|---|
| D1 | Branch v3/rebuild, old branch preserved | Boss asleep; instant rollback |
| D2 | jose replaces jsonwebtoken everywhere | Edge middleware compat; kills dual-lib risk |
| D3 | Keep three.js hero | Brand identity; lazy-imported |
| D4 | Partner program dormant | No keys/product decision from Saif yet |
| D5 | Keep db push (no migrate baseline) | Pre-launch; flag post-launch |
