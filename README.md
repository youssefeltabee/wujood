# Wujood (وجود)

From Digital Ghost to Digital Presence. All-in-one digital presence platform for Egyptian SMEs.

## Stack

- **Framework**: Next.js 16 + TypeScript
- **Styling**: Tailwind CSS 4
- **Database ORM**: Prisma 6 + PostgreSQL
- **Auth**: JWT + bcrypt
- **Hosting**: Vercel (recommended)

## Setup

### 1. Database

Create a free PostgreSQL database at [neon.tech](https://neon.tech) (no credit card needed). Copy the connection string.

### 2. Environment

Create `.env` in the project root:

```
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/wujood?sslmode=require"
JWT_SECRET="generate-a-random-secret-string"
```

### 3. Push schema & seed

```bash
npm install
npx prisma db push
```

### 4. Run

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
```

### 5. Deploy

Push to GitHub, connect repo to Vercel, add `DATABASE_URL` and `JWT_SECRET` as environment variables in Vercel dashboard.

## Modules

| Module | API Routes | Dashboard Page | Status |
|--------|-----------|----------------|--------|
| Auth | `/api/auth/*` | Login / Register | ✅ |
| Audit | `/api/audit/*` | Dashboard + `/audit/[id]` | ✅ |
| Social Commander | `/api/social/*` | `/dashboard/social` | ✅ |
| Catalog Builder | `/api/catalog/*` | `/dashboard/catalog` | ✅ |
| Review System | `/api/reviews/*` | `/dashboard/reviews` | ✅ |
| AI Chatbot | `/api/chat/*` | `/dashboard/chat` | ✅ |
| E-commerce | `/api/payments/*` | On catalog items | ✅ |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Login
│   ├── register/             # Register
│   ├── dashboard/            # Dashboard + sub-pages
│   │   ├── page.tsx          # Main dashboard
│   │   ├── social/           # Social Commander
│   │   ├── catalog/          # Catalog Builder
│   │   ├── reviews/          # Review System
│   │   └── chat/             # AI Chatbot
│   ├── audit/[id]/           # Audit report (protected)
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # 12 primitives (Button, Card, Modal, etc.)
│   ├── audit/                # Audit UI components
│   └── catalog/              # Catalog checkout
├── config/site.ts            # Tiers, pricing, labels
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── cache.ts              # Memory cache with TTL
│   └── utils.ts              # cn() utility
├── modules/
│   ├── auth/                 # Auth controllers + service
│   ├── audit/                # Scanner, scorer, controller
│   ├── social/               # Social accounts + posts controller
│   ├── catalog/              # Catalog controller
│   ├── reviews/              # Reviews controller
│   ├── chat/                 # Chat controller + OpenAI service
│   └── payments/             # Fawry controller
└── middleware.ts             # Auth middleware
```

## Environment

```env
DATABASE_URL="postgresql://user:password@host/wujood?sslmode=require"
JWT_SECRET="generate-a-random-secret-string"

# Optional — mock fallback when not set:
OPENAI_API_KEY=            # AI Chatbot → uses mock responses
FAWRY_MERCHANT_CODE=       # Fawry payments → mock mode
FAWRY_SECURITY_KEY=        # Fawry payments → mock mode
```

## License

Private — Wujood Inc.
