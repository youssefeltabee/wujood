# Wujood Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Wujood — fix architecture (auth, service layer, error handling), upgrade UI to shadcn/ui, complete all 4 feature streams, and ship production-ready.

**Architecture:** Next.js 16 app with domain modules (`src/modules/`), thin API route delegates, Prisma 6 ORM, PostgreSQL (Supabase). Each module follows: route → controller → service → prisma. Background jobs via Upstash QStash.

**Tech Stack:** Next.js 16, TypeScript strict, Prisma 6, PostgreSQL (Supabase), Tailwind CSS 4, shadcn/ui, TanStack Query, Upstash QStash, Upstash Rate Limit, jose (JWT), Resend (email), Twilio (WhatsApp), Fawry (payments), Vitest

## Global Constraints

- TypeScript strict mode — no `any`, no `@ts-ignore`
- ESLint + Prettier — run `npm run lint` before every commit
- Prisma schema is read-only for this rebuild — no model changes
- All new UI uses shadcn/ui components — no custom primitives for standard elements
- Arabic-first — all user-facing strings in Arabic, RTL layouts
- EGP currency — all pricing in Egyptian Pounds
- Fawry for payments — Stripe does not serve Egypt
- Vercel deployment — serverless functions, no persistent processes
- Supabase PostgreSQL — free tier, paused project to reactivate
- Every phase ends with a working, deployable state
- After each phase: wait 1 minute, check emails/CodeRabbit, address feedback

---

## Phase 1: Architecture Foundation

### Task 1.1: Auth Middleware

**Files:**
- Create: `src/lib/auth.ts`
- Modify: `src/modules/audit/audit.controller.ts`
- Modify: `src/modules/catalog/catalog.controller.ts`
- Modify: `src/modules/chat/chat.controller.ts`
- Modify: `src/modules/reviews/reviews.controller.ts`
- Modify: `src/modules/social/social.controller.ts`
- Modify: `src/modules/payments/payments.controller.ts`
- Modify: `src/app/api/blog/route.ts`
- Modify: `src/app/api/admin/stats/route.ts`

**Interfaces:**
- Produces: `authenticateUser()` → returns `User` or throws `AuthError`

- [ ] **Step 1: Create auth.ts with authenticateUser**

```typescript
// src/lib/auth.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/modules/auth/auth.service";
import { AuthError } from "@/lib/errors";

export async function authenticateUser() {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (!user) throw new AuthError("Unauthorized");
  return user;
}

export async function optionalUser() {
  const token = (await cookies()).get("token")?.value;
  return token ? verifyAccessToken(token) : null;
}
```

- [ ] **Step 2: Update audit.controller.ts to use authenticateUser**

Replace all `const token = (await cookies()).get("token")?.value; const user = token ? verifyAccessToken(token) : null; if (!user) return NextResponse.json(...)` blocks with:

```typescript
import { authenticateUser } from "@/lib/auth";

// In each handler:
const user = await authenticateUser();
```

- [ ] **Step 3: Update catalog.controller.ts**

Same pattern — replace all 4 duplicate auth extractions.

- [ ] **Step 4: Update chat.controller.ts**

Same pattern — replace all 4 duplicate auth extractions.

- [ ] **Step 5: Update reviews.controller.ts**

Same pattern — replace all 4 duplicate auth extractions.

- [ ] **Step 6: Update social.controller.ts**

Same pattern — replace all 7 duplicate auth extractions.

- [ ] **Step 7: Update payments.controller.ts**

Replace 1 auth extraction.

- [ ] **Step 8: Update blog/route.ts**

Replace 2 inline auth extractions.

- [ ] **Step 9: Update admin/stats/route.ts**

Replace 1 inline auth extraction.

