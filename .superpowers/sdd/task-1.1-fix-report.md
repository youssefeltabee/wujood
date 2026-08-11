# Task 1.1 Fix Report: Centralized Error Handling in Controllers

## Problem
After centralizing auth to throw `UnauthorizedError`, 5 of 6 controllers and 3 route files used bare `catch` blocks that returned generic 500 errors instead of using `handleApiError`. Unauthenticated users received HTTP 500 instead of 401.

## Root Cause
Controllers caught all errors and returned hardcoded `{ error: "...", status: 500 }`, swallowing the actual error type and status code from `authenticateUser()` and other AppError subclasses.

## Changes Made

### Controllers (added `import { handleApiError } from "@/lib/errors"` + replaced catch blocks):
1. **`src/modules/catalog/catalog.controller.ts`** — 4 catch blocks fixed
2. **`src/modules/chat/chat.controller.ts`** — 4 catch blocks fixed
3. **`src/modules/payments/payments.controller.ts`** — 2 catch blocks fixed
4. **`src/modules/reviews/reviews.controller.ts`** — 5 catch blocks fixed
5. **`src/modules/social/social.controller.ts`** — 7 catch blocks fixed

### Route files (added import + wrapped in try/catch):
6. **`src/app/api/blog/route.ts`** — 2 catch blocks fixed
7. **`src/app/api/admin/stats/route.ts`** — 1 catch block fixed (already had `ForbiddenError` import)
8. **`src/app/api/subscriptions/route.ts`** — No catch blocks existed; GET/POST wrapped in try/catch

## Pattern
All bare `catch` blocks:
```typescript
// Before
} catch {
  return NextResponse.json({ error: "Failed to..." }, { status: 500 });
}

// After
} catch (err) {
  return handleApiError(err);
}
```

## Verification
- `npm run lint` — ✅ passes (no new errors)
- `npx tsc --noEmit` — ✅ passes
