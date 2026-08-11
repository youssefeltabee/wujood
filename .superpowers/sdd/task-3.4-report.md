# Task 3.4 — Query Hooks

**Status**: DONE
**Commit**: `c699cb0` — `feat: React Query hooks — audit, catalog, reviews, social, subscription`

## Files Created

| File | Hooks |
|------|-------|
| `src/hooks/use-audit.ts` | `useAudits`, `useAudit`, `useAuditStatus`, `useCreateAudit` |
| `src/hooks/use-catalog.ts` | `useCatalogItems`, `useCreateCatalogItem`, `useUpdateCatalogItem`, `useDeleteCatalogItem` |
| `src/hooks/use-reviews.ts` | `useReviews`, `usePublicReviews`, `useCreateReview`, `useUpdateReview`, `useDeleteReview` |
| `src/hooks/use-social.ts` | `useSocialAccounts`, `useConnectSocialAccount`, `useDisconnectSocialAccount`, `useSocialPosts`, `useCreateSocialPost`, `useDeleteSocialPost`, `usePostAnalytics` |
| `src/hooks/use-subscription.ts` | `useSubscription`, `useCancelSubscription`, `useChangeTier` |

## Endpoint Mapping

- **Audit**: `/api/audit` (list/create), `/api/audit/[id]` (get), `/api/audit/[id]/status` (poll with 2s interval)
- **Catalog**: `/api/catalog` (list/create, optional `?category=`), `/api/catalog/[id]` (update/delete)
- **Reviews**: `/api/reviews` (list/create), `/api/reviews/[id]` (update/delete), `/api/reviews/public?userId=` (public)
- **Social**: `/api/social` (list accounts/create account), `/api/social/accounts/[id]` (delete), `/api/social/posts` (list/create, optional `?status=&accountId=`), `/api/social/posts/[id]` (analytics/delete)
- **Subscriptions**: `/api/subscriptions` (get/cancel/change-tier)

## Notes

- `useAuditStatus` polls every 2s while status is `pending`/`processing`, stops when completed/failed
- All mutation hooks invalidate their respective query keys on success
- Typecheck: PASS, Lint: no new errors
