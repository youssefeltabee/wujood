# Task 1.1 — Auth Middleware: Throw instead of Return

## Summary

Changed `authenticateUser()` to throw `UnauthorizedError` instead of returning `NextResponse`. Eliminated the `instanceof NextResponse` guard pattern from all 9 controller/route files. Added `optionalUser()` for future use.

## Files Changed

| File | Change |
|------|--------|
| `src/lib/auth.ts` | Core — throws `UnauthorizedError`, removed `unauthorized()`, added `optionalUser()` |
| `src/modules/audit/audit.controller.ts` | Removed `instanceof NextResponse` checks (4 functions) |
| `src/modules/catalog/catalog.controller.ts` | Removed `instanceof NextResponse` checks (4 functions) |
| `src/modules/chat/chat.controller.ts` | Removed `instanceof NextResponse` checks (4 functions) |
| `src/modules/reviews/reviews.controller.ts` | Removed `instanceof NextResponse` checks (4 functions) |
| `src/modules/social/social.controller.ts` | Removed `instanceof NextResponse` checks (7 functions) |
| `src/modules/payments/payments.controller.ts` | Removed `instanceof NextResponse` checks (1 function) |
| `src/app/api/blog/route.ts` | Replaced inline auth with `authenticateUser()` (2 functions) |
| `src/app/api/admin/stats/route.ts` | Replaced inline auth with `authenticateUser()` + `ForbiddenError` |
| `src/app/api/subscriptions/route.ts` | Removed `instanceof NextResponse` checks (2 functions), removed unused `cookies` import |

## Verification

- **TypeScript**: `npx tsc --noEmit` — clean, zero errors
- **ESLint**: All issues are pre-existing (no new errors/warnings introduced)

## Notes

- `blog/route.ts` and `admin/stats/route.ts` had fully inline auth (raw `cookies()` + `verifyAccessToken`). Now use the centralized `authenticateUser()`.
- `admin/stats/route.ts` retains its role check (`ForbiddenError`) after auth — separate concern, correctly kept.
- `optionalUser()` exported for routes that may or may not have a user (e.g., public-facing endpoints with optional personalization).
- The old `unauthorized()` helper was removed — no longer needed since `UnauthorizedError` + `handleApiError` covers it.
