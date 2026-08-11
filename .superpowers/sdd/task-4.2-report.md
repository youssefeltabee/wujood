# Task 4.2 — Subscription Page TanStack Query Migration

**Status:** ✅ Complete

## Changes

Replaced manual `fetch` + `useState`/`useEffect` pattern with TanStack Query hooks in `src/app/dashboard/subscription/page.tsx`:

- `useSubscription()` replaces `useState<SubscriptionData>` + `useEffect` fetch
- `useCancelSubscription()` replaces manual `cancelSubscription` function
- `useChangeTier()` replaces manual `upgradeTier` function
- Upgrade dialog now shows **all higher-tier options** using `siteConfig.tiers` instead of hardcoded "Upgrade to Ra'ed"
- Selected tier stored in local state; mutation called with `selectedTier`
- Import Dialog components from `@/components/ui/dialog`
- Removed `useEffect` and `useState` imports (only `useState` for dialog/selection state remains)

## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ Clean |
| `npm run lint` (subscription page) | ✅ No errors — all 55 lint issues are pre-existing in other files |

## Concerns

None. Clean migration — no new dependencies, no API changes.
