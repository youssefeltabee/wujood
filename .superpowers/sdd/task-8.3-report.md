# Task 8.3 — Unit Tests for Services & SSRF Protection

**Status:** PASS
**Date:** 2026-08-03

## Files Written

| File | Tests | Status |
|------|-------|--------|
| `src/lib/__tests__/url-validation.test.ts` | 4 | ✅ |
| `src/lib/__tests__/rate-limit.test.ts` | 1 | ✅ |
| `src/lib/__tests__/errors.test.ts` | 6 | ✅ |

## Test Summary

**11/11 passing.**

### url-validation.test.ts
- Rejects private IPs (192.168.x.x, 10.x.x.x, 172.16.x.x)
- Rejects localhost with and without port
- Rejects non-http protocols (ftp, file)
- Accepts valid public HTTPS URLs

### rate-limit.test.ts
- In-memory fallback returns success on first call (no Upstash configured)

### errors.test.ts
- AppError, ValidationError, NotFoundError, UnauthorizedError return correct status codes
- handleApiError returns correct HTTP status for AppError and unknown errors

## Adjustments from Spec

- `AppError` constructor requires 3 args `(message, statusCode, code)` — test updated from single-arg spec.
- `handleApiError` returns `NextResponse` — `response.status` works as expected.

## Verification

```
npx vitest run src/lib/__tests__/ --reporter=verbose
→ 3 test files, 11 tests, all passed
```