- [ ] **Step 10: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add src/lib/auth.ts src/modules/*/audit.controller.ts src/modules/catalog/catalog.controller.ts src/modules/chat/chat.controller.ts src/modules/reviews/reviews.controller.ts src/modules/social/social.controller.ts src/modules/payments/payments.controller.ts src/app/api/blog/route.ts src/app/api/admin/stats/route.ts
git commit -m "feat: centralize auth middleware — eliminate 20+ duplicate extractions"
```

---

### Task 1.2: Error Handling

**Files:**
- Create: `src/lib/errors.ts`
- Modify: All controllers (to use typed errors)

**Interfaces:**
- Produces: `AppError`, `ValidationError`, `AuthError`, `NotFoundError`, `ConflictError`, `ServerError`, `apiError()`

- [ ] **Step 1: Create errors.ts**

```typescript
// src/lib/errors.ts
import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "AUTH_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class ServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, 500, "SERVER_ERROR");
  }
}

export function apiError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return apiError(error.status, error.code, error.message);
  }
  console.error("Unhandled error:", error);
  return apiError(500, "SERVER_ERROR", "Internal server error");
}
```

- [ ] **Step 2: Update audit.controller.ts to use typed errors**

Replace generic catch blocks:
```typescript
// Before
catch (error) {
  return NextResponse.json({ error: "Failed to create audit" }, { status: 500 });
}

// After
catch (error) {
  if (error instanceof AppError) throw error;
  throw new ServerError("Failed to create audit");
}
```

- [ ] **Step 3: Update catalog.controller.ts**

Same pattern for all handlers.

- [ ] **Step 4: Update chat.controller.ts**

Same pattern for all handlers.

- [ ] **Step 5: Update reviews.controller.ts**

Same pattern for all handlers.

- [ ] **Step 6: Update social.controller.ts**

Same pattern for all handlers.

- [ ] **Step 7: Update payments.controller.ts**

Same pattern for all handlers.

- [ ] **Step 8: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/lib/errors.ts src/modules/*/src/modules/catalog/catalog.controller.ts src/modules/chat/chat.controller.ts src/modules/reviews/reviews.controller.ts src/modules/social/social.controller.ts src/modules/payments/payments.controller.ts
git commit -m "feat: typed error handling — replace generic catch blocks with AppError hierarchy"
```

---

### Task 1.3: Service Layer

**Files:**
- Create: `src/modules/catalog/catalog.service.ts`
- Create: `src/modules/reviews/reviews.service.ts`
- Create: `src/modules/social/social.service.ts`
- Create: `src/modules/payments/payments.service.ts`
- Modify: All corresponding controllers

**Interfaces:**
- Produces: Service functions for each module

- [ ] **Step 1: Create catalog.service.ts**

```typescript
// src/modules/catalog/catalog.service.ts
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export async function getCatalogItems(userId: string) {
  return prisma.catalogItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCatalogItem(id: string, userId: string) {
  const item = await prisma.catalogItem.findFirst({
    where: { id, userId },
  });
  if (!item) throw new NotFoundError("Catalog item");
  return item;
}

export async function createCatalogItem(userId: string, data: { name: string; description?: string; price: number; imageUrl?: string }) {
  return prisma.catalogItem.create({
    data: { ...data, userId },
  });
}

export async function updateCatalogItem(id: string, userId: string, data: { name?: string; description?: string; price?: number; imageUrl?: string }) {
  const item = await prisma.catalogItem.findFirst({ where: { id, userId } });
  if (!item) throw new NotFoundError("Catalog item");
  return prisma.catalogItem.update({ where: { id }, data });
}

export async function deleteCatalogItem(id: string, userId: string) {
  const item = await prisma.catalogItem.findFirst({ where: { id, userId } });
  if (!item) throw new NotFoundError("Catalog item");
  return prisma.catalogItem.delete({ where: { id } });
}
```

- [ ] **Step 2: Update catalog.controller.ts to use service**

```typescript
import * as catalogService from "./catalog.service";

export async function getCatalogItems() {
  const user = await authenticateUser();
  const items = await catalogService.getCatalogItems(user.id);
  return NextResponse.json(items);
}
```

- [ ] **Step 3: Create reviews.service.ts**

```typescript
// src/modules/reviews/reviews.service.ts
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export async function getReviews(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReview(id: string, userId: string) {
  const review = await prisma.review.findFirst({ where: { id, userId } });
  if (!review) throw new NotFoundError("Review");
  return review;
}

export async function createReview(userId: string, data: { rating: number; comment?: string; source?: string }) {
  return prisma.review.create({ data: { ...data, userId } });
}

export async function deleteReview(id: string, userId: string) {
  const review = await prisma.review.findFirst({ where: { id, userId } });
  if (!review) throw new NotFoundError("Review");
  return prisma.review.delete({ where: { id } });
}
```

- [ ] **Step 4: Update reviews.controller.ts to use service**

- [ ] **Step 5: Create social.service.ts**

```typescript
// src/modules/social/social.service.ts
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export async function getSocialAccounts(userId: string) {
  return prisma.socialAccount.findMany({
    where: { userId },
    include: { analytics: true },
  });
}

export async function getSocialAccount(id: string, userId: string) {
  const account = await prisma.socialAccount.findFirst({ where: { id, userId } });
  if (!account) throw new NotFoundError("Social account");
  return account;
}

export async function connectSocialAccount(userId: string, data: { platform: string; accountId: string; accessToken: string }) {
  return prisma.socialAccount.create({ data: { ...data, userId } });
}

export async function disconnectSocialAccount(id: string, userId: string) {
  const account = await prisma.socialAccount.findFirst({ where: { id, userId } });
  if (!account) throw new NotFoundError("Social account");
  return prisma.socialAccount.delete({ where: { id } });
}

export async function getSocialPosts(userId: string) {
  return prisma.socialPost.findMany({
    where: { account: { userId } },
    include: { account: true },
    orderBy: { createdAt: "desc" },
  });
}
```

- [ ] **Step 6: Update social.controller.ts to use service**

- [ ] **Step 7: Create payments.service.ts**

```typescript
// src/modules/payments/payments.service.ts
import { prisma } from "@/lib/prisma";
import { NotFoundError, ConflictError } from "@/lib/errors";

export async function getPayments(userId: string) {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPayment(id: string, userId: string) {
  const payment = await prisma.payment.findFirst({ where: { id, userId } });
  if (!payment) throw new NotFoundError("Payment");
  return payment;
}

export async function createPayment(userId: string, data: { amount: number; currency: string; provider: string; metadata?: any }) {
  return prisma.payment.create({ data: { ...data, userId, status: "PENDING" } });
}

export async function updatePaymentStatus(id: string, status: string, providerData?: any) {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw new NotFoundError("Payment");
  if (payment.status === "COMPLETED") throw new ConflictError("Payment already completed");
  
  return prisma.payment.update({
    where: { id },
    data: { status, providerData },
  });
}

export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({ where: { userId } });
}
```

- [ ] **Step 8: Update payments.controller.ts to use service**

- [ ] **Step 9: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add src/modules/catalog/catalog.service.ts src/modules/catalog/catalog.controller.ts src/modules/reviews/reviews.service.ts src/modules/reviews/reviews.controller.ts src/modules/social/social.service.ts src/modules/social/social.controller.ts src/modules/payments/payments.service.ts src/modules/payments/payments.controller.ts
git commit -m "feat: service layer for catalog, reviews, social, payments — controllers now thin delegates"
```

---

### Task 1.4: SSRF Protection

**Files:**
- Create: `src/lib/url-validation.ts`
- Modify: `src/modules/audit/audit.scanner.ts`

**Interfaces:**
- Produces: `validateUrl(url: string)` → throws if private/internal

- [ ] **Step 1: Create url-validation.ts**

```typescript
// src/lib/url-validation.ts
import { ValidationError } from "@/lib/errors";

const PRIVATE_IP_PATTERNS = [
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /^localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
];

export function validateUrl(url: string): void {
  try {
    const parsed = new URL(url);
    
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new ValidationError("Only HTTP/HTTPS URLs are allowed");
    }
    
    const hostname = parsed.hostname;
    
    for (const pattern of PRIVATE_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        throw new ValidationError("Private/internal URLs are not allowed");
      }
    }
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new ValidationError("Invalid URL");
  }
}
```

- [ ] **Step 2: Update audit.scanner.ts to use validateUrl**

```typescript
import { validateUrl } from "@/lib/url-validation";

export async function scanUrl(url: string) {
  validateUrl(url);
  // ... existing scan logic
}
```

- [ ] **Step 3: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/url-validation.ts src/modules/audit/audit.scanner.ts
git commit -m "feat: SSRF protection — block private/internal URLs in audit scanner"
```

---

### Task 1.5: Payment Idempotency

**Files:**
- Modify: `src/modules/payments/payments.controller.ts`

**Interfaces:**
- Consumes: `payments.service.ts` functions

- [ ] **Step 1: Wrap Fawry callback in transaction**

```typescript
// In fawryCallback handler:
import { prisma } from "@/lib/prisma";

export async function fawryCallback(req: Request) {
  const body = await req.json();
  const { paymentId, status, providerData } = body;
  
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: status === "SUCCESS" ? "COMPLETED" : "FAILED", providerData },
    }),
    ...(status === "SUCCESS" ? [
      prisma.subscription.upsert({
        where: { userId: providerData.userId },
        update: { status: "ACTIVE", expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        create: { userId: providerData.userId, tier: providerData.tier, status: "ACTIVE", expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      }),
    ] : []),
  ]);
  
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/modules/payments/payments.controller.ts
git commit -m "feat: payment idempotency — wrap Fawry callback in Prisma transaction"
```

---

### Task 1.6: Rate Limiting

**Files:**
- Create: `src/lib/rate-limit.ts`
- Modify: `src/app/api/audit/route.ts`

**Interfaces:**
- Produces: `rateLimit(key: string, limit: number, window: number)` → returns `{ success: boolean }`

- [ ] **Step 1: Install Upstash rate limit**

Run: `npm install @upstash/ratelimit @upstash/redis`

- [ ] **Step 2: Create rate-limit.ts**

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

export async function rateLimit(key: string, limit: number = 10) {
  const { success, limit: rateLimit, remaining, reset } = await ratelimit.limit(key);
  return { success, limit: rateLimit, remaining, reset };
}
```

- [ ] **Step 3: Update audit route to use rate limiting**

```typescript
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const user = await authenticateUser();
  
  const { success } = await rateLimit(`audit:${user.id}`, 10);
  if (!success) {
    return apiError(429, "RATE_LIMITED", "Too many requests. Please try again later.");
  }
  
  // ... existing audit creation logic
}
```

