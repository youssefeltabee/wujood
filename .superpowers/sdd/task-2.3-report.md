# Task 2.3 — Async PDF Generation

**Status:** Done
**Commit:** `feat: async PDF generation — enqueue after audit scan completes`

## Changes

### New: `src/app/api/jobs/pdf-generation/route.ts`
QStash callback handler for PDF generation:
- Verifies QStash signature (same pattern as audit-scan)
- Fetches audit by ID, computes score, generates PDF via `generatePdf`
- Stores PDF as base64 data URL in `audit.pdfUrl`
- Error logged (non-critical, won't fail the audit)

### Modified: `src/app/api/jobs/audit-scan/route.ts`
- Imports `enqueueJob` from `@/lib/queue`
- After successful scan + score + update, enqueues `pdf-generation` job

### Modified: `src/lib/jobs.ts`
- Removed `userId` from `PdfGenerationJob.payload` (unused in handler)

## Flow
```
Controller → enqueue audit-scan → scan handler runs scan+score+update
                                        ↓
                                 enqueue pdf-generation
                                        ↓
                                 PDF handler: fetch audit, generate PDF, store as data URL
```

## Notes
- PDF stored as base64 data URL in `pdfUrl` column — pragmatic until storage service (S3/R2) is added
- PDF generation is fire-and-forget: logged on failure, doesn't affect audit status
- `userId` removed from job payload since handler doesn't use it

## Verification
- `npm run lint` — all pre-existing errors, no new issues
- `npx tsc --noEmit` — clean
