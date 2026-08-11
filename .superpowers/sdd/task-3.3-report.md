# Task 3.3 — TanStack Query Setup

## Status: DONE

## What was done
- Installed `@tanstack/react-query`
- Created `src/lib/query-client.ts` — QueryClient with 60s staleTime, 1 retry
- Created `src/app/providers.tsx` — wraps children with `QueryClientProvider` + `Toaster`
- Updated `src/app/layout.tsx` — root layout wraps with `<Providers>`
- Moved `Toaster` from `DashboardClientWrapper` to root `Providers` (avoids duplication)
- Updated `DashboardClientWrapper` tests to match simplified wrapper

## Files changed
| File | Action |
|------|--------|
| `src/lib/query-client.ts` | Created |
| `src/app/providers.tsx` | Created |
| `src/app/layout.tsx` | Modified — added Providers wrapper |
| `src/components/DashboardClientWrapper.tsx` | Modified — removed Toaster (root handles it) |
| `src/components/__tests__/DashboardClientWrapper.test.tsx` | Modified — updated test names |
| `package.json` | Modified — added `@tanstack/react-query` |
| `package-lock.json` | Modified — lockfile updated |

## Decisions
- **Toaster consolidation**: `DashboardClientWrapper` had its own `<Toaster />`. Moved it to root `Providers` so it's available everywhere, not just dashboard routes. `DashboardClientWrapper` is now a passthrough — kept for future dashboard-specific client state.
- **sonner import**: Used `@/components/ui` barrel (existing re-export) instead of importing from `sonner` directly.

## Verification
- `npx tsc --noEmit` — PASS (0 errors)
- `vitest run DashboardClientWrapper` — 6/6 PASS
- `npm run lint` — pre-existing errors only (none in new/modified files)

## Skipped
- Nothing. Task is complete per spec.
