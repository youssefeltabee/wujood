-- Task 6 pre-push normalization: align legacy string values with new enum values.
-- Audit.status writers used UPPERCASE; legacy default was lowercase. Enum values are UPPERCASE.
UPDATE "Audit" SET "status" = UPPER("status") WHERE "status" <> UPPER("status");

-- Defensive lowercasing for columns whose enum values are lowercase (no-ops when already clean).
UPDATE "User" SET "role" = LOWER("role") WHERE "role" <> LOWER("role");
UPDATE "Subscription" SET "tier" = LOWER("tier"), "status" = LOWER("status") WHERE "tier" <> LOWER("tier") OR "status" <> LOWER("status");
UPDATE "Payment" SET "status" = LOWER("status"), "provider" = LOWER("provider") WHERE "status" <> LOWER("status") OR "provider" <> LOWER("provider");
UPDATE "SocialPost" SET "status" = LOWER("status") WHERE "status" <> LOWER("status");

-- Domain uniqueness precondition: collapse duplicate non-deleted domains (keep oldest) so @unique can be added.
-- ponytail: only touches rows that would actually violate the unique index
UPDATE "Website" w SET "domain" = NULL
FROM (
  SELECT "id" FROM (
    SELECT "id", ROW_NUMBER() OVER (PARTITION BY "domain" ORDER BY "createdAt" ASC) AS rn
    FROM "Website" WHERE "domain" IS NOT NULL
  ) ranked WHERE ranked.rn > 1
) dup
WHERE w."id" = dup."id";
