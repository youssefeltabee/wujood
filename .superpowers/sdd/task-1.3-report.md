# Task 1.3 — Service Layer

**Status**: DONE

## Files Created
- `src/modules/catalog/catalog.service.ts` — 5 functions (list, get, create, update, soft-delete)
- `src/modules/reviews/reviews.service.ts` — 6 functions (list, get, create, update, delete, public)
- `src/modules/social/social.service.ts` — 7 functions (accounts CRUD, posts CRUD, analytics)
- `src/modules/payments/payments.service.ts` — 7 functions (payments CRUD, subscription lookup, payment lookup by ref)

## Files Modified
- `src/modules/catalog/catalog.controller.ts` — removed direct prisma calls, delegates to catalogService
- `src/modules/reviews/reviews.controller.ts` — removed direct prisma calls, delegates to reviewsService
- `src/modules/social/social.controller.ts` — removed direct prisma calls, delegates to socialService; retains `encrypt` import for token handling
- `src/modules/payments/payments.controller.ts` — delegates DB ops to paymentsService; retains Fawry signature/callback logic in controller

## Verification
- `npx tsc --noEmit` — **PASS** (0 errors)
- `npm run lint` — **PASS** (59 pre-existing errors/warnings, 0 new)

## Notes
- `Prisma.InputJsonValue` casts added in payments service to satisfy Prisma's strict JSON typing
- `subscription.findUnique({ where: { userId } })` → `findFirst` (no unique constraint on userId)
- Pre-existing `where as any` in social service preserved per task spec
