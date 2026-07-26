-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RefreshToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Website" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebsitePage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Template" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Audit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Contact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CatalogItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialAnalytics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WhatsAppTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Partner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PartnerCommission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
-- The application uses userId from JWT to scope queries

CREATE POLICY user_isolation ON "User"
  USING (id = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "Account"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "Session"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "RefreshToken"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "Subscription"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "Website"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "WebsitePage"
  USING ("websiteId" IN (SELECT id FROM "Website" WHERE "userId" = current_setting('app.current_user_id', TRUE)::text));

CREATE POLICY user_scoped ON "Audit"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text OR "userId" IS NULL);

CREATE POLICY user_scoped ON "Contact"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "Conversation"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "CatalogItem"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "Review"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "SocialAccount"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "SocialPost"
  USING ("accountId" IN (SELECT id FROM "SocialAccount" WHERE "userId" = current_setting('app.current_user_id', TRUE)::text));

CREATE POLICY user_scoped ON "SocialAnalytics"
  USING ("postId" IN (SELECT id FROM "SocialPost" WHERE "accountId" IN (SELECT id FROM "SocialAccount" WHERE "userId" = current_setting('app.current_user_id', TRUE)::text)));

CREATE POLICY public_read ON "WhatsAppTemplate"
  FOR SELECT USING (true);

CREATE POLICY user_scoped ON "Partner"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "PartnerCommission"
  USING ("partnerId" IN (SELECT id FROM "Partner" WHERE "userId" = current_setting('app.current_user_id', TRUE)::text));

CREATE POLICY user_scoped ON "Payment"
  USING ("userId" = current_setting('app.current_user_id', TRUE)::text);

CREATE POLICY user_scoped ON "BlogPost"
  USING ("authorId" = current_setting('app.current_user_id', TRUE)::text);

-- Public blog posts are readable by anyone
CREATE POLICY public_read_published ON "BlogPost"
  FOR SELECT USING ("publishedAt" IS NOT NULL);