- [ ] **Step 4: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/rate-limit.ts src/app/api/audit/route.ts package.json package-lock.json
git commit -m "feat: rate limiting on audit endpoint — Upstash Ratelimit"
```

---

## Phase 2: Background Jobs

### Task 2.1: Queue Setup

**Files:**
- Create: `src/lib/queue.ts`
- Create: `src/lib/jobs.ts`
- Install: `@upstash/qstash`

**Interfaces:**
- Produces: `enqueueJob(type, payload)`, `processJob(handler)`

- [ ] **Step 1: Install QStash**

Run: `npm install @upstash/qstash`

- [ ] **Step 2: Create queue.ts**

```typescript
// src/lib/queue.ts
import { Client } from "@upstash/qstash";

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function enqueueJob(type: string, payload: any) {
  await qstash.publishJSON({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/${type}`,
    body: payload,
  });
}
```

- [ ] **Step 3: Create jobs.ts**

```typescript
// src/lib/jobs.ts
export type JobType = "audit-scan" | "pdf-generation";

export interface AuditScanJob {
  type: "audit-scan";
  payload: {
    auditId: string;
    url: string;
    userId: string;
  };
}

export interface PdfGenerationJob {
  type: "pdf-generation";
  payload: {
    auditId: string;
    userId: string;
  };
}

export type Job = AuditScanJob | PdfGenerationJob;
```

- [ ] **Step 4: Create job handler route**

```typescript
// src/app/api/jobs/audit-scan/route.ts
import { NextResponse } from "next/server";
import { verifySignature } from "@upstash/qstash";
import { prisma } from "@/lib/prisma";
import { scanUrl } from "@/modules/audit/audit.scanner";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature");
  
  if (!verifySignature({ body, signature, secret: process.env.QSTASH_SIGNING_KEY! })) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  
  const { auditId, url, userId } = JSON.parse(body);
  
  try {
    const results = await scanUrl(url);
    await prisma.audit.update({
      where: { id: auditId },
      data: { results, status: "COMPLETED" },
    });
  } catch (error) {
    await prisma.audit.update({
      where: { id: auditId },
      data: { status: "FAILED", error: error instanceof Error ? error.message : "Scan failed" },
    });
  }
  
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 5: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/queue.ts src/lib/jobs.ts src/app/api/jobs/audit-scan/route.ts package.json package-lock.json
git commit -m "feat: background job queue — Upstash QStash setup with audit-scan handler"
```

---

### Task 2.2: Async Audit Scanning

**Files:**
- Modify: `src/modules/audit/audit.controller.ts`
- Create: `src/app/api/audit/[id]/status/route.ts`

**Interfaces:**
- Consumes: `enqueueJob()` from queue.ts
- Produces: `GET /api/audit/[id]/status` → poll endpoint

- [ ] **Step 1: Update audit.controller.ts to enqueue jobs**

```typescript
import { enqueueJob } from "@/lib/queue";

export async function createAudit(userId: string, url: string) {
  const audit = await prisma.audit.create({
    data: { userId, url, status: "PENDING" },
  });
  
  await enqueueJob("audit-scan", {
    auditId: audit.id,
    url,
    userId,
  });
  
  return audit;
}
```

- [ ] **Step 2: Create status polling endpoint**

```typescript
// src/app/api/audit/[id]/status/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticateUser();
  const { id } = await params;
  
  const audit = await prisma.audit.findFirst({
    where: { id, userId: user.id },
    select: { id: true, status: true, results: true, error: true },
  });
  
  if (!audit) throw new NotFoundError("Audit");
  
  return NextResponse.json(audit);
}
```

- [ ] **Step 3: Update audit route to return immediately**

```typescript
// src/app/api/audit/route.ts
export async function POST(req: Request) {
  const user = await authenticateUser();
  const { url } = await req.json();
  
  const audit = await createAudit(user.id, url);
  
  // Return immediately with audit ID — client polls for result
  return NextResponse.json({ id: audit.id, status: "PENDING" }, { status: 202 });
}
```

- [ ] **Step 4: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/audit/audit.controller.ts src/app/api/audit/route.ts src/app/api/audit/\[id\]/status/route.ts
git commit -m "feat: async audit scanning — enqueue job, return 202, client polls for result"
```

---

### Task 2.3: Async PDF Generation

**Files:**
- Create: `src/app/api/jobs/pdf-generation/route.ts`
- Modify: `src/modules/audit/audit.controller.ts`

**Interfaces:**
- Produces: PDF generation job handler

- [ ] **Step 1: Create PDF generation job handler**

```typescript
// src/app/api/jobs/pdf-generation/route.ts
import { NextResponse } from "next/server";
import { verifySignature } from "@upstash/qstash";
import { prisma } from "@/lib/prisma";
import { generateAuditPdf } from "@/modules/audit/audit.pdf";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature");
  
  if (!verifySignature({ body, signature, secret: process.env.QSTASH_SIGNING_KEY! })) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  
  const { auditId, userId } = JSON.parse(body);
  
  try {
    const pdfUrl = await generateAuditPdf(auditId);
    await prisma.audit.update({
      where: { id: auditId },
      data: { pdfUrl },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
  
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Update audit controller to enqueue PDF generation after scan**

```typescript
// In audit scan completion handler:
await enqueueJob("pdf-generation", {
  auditId: audit.id,
  userId: audit.userId,
});
```

- [ ] **Step 3: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/api/jobs/pdf-generation/route.ts src/modules/audit/audit.controller.ts
git commit -m "feat: async PDF generation — enqueue after audit scan completes"
```

---

## Phase 3: UI Upgrade

### Task 3.1: shadcn/ui Setup

**Files:**
- Modify: `package.json`
- Create: `components.json`
- Create: `src/lib/utils.ts` (update if exists)

**Interfaces:**
- Produces: shadcn/ui configured project

- [ ] **Step 1: Initialize shadcn/ui**

Run: `npx shadcn@latest init`
Select: New York style, Zinc base color, CSS variables: yes

- [ ] **Step 2: Install shadcn/ui components**

Run: `npx shadcn@latest add button input select badge card dialog tabs tooltip sonner skeleton`

- [ ] **Step 3: Update src/lib/utils.ts**

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components.json src/lib/utils.ts src/components/ui/*
git commit -m "feat: shadcn/ui setup — install CLI, add core components"
```

---

### Task 3.2: Replace Custom Primitives

**Files:**
- Modify: All files importing from `@/components/ui`
- Delete: Custom primitives being replaced

**Interfaces:**
- Consumes: shadcn/ui components

- [ ] **Step 1: Map imports and replace Button**

Find all imports of `@/components/ui/Button` and replace with `@/components/ui/button` (shadcn).

- [ ] **Step 2: Replace Input**

Same pattern.

- [ ] **Step 3: Replace Select**

Same pattern.

- [ ] **Step 4: Replace Badge**

Same pattern.

- [ ] **Step 5: Replace Card**

Same pattern.

- [ ] **Step 6: Replace Modal with Dialog**

Same pattern — Modal → Dialog.

- [ ] **Step 7: Replace Tabs**

Same pattern.

- [ ] **Step 8: Replace Tooltip**

Same pattern.

- [ ] **Step 9: Replace Toast with Sonner**

Same pattern.

- [ ] **Step 10: Replace Skeleton**

Same pattern.

- [ ] **Step 11: Delete old custom primitives**

Remove: `src/components/ui/Button.tsx`, `Input.tsx`, `Select.tsx`, `Badge.tsx`, `Card.tsx`, `Modal.tsx`, `Tabs.tsx`, `Tooltip.tsx`, `Toast.tsx`, `Skeleton.tsx`

- [ ] **Step 12: Update index.ts exports**

```typescript
// src/components/ui/index.ts
export * from "./button";
export * from "./input";
export * from "./select";
export * from "./badge";
export * from "./card";
export * from "./dialog";
export * from "./tabs";
export * from "./tooltip";
export * from "./sonner";
export * from "./skeleton";
// Keep custom components
export * from "./spinner";
export * from "./geometric-pattern";
export * from "./hero-illustration";
export * from "./logo";
export * from "./scroll-reveal";
export * from "./tilt-card";
export * from "./whatsapp-button";
```

- [ ] **Step 13: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 14: Commit**

```bash
git add src/components/ui/* src/
git commit -m "feat: replace 10 custom primitives with shadcn/ui — Button, Input, Select, Badge, Card, Dialog, Tabs, Tooltip, Toast, Skeleton"
```

---

### Task 3.3: TanStack Query Setup

**Files:**
- Install: `@tanstack/react-query`
- Create: `src/lib/query-client.ts`
- Create: `src/app/providers.tsx`

**Interfaces:**
- Produces: QueryClient provider setup

- [ ] **Step 1: Install TanStack Query**

Run: `npm install @tanstack/react-query`

- [ ] **Step 2: Create query-client.ts**

```typescript
// src/lib/query-client.ts
"use client";

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
```

- [ ] **Step 3: Create providers.tsx**

```typescript
// src/app/providers.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
```

- [ ] **Step 4: Wrap layout.tsx with Providers**

```typescript
// src/app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/query-client.ts src/app/providers.tsx src/app/layout.tsx package.json package-lock.json
git commit -m "feat: TanStack Query setup — QueryClient provider, Sonner toast"
```

---

### Task 3.4: Query Hooks

**Files:**
- Create: `src/hooks/use-audit.ts`
- Create: `src/hooks/use-catalog.ts`
- Create: `src/hooks/use-reviews.ts`
- Create: `src/hooks/use-social.ts`
- Create: `src/hooks/use-subscription.ts`

**Interfaces:**
- Produces: React Query hooks for each domain

- [ ] **Step 1: Create use-audit.ts**

```typescript
// src/hooks/use-audit.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAudits() {
  return useQuery({
    queryKey: ["audits"],
    queryFn: async () => {
      const res = await fetch("/api/audit");
      if (!res.ok) throw new Error("Failed to fetch audits");
      return res.json();
    },
  });
}

export function useAudit(id: string) {
  return useQuery({
    queryKey: ["audit", id],
    queryFn: async () => {
      const res = await fetch(`/api/audit/${id}/status`);
      if (!res.ok) throw new Error("Failed to fetch audit");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateAudit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to create audit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
}
```

- [ ] **Step 2: Create use-catalog.ts**

```typescript
// src/hooks/use-catalog.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCatalogItems() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const res = await fetch("/api/catalog");
      if (!res.ok) throw new Error("Failed to fetch catalog");
      return res.json();
    },
  });
}

export function useCreateCatalogItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; price: number }) => {
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}

export function useDeleteCatalogItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/catalog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
}
```

- [ ] **Step 3: Create use-reviews.ts**

Same pattern as use-catalog.ts.

- [ ] **Step 4: Create use-social.ts**

Same pattern.

- [ ] **Step 5: Create use-subscription.ts**

```typescript
// src/hooks/use-subscription.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscriptions");
      if (!res.ok) throw new Error("Failed to fetch subscription");
      return res.json();
    },
  });
}

export function useChangeTier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tier: string) => {
      const res = await fetch("/api/subscriptions/change-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) throw new Error("Failed to change tier");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reason?: string) => {
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to cancel subscription");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}
```

- [ ] **Step 6: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/hooks/use-*.ts
git commit -m "feat: React Query hooks — audit, catalog, reviews, social, subscription"
```

---

## Phase 4: Payments & Subscriptions

### Task 4.1: Subscription Billing

**Files:**
- Modify: `src/modules/payments/payments.controller.ts`
- Modify: `src/modules/payments/payments.service.ts`

**Interfaces:**
- Consumes: Fawry callback
- Produces: Subscription auto-extension on payment

- [ ] **Step 1: Update payments.service.ts with subscription logic**

```typescript
// src/modules/payments/payments.service.ts
export async function handlePaymentSuccess(paymentId: string, userId: string, tier: string) {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);
  
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: "COMPLETED" },
    }),
    prisma.subscription.upsert({
      where: { userId },
      update: { tier, status: "ACTIVE", expiresAt },
      create: { userId, tier, status: "ACTIVE", expiresAt },
    }),
  ]);
}
```

- [ ] **Step 2: Update Fawry callback to use new service**

- [ ] **Step 3: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/modules/payments/payments.service.ts src/modules/payments/payments.controller.ts
git commit -m "feat: subscription billing — auto-extend on Fawry payment success"
```

