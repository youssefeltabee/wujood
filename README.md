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

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Login
│   ├── register/             # Register
│   ├── dashboard/            # Dashboard (protected)
│   ├── audit/[id]/           # Audit report (protected)
│   └── api/                  # API routes
├── components/audit/         # Audit UI components
├── config/site.ts            # Tiers, pricing, labels
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── auth.ts               # JWT + bcrypt
│   └── audit/
│       ├── scanner.ts        # URL scanner (10 categories)
│       ├── scorer.ts         # Scoring algorithm
│       └── report.tsx        # PDF generator
└── middleware.ts             # Auth middleware
```

## License

Private — Wujood Inc.
