# Task 2.1 Report — Queue Setup (Upstash QStash)

## Status: DONE

## Files Created
- `src/lib/queue.ts` — QStash client + `enqueueJob()` helper
- `src/lib/jobs.ts` — Job type definitions (AuditScanJob, PdfGenerationJob)
- `src/app/api/jobs/audit-scan/route.ts` — QStash callback handler with signature verification

## Files Modified
- `prisma/schema.prisma` — Added `status` (String, default "pending") and `error` (String?) fields to Audit model

## Test Results
- `npm run lint`: No new errors from created files (59 pre-existing errors/warnings unchanged)
- `npx tsc --noEmit`: Clean, zero errors
- `npx prisma generate`: Success

## Concerns
- **`QSTASH_NEXT_SIGNING_KEY`**: The `Receiver` requires both `currentSigningKey` and `nextSigningKey`. Add this env var to `.env` alongside `QSTASH_TOKEN` and `QSTASH_SIGNING_KEY`.
- **Schema migration**: `prisma db push` was NOT run (it requires a live DB connection). Run `npx prisma db push` against the target database to apply the `status`/`error` columns before deploying.
- **`rawData` cast**: Used `as any` to satisfy Prisma's `InputJsonValue` constraint on the Json field. Acceptable since the runtime type is a plain object from the scanner.