---

### Task 4.2: Subscription UI

**Files:**
- Create: `src/app/dashboard/subscription/page.tsx`
- Create: `src/components/subscription/subscription-card.tsx`
- Create: `src/components/subscription/change-tier-dialog.tsx`
- Create: `src/components/subscription/cancel-dialog.tsx`

**Interfaces:**
- Consumes: useSubscription(), useChangeTier(), useCancelSubscription()

- [ ] **Step 1: Create subscription page**

```typescript
// src/app/dashboard/subscription/page.tsx
"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { SubscriptionCard } from "@/components/subscription/subscription-card";

export default function SubscriptionPage() {
  const { data: subscription, isLoading } = useSubscription();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">الاشتراك</h1>
      <SubscriptionCard subscription={subscription} />
    </div>
  );
}
```

- [ ] **Step 2: Create SubscriptionCard component**

```typescript
// src/components/subscription/subscription-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChangeTierDialog } from "./change-tier-dialog";
import { CancelDialog } from "./cancel-dialog";
import { useState } from "react";

interface Subscription {
  tier: string;
  status: string;
  expiresAt: string;
}

export function SubscriptionCard({ subscription }: { subscription: Subscription | null }) {
  const [showChangeTier, setShowChangeTier] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>لا يوجد اشتراك</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">اختر خطة للبدء</p>
          <Button className="mt-4">اختر خطة</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>الاشتراك الحالي</span>
          <Badge variant={subscription.status === "ACTIVE" ? "default" : "destructive"}>
            {subscription.status === "ACTIVE" ? "نشط" : "غير نشط"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">الخطة</p>
            <p className="font-medium">{subscription.tier}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">تاريخ الانتهاء</p>
            <p className="font-medium">{new Date(subscription.expiresAt).toLocaleDateString("ar-EG")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowChangeTier(true)}>
              تغيير الخطة
            </Button>
            <Button variant="destructive" onClick={() => setShowCancel(true)}>
              إلغاء الاشتراك
            </Button>
          </div>
        </div>
      </CardContent>
      
      <ChangeTierDialog open={showChangeTier} onOpenChange={setShowChangeTier} currentTier={subscription.tier} />
      <CancelDialog open={showCancel} onOpenChange={setShowCancel} />
    </Card>
  );
}
```

