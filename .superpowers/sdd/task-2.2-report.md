# Task 2.2 — Async Audit Scanning

**Status:** Done
**Commit:** `feat: async audit scanning — enqueue job, return 202, client polls for result`

## Changes

### 1. `src/modules/audit/audit.controller.ts`
- **Removed** `scanUrl` import — no longer called during create
- **Added** `enqueueJob` import from `@/lib/queue`
- **`createAuditController`**: Creates audit with `status: "PENDING"`, enqueues `audit-scan` job, returns HTTP 202 with `{ id, status: "PENDING" }`
- **Added** `auditStatusController`: Returns `{ id, status }` for pending/failed, `{ id, status, results }` for completed, `{ id, status, error }` for failed
- **Kept** `computeScore` import (used by `pdfAuditController`)

### 2. `src/app/api/audit/[id]/status/route.ts` (new)
- GET endpoint, authenticated, delegates to `auditStatusController`

### 3. `src/utils/api.ts`
- Added `jsonAccepted()` helper (HTTP 202)

## Verification
- `npx tsc --noEmit` — clean
- `npm run lint` — no new errors in modified files (pre-existing issues in other files unchanged)