- [ ] **Step 3: Create ChangeTierDialog**

```typescript
// src/components/subscription/change-tier-dialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChangeTier } from "@/hooks/use-subscription";
import { useState } from "react";

const tiers = [
  { id: "kashif", name: "كاشف", price: 1250 },
  { id: "sane", name: "صانع", price: 2500 },
  { id: "raed", name: "رائد", price: 4500 },
];

export function ChangeTierDialog({ open, onOpenChange, currentTier }: { open: boolean; onOpenChange: (open: boolean) => void; currentTier: string }) {
  const [selectedTier, setSelectedTier] = useState(currentTier);
  const { mutate: changeTier, isPending } = useChangeTier();
  
  const handleConfirm = () => {
    changeTier(selectedTier, { onSuccess: () => onOpenChange(false) });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تغيير الخطة</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {tiers.map((tier) => (
            <Button
              key={tier.id}
              variant={selectedTier === tier.id ? "default" : "outline"}
              className="w-full justify-between"
              onClick={() => setSelectedTier(tier.id)}
            >
              <span>{tier.name}</span>
              <span>{tier.price} جنيه/شهر</span>
            </Button>
          ))}
        </div>
        <Button onClick={handleConfirm} disabled={isPending || selectedTier === currentTier} className="w-full mt-4">
          {isPending ? "جاري التغيير..." : "تأكيد التغيير"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Create CancelDialog**

```typescript
// src/components/subscription/cancel-dialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCancelSubscription } from "@/hooks/use-subscription";

export function CancelDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { mutate: cancel, isPending } = useCancelSubscription();
  
  const handleConfirm = () => {
    cancel(undefined, { onSuccess: () => onOpenChange(false) });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إلغاء الاشتراك</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          هل أنت متأكد من إلغاء الاشتراك؟ سيتم إيقاف الخدمة عند نهاية الفترة الحالية.
        </p>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>رجوع</Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 5: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/dashboard/subscription/ src/components/subscription/
git commit -m "feat: subscription UI — show tier, change tier, cancel with confirmation"
```

---

### Task 4.3: Subscription API Routes

**Files:**
- Create: `src/app/api/subscriptions/route.ts`
- Create: `src/app/api/subscriptions/cancel/route.ts`
- Create: `src/app/api/subscriptions/change-tier/route.ts`

**Interfaces:**
- Consumes: payments.service.ts
- Produces: GET, POST routes

- [ ] **Step 1: Create GET /api/subscriptions**

```typescript
// src/app/api/subscriptions/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { getSubscription } from "@/modules/payments/payments.service";

export async function GET() {
  const user = await authenticateUser();
  const subscription = await getSubscription(user.id);
  return NextResponse.json(subscription);
}
```

- [ ] **Step 2: Create POST /api/subscriptions/cancel**

```typescript
// src/app/api/subscriptions/cancel/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { cancelSubscription } from "@/modules/payments/payments.service";

export async function POST(req: Request) {
  const user = await authenticateUser();
  const { reason } = await req.json();
  await cancelSubscription(user.id, reason);
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Create POST /api/subscriptions/change-tier**

```typescript
// src/app/api/subscriptions/change-tier/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { changeTier } from "@/modules/payments/payments.service";

export async function POST(req: Request) {
  const user = await authenticateUser();
  const { tier } = await req.json();
  await changeTier(user.id, tier);
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Add service functions for cancel and changeTier**

```typescript
// Add to payments.service.ts
export async function cancelSubscription(userId: string, reason?: string) {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription) throw new NotFoundError("Subscription");
  
  await prisma.subscription.update({
    where: { userId },
    data: { status: "CANCELLED", cancelledReason: reason },
  });
}

export async function changeTier(userId: string, tier: string) {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription) throw new NotFoundError("Subscription");
  
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);
  
  await prisma.subscription.update({
    where: { userId },
    data: { tier, expiresAt },
  });
}
```

- [ ] **Step 5: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/api/subscriptions/
git commit -m "feat: subscription API routes — GET, cancel, change-tier"
```

---

## Phase 5: Micro-sites

### Task 5.1: Subdomain Routing

**Files:**
- Modify: `src/middleware.ts`

**Interfaces:**
- Produces: Middleware that rewrites `*.wujood-app.vercel.app` to `/website/[slug]`

- [ ] **Step 1: Update middleware.ts**

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl;
  
  // Check if this is a subdomain request
  const subdomain = host.split(".")[0];
  
  if (subdomain && subdomain !== "www" && subdomain !== "wujood" && !host.includes("localhost")) {
    // Rewrite to website page
    url.pathname = `/website/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 2: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: subdomain routing — *.wujood-app.vercel.app rewrites to /website/[slug]"
```

---

### Task 5.2: Public Website

**Files:**
- Create: `src/app/website/[slug]/page.tsx`
- Create: `src/components/website/website-renderer.tsx`

**Interfaces:**
- Produces: Public website page

- [ ] **Step 1: Create website page**

```typescript
// src/app/website/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { WebsiteRenderer } from "@/components/website/website-renderer";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const website = await prisma.website.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });
  
  if (!website) return { title: "غير موجود" };
  
  return {
    title: website.title,
    description: website.description,
    openGraph: {
      title: website.title,
      description: website.description,
    },
  };
}

export default async function WebsitePage({ params }: PageProps) {
  const { slug } = await params;
  const website = await prisma.website.findUnique({
    where: { slug, published: true },
    include: { pages: true },
  });
  
  if (!website) notFound();
  
  return <WebsiteRenderer website={website} />;
}
```

- [ ] **Step 2: Create WebsiteRenderer component**

```typescript
// src/components/website/website-renderer.tsx
"use client";

interface Website {
  title: string;
  description?: string;
  pages: any[];
}

export function WebsiteRenderer({ website }: { website: Website }) {
  return (
    <div className="min-h-screen">
      <header className="p-8 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <h1 className="text-4xl font-bold">{website.title}</h1>
        {website.description && <p className="mt-2 text-lg opacity-90">{website.description}</p>}
      </header>
      
      <main className="container mx-auto py-8">
        {website.pages.map((page) => (
          <section key={page.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{page.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </section>
        ))}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/website/ src/components/website/
git commit -m "feat: public website page — renders published website by slug with SEO"
```

---

### Task 5.3: Dashboard Editor

**Files:**
- Create: `src/app/dashboard/website/page.tsx`
- Create: `src/components/website/website-editor.tsx`

**Interfaces:**
- Consumes: useQuery, useMutation
- Produces: Website configuration UI

- [ ] **Step 1: Create website dashboard page**

```typescript
// src/app/dashboard/website/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WebsiteEditor } from "@/components/website/website-editor";

export default function WebsiteDashboardPage() {
  const queryClient = useQueryClient();
  
  const { data: website, isLoading } = useQuery({
    queryKey: ["website"],
    queryFn: async () => {
      const res = await fetch("/api/website");
      if (!res.ok) throw new Error("Failed to fetch website");
      return res.json();
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/website", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update website");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["website"] });
    },
  });
  
  if (isLoading) return <div>جاري التحميل...</div>;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">إدارة الموقع</h1>
      <WebsiteEditor website={website} onSave={updateMutation.mutate} isPending={updateMutation.isPending} />
    </div>
  );
}
```

- [ ] **Step 2: Create WebsiteEditor component**

```typescript
// src/components/website/website-editor.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Website {
  id?: string;
  title: string;
  description?: string;
  slug?: string;
  published?: boolean;
}

export function WebsiteEditor({ website, onSave, isPending }: { website: Website; onSave: (data: Website) => void; isPending: boolean }) {
  const [formData, setFormData] = useState({
    title: website?.title || "",
    description: website?.description || "",
    slug: website?.slug || "",
    published: website?.published || false,
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات الموقع</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">اسم الموقع</label>
          <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">الوصف</label>
          <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">الرابط المختصر</label>
          <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="my-business" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
          <label htmlFor="published">نشر الموقع</label>
        </div>
        <Button onClick={() => onSave(formData)} disabled={isPending}>
          {isPending ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Create website API routes**

```typescript
// src/app/api/website/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await authenticateUser();
  const website = await prisma.website.findUnique({ where: { userId: user.id } });
  return NextResponse.json(website);
}

export async function PUT(req: Request) {
  const user = await authenticateUser();
  const data = await req.json();
  
  const website = await prisma.website.upsert({
    where: { userId: user.id },
    update: data,
    create: { ...data, userId: user.id },
  });
  
  return NextResponse.json(website);
}
```

- [ ] **Step 4: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/website/ src/components/website/ src/app/api/website/
git commit -m "feat: dashboard website editor — configure title, description, slug, publish status"
```

---

## Phase 6: Admin & Onboarding

### Task 6.1: Admin Panel

**Files:**
- Create: `src/app/dashboard/admin/page.tsx`
- Create: `src/components/admin/user-list.tsx`
- Create: `src/components/admin/payment-list.tsx`
- Create: `src/components/admin/stats-card.tsx`

**Interfaces:**
- Consumes: admin API routes
- Produces: Admin dashboard

- [ ] **Step 1: Create admin page**

```typescript
// src/app/dashboard/admin/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { UserList } from "@/components/admin/user-list";
import { PaymentList } from "@/components/admin/payment-list";
import { StatsCard } from "@/components/admin/stats-card";

export default function AdminPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard title="المستخدمون" value={stats?.totalUsers || 0} />
        <StatsCard title="المدفوعات" value={stats?.totalPayments || 0} />
        <StatsCard title="الإيرادات" value={stats?.totalRevenue || 0} suffix="جنيه" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserList />
        <PaymentList />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create StatsCard component**

```typescript
// src/components/admin/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCard({ title, value, suffix }: { title: string; value: number; suffix?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toLocaleString("ar-EG")} {suffix}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Create UserList component**

```typescript
// src/components/admin/user-list.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserList() {
  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>المستخدمون</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {users?.map((user: any) => (
            <div key={user.id} className="flex justify-between items-center p-2 border rounded">
              <span>{user.name || user.email}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Create PaymentList component**

Same pattern as UserList.

- [ ] **Step 5: Create admin API routes**

```typescript
// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await authenticateUser();
  // Add admin check here
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(users);
}

// src/app/api/admin/payments/route.ts
// Same pattern

// src/app/api/admin/stats/route.ts
export async function GET() {
  const user = await authenticateUser();
  // Add admin check here
  const [totalUsers, totalPayments, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.payment.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
  ]);
  return NextResponse.json({ totalUsers, totalPayments, totalRevenue: totalRevenue._sum.amount || 0 });
}
```

- [ ] **Step 6: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/dashboard/admin/ src/components/admin/ src/app/api/admin/
git commit -m "feat: admin panel — user list, payment list, stats dashboard"
```

---

### Task 6.2: Onboarding Wizard

**Files:**
- Create: `src/app/dashboard/onboarding/page.tsx`
- Create: `src/components/onboarding/step-company.tsx`
- Create: `src/components/onboarding/step-audit.tsx`
- Create: `src/components/onboarding/step-subscription.tsx`

**Interfaces:**
- Produces: Multi-step onboarding flow

- [ ] **Step 1: Create onboarding page**

```typescript
// src/app/dashboard/onboarding/page.tsx
"use client";

import { useState } from "react";
import { StepCompany } from "@/components/onboarding/step-company";
import { StepAudit } from "@/components/onboarding/step-audit";
import { StepSubscription } from "@/components/onboarding/step-subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { id: 1, title: "معلومات الشركة", component: StepCompany },
  { id: 2, title: "أول فحص", component: StepAudit },
  { id: 3, title: "اختر الخطة", component: StepSubscription },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState({});
  
  const CurrentStepComponent = steps.find((s) => s.id === currentStep)?.component;
  
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>مرحباً بك في وجد</CardTitle>
          <div className="flex gap-2 mt-4">
            {steps.map((step) => (
              <div key={step.id} className={`h-2 flex-1 rounded ${step.id <= currentStep ? "bg-teal-500" : "bg-gray-200"}`} />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {CurrentStepComponent && (
            <CurrentStepComponent
              data={data}
              onNext={(stepData: any) => {
                setData({ ...data, ...stepData });
                if (currentStep < steps.length) setCurrentStep(currentStep + 1);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Create StepCompany component**

```typescript
// src/components/onboarding/step-company.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function StepCompany({ data, onNext }: { data: any; onNext: (data: any) => void }) {
  const [name, setName] = useState(data.name || "");
  const [industry, setIndustry] = useState(data.industry || "");
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">أدخل معلومات شركتك</h2>
      <div>
        <label className="text-sm font-medium">اسم الشركة</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="شركتي" />
      </div>
      <div>
        <label className="text-sm font-medium">المجال</label>
        <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="التكنولوجيا" />
      </div>
      <Button onClick={() => onNext({ name, industry })} className="w-full">
        التالي
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Create StepAudit component**

```typescript
// src/components/onboarding/step-audit.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCreateAudit } from "@/hooks/use-audit";

export function StepAudit({ data, onNext }: { data: any; onNext: (data: any) => void }) {
  const [url, setUrl] = useState(data.url || "");
  const { mutate: createAudit, isPending } = useCreateAudit();
  
  const handleStart = () => {
    createAudit(url, { onSuccess: () => onNext({ url }) });
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">أول فحص لموقعك</h2>
      <p className="text-muted-foreground">أدخل رابط موقعك لفحصه</p>
      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
      <Button onClick={handleStart} disabled={!url || isPending} className="w-full">
        {isPending ? "جاري الفحص..." : "ابدأ الفحص"}
      </Button>
      <Button variant="ghost" onClick={() => onNext({})} className="w-full">
        تخطي
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Create StepSubscription component**

```typescript
// src/components/onboarding/step-subscription.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChangeTier } from "@/hooks/use-subscription";

const tiers = [
  { id: "kashif", name: "كاشف", price: 1250, features: ["5 فحوصات/يوم", "صفحة واحدة", "دعم عبر البريد"] },
  { id: "sane", name: "صانع", price: 2500, features: ["20 فحص/يوم", "10 صفحات", "دعم أولوية", "تقرير PDF"] },
  { id: "raed", name: "رائد", price: 4500, features: ["فحوصات غير محدودة", "صفحات غير محدودة", "دعم مباشر", "تقرير PDF", "تخصيص كامل"] },
];

export function StepSubscription({ data, onNext }: { data: any; onNext: (data: any) => void }) {
  const { mutate: changeTier, isPending } = useChangeTier();
  
  const handleSelect = (tierId: string) => {
    changeTier(tierId, { onSuccess: () => onNext({ tier: tierId }) });
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">اختر خطتك</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <Card key={tier.id} className="cursor-pointer hover:border-teal-500" onClick={() => handleSelect(tier.id)}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <p className="text-2xl font-bold">{tier.price} جنيه/شهر</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button variant="ghost" onClick={() => onNext({})} className="w-full">
        تخطي
      </Button>
    </div>
  );
}
```

- [ ] **Step 5: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/dashboard/onboarding/ src/components/onboarding/
git commit -m "feat: onboarding wizard — company info, first audit, subscription selection"
```

---

### Task 6.3: Email Notifications

**Files:**
- Modify: `src/modules/email/email.service.ts`
- Create: `src/modules/email/templates/welcome.ts`
- Create: `src/modules/email/templates/audit-complete.ts`
- Create: `src/modules/email/templates/payment-confirmed.ts`

**Interfaces:**
- Consumes: Resend
- Produces: Email sending functions

- [ ] **Step 1: Create email templates**

```typescript
// src/modules/email/templates/welcome.ts
export function welcomeEmail(name: string) {
  return {
    subject: "مرحباً بك في وجد",
    html: `
      <div dir="rtl" style="font-family: sans-serif;">
        <h1>مرحباً ${name}</h1>
        <p>شكراً لك للانضمام إلى وجد. نحن سعداء بوجودك معنا.</p>
        <p>ابدأ الآن بفحص موقعك وتحسين حضورك الرقمي.</p>
      </div>
    `,
  };
}

// src/modules/email/templates/audit-complete.ts
export function auditCompleteEmail(userName: string, score: number) {
  return {
    subject: "فحص موقعك مكتمل",
    html: `
      <div dir="rtl" style="font-family: sans-serif;">
        <h1>فحص موقعك مكتمل</h1>
        <p>مرحباً ${userName}</p>
        <p>نتيجة فحص موقعك: <strong>${score}/100</strong></p>
        <p>قم بتسجيل الدخول لعرض التفاصيل والتوصيات.</p>
      </div>
    `,
  };
}

// src/modules/email/templates/payment-confirmed.ts
export function paymentConfirmedEmail(userName: string, amount: number, tier: string) {
  return {
    subject: "تم تأكيد الدفع",
    html: `
      <div dir="rtl" style="font-family: sans-serif;">
        <h1>تم تأكيد الدفع</h1>
        <p>مرحباً ${userName}</p>
        <p>تم تأكيد دفعك بمبلغ ${amount} جنيه.</p>
        <p>اشتراكك الآن نشط بالخطة: ${tier}</p>
      </div>
    `,
  };
}
```

- [ ] **Step 2: Update email.service.ts**

```typescript
// src/modules/email/email.service.ts
import { Resend } from "resend";
import { welcomeEmail } from "./templates/welcome";
import { auditCompleteEmail } from "./templates/audit-complete";
import { paymentConfirmedEmail } from "./templates/payment-confirmed";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  const { subject, html } = welcomeEmail(name);
  await resend.emails.send({ from: "noreply@wujood.app", to, subject, html });
}

export async function sendAuditCompleteEmail(to: string, userName: string, score: number) {
  const { subject, html } = auditCompleteEmail(userName, score);
  await resend.emails.send({ from: "noreply@wujood.app", to, subject, html });
}

export async function sendPaymentConfirmedEmail(to: string, userName: string, amount: number, tier: string) {
  const { subject, html } = paymentConfirmedEmail(userName, amount, tier);
  await resend.emails.send({ from: "noreply@wujood.app", to, subject, html });
}
```

- [ ] **Step 3: Integrate emails into auth and payments flows**

Add `sendWelcomeEmail` call after user registration.
Add `sendAuditCompleteEmail` call after audit completion.
Add `sendPaymentConfirmedEmail` call after payment success.

- [ ] **Step 4: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/email/
git commit -m "feat: email notifications — welcome, audit-complete, payment-confirmed templates"
```

---

## Phase 7: Blog & WhatsApp & Arabic

### Task 7.1: Blog

**Files:**
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/app/dashboard/blog/page.tsx`
- Create: `src/app/api/blog/route.ts`
- Create: `src/app/api/blog/[id]/route.ts`

**Interfaces:**
- Produces: Blog CRUD

- [ ] **Step 1: Create blog public listing page**

```typescript
// src/app/blog/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">المدونة</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:border-teal-500">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create blog single post page**

```typescript
// src/app/blog/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  
  if (!post) notFound();
  
  return (
    <article className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <time className="text-muted-foreground">{new Date(post.createdAt).toLocaleDateString("ar-EG")}</time>
      <div className="prose prose-lg mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

- [ ] **Step 3: Create blog dashboard page**

```typescript
// src/app/dashboard/blog/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlogDashboardPage() {
  const queryClient = useQueryClient();
  
  const { data: posts } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/blog/${id}`, { method: "DELETE" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المدونة</h1>
        <Link href="/dashboard/blog/new">
          <Button>إضافة منشور</Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {posts?.map((post: any) => (
          <Card key={post.id}>
            <CardContent className="flex justify-between items-center py-4">
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.published ? "منشور" : "مسودة"}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/blog/${post.id}`}>
                  <Button variant="outline" size="sm">تعديل</Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(post.id)}>
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create blog API routes**

```typescript
// src/app/api/blog/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const user = await authenticateUser();
  const { title, slug, content, excerpt, published } = await req.json();
  
  const post = await prisma.blogPost.create({
    data: { title, slug, content, excerpt, published, authorId: user.id },
  });
  
  return NextResponse.json(post, { status: 201 });
}

// src/app/api/blog/[id]/route.ts
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await authenticateUser();
  const { id } = await params;
  const data = await req.json();
  
  const post = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json(post);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 5: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/blog/ src/app/dashboard/blog/ src/app/api/blog/
git commit -m "feat: blog — public listing, single post, dashboard CRUD, API routes"
```

---

### Task 7.2: WhatsApp

**Files:**
- Create: `src/app/api/whatsapp/send/route.ts`
- Create: `src/app/dashboard/whatsapp/page.tsx`
- Create: `src/components/whatsapp/template-form.tsx`

**Interfaces:**
- Consumes: Twilio
- Produces: WhatsApp messaging

- [ ] **Step 1: Create WhatsApp send endpoint**

```typescript
// src/app/api/whatsapp/send/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  const user = await authenticateUser();
  const { to, message } = await req.json();
  
  await client.messages.create({
    body: message,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
  });
  
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Create WhatsApp dashboard page**

```typescript
// src/app/dashboard/whatsapp/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateForm } from "@/components/whatsapp/template-form";

export default function WhatsAppPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">WhatsApp</h1>
      <Card>
        <CardHeader>
          <CardTitle>إرسال رسالة</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm />
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Create TemplateForm component**

```typescript
// src/components/whatsapp/template-form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function TemplateForm() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const handleSend = async () => {
    setSending(true);
    await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message }),
    });
    setSending(false);
    setTo("");
    setMessage("");
  };
  
  return (
    <div className="space-y-4">
      <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="+20..." />
      <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="الرسالة" />
      <Button onClick={handleSend} disabled={!to || !message || sending} className="w-full">
        {sending ? "جاري الإرسال..." : "إرسال"}
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/whatsapp/ src/app/dashboard/whatsapp/ src/components/whatsapp/
git commit -m "feat: WhatsApp integration — send messages via Twilio, dashboard UI"
```

---

### Task 7.3: Arabic Polish

**Files:**
- Modify: All new pages created in Phases 4-7
- Create: `src/lib/i18n.ts` (update if exists)

**Interfaces:**
- Produces: RTL support, Arabic translations

- [ ] **Step 1: Update i18n.ts with new translations**

```typescript
// src/lib/i18n.ts
export const translations = {
  subscription: {
    title: "الاشتراك",
    currentPlan: "الخطة الحالية",
    changePlan: "تغيير الخطة",
    cancel: "إلغاء الاشتراك",
    active: "نشط",
    inactive: "غير نشط",
    expiresAt: "تاريخ الانتهاء",
  },
  admin: {
    title: "لوحة التحكم",
    users: "المستخدمون",
    payments: "المدفوعات",
    revenue: "الإيرادات",
  },
  onboarding: {
    welcome: "مرحباً بك في وجد",
    companyInfo: "معلومات الشركة",
    firstAudit: "أول فحص",
    choosePlan: "اختر خطة",
  },
  blog: {
    title: "المدونة",
    newPost: "إضافة منشور",
    edit: "تعديل",
    delete: "حذف",
    published: "منشور",
    draft: "مسودة",
  },
  whatsapp: {
    title: "WhatsApp",
    sendMessage: "إرسال رسالة",
    sending: "جاري الإرسال...",
  },
};
```

- [ ] **Step 2: Verify RTL in all new pages**

Ensure all new pages have `dir="rtl"` or use RTL-aware layouts.

- [ ] **Step 3: Run lint and typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat: Arabic polish — translations for new features, RTL verification"
```

---

## Phase 8: Production Readiness

### Task 8.1: Supabase Reactivation

**Files:**
- Verify: `.env.local` has correct database URL
- Run: `npx prisma db push`

- [ ] **Step 1: Verify Supabase connection**

Run: `npx prisma db push --accept-data-loss`
Expected: Schema synced successfully

- [ ] **Step 2: Run seed if needed**

Run: `npm run db:seed`
Expected: Seed data inserted

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "chore: verify Supabase reactivation"
```

---

### Task 8.2: Vercel Deployment

**Files:**
- Verify: `vercel.json` is correct
- Verify: Environment variables are set

- [ ] **Step 1: Check vercel.json**

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs"
}
```

- [ ] **Step 2: Set environment variables in Vercel**

Required:
- `DATABASE_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`
- `QSTASH_TOKEN`
- `QSTASH_SIGNING_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_APP_URL`

- [ ] **Step 3: Deploy to Vercel**

Run: `vercel --prod`

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "chore: configure Vercel deployment"
```

---

### Task 8.3: Testing

**Files:**
- Create: `src/modules/catalog/__tests__/catalog.service.test.ts`
- Create: `src/modules/reviews/__tests__/reviews.service.test.ts`
- Create: `src/app/api/__tests__/audit.test.ts`

**Interfaces:**
- Produces: Unit and integration tests

- [ ] **Step 1: Create catalog service test**

```typescript
// src/modules/catalog/__tests__/catalog.service.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { getCatalogItems, createCatalogItem } from "../catalog.service";
import { prisma } from "@/lib/prisma";

describe("Catalog Service", () => {
  beforeEach(async () => {
    await prisma.catalogItem.deleteMany();
  });

  it("should create a catalog item", async () => {
    const item = await createCatalogItem("user-1", {
      name: "Test Product",
      price: 100,
    });

    expect(item.name).toBe("Test Product");
    expect(item.price).toBe(100);
  });

  it("should get catalog items for user", async () => {
    await createCatalogItem("user-1", { name: "Item 1", price: 100 });
    await createCatalogItem("user-1", { name: "Item 2", price: 200 });

    const items = await getCatalogItems("user-1");
    expect(items).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Create reviews service test**

Same pattern.

- [ ] **Step 3: Create audit API integration test**

```typescript
// src/app/api/__tests__/audit.test.ts
import { describe, it, expect } from "vitest";
import { validateUrl } from "@/lib/url-validation";

describe("SSRF Protection", () => {
  it("should reject private IPs", () => {
    expect(() => validateUrl("http://192.168.1.1")).toThrow("Private/internal URLs are not allowed");
  });

  it("should reject localhost", () => {
    expect(() => validateUrl("http://localhost")).toThrow("Private/internal URLs are not allowed");
  });

  it("should accept public URLs", () => {
    expect(() => validateUrl("https://example.com")).not.toThrow();
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/modules/catalog/__tests__/ src/modules/reviews/__tests__/ src/app/api/__tests__/
git commit -m "test: unit tests for catalog, reviews, SSRF protection"
```

---

### Task 8.4: Monitoring

**Files:**
- Install: `@sentry/nextjs`
- Create: `sentry.client.config.ts`
- Create: `sentry.server.config.ts`
- Create: `sentry.edge.config.ts`

**Interfaces:**
- Produces: Error tracking setup

- [ ] **Step 1: Install Sentry**

Run: `npx @sentry/wizard@latest -i nextjs`

- [ ] **Step 2: Configure Sentry DSN**

Set `SENTRY_DSN` in environment variables.

- [ ] **Step 3: Verify Sentry is working**

Trigger a test error and verify it appears in Sentry dashboard.

- [ ] **Step 4: Commit**

```bash
git add sentry.*.config.ts
git commit -m "feat: Sentry error tracking setup"
```

---

## Final Verification

- [ ] Run full test suite: `npm test`
- [ ] Run lint: `npm run lint`
- [ ] Run typecheck: `npx tsc --noEmit`
- [ ] Build: `npm run build`
- [ ] Deploy to Vercel
- [ ] Verify all pages load
- [ ] Verify all features work
- [ ] Check emails are sending
- [ ] Check background jobs are running
- [ ] Verify SSRF protection blocks private IPs
- [ ] Verify rate limiting works
- [ ] Verify payment flow end-to-end

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 6 | Architecture Foundation |
| 2 | 3 | Background Jobs |
| 3 | 4 | UI Upgrade |
| 4 | 3 | Payments & Subscriptions |
| 5 | 3 | Micro-sites |
| 6 | 3 | Admin & Onboarding |
| 7 | 3 | Blog & WhatsApp & Arabic |
| 8 | 4 | Production Readiness |
| **Total** | **29** | **Full rebuild** |
