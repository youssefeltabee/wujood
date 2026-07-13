# Wujood 9-Gap Implementation Plan

## Stream A: Payments & Subscriptions
- Subscription billing: link Fawry payments to Subscription model, auto-extend on payment completion
- Subscription self-serve UI: `/dashboard/subscription/page.tsx` — show tier, status, cancel/change
- API routes: `GET /api/subscriptions`, `POST /api/subscriptions/cancel`, `POST /api/subscriptions/change-tier`

## Stream B: Micro-sites
- Subdomain routing in middleware: `*.wujood-app.vercel.app` → look up Website by slug, rewrite to `/website/[slug]`
- Public website page: `src/app/website/[slug]/page.tsx` — renders published website content
- Dashboard website editor: `/dashboard/website/page.tsx` — configure title, colors, publish

## Stream C: Admin & Onboarding & Email
- Admin panel: `/dashboard/admin/page.tsx` — user list, payment list, basic stats
- Admin API: `GET /api/admin/users`, `GET /api/admin/payments`, `GET /api/admin/stats`
- Onboarding wizard: `/dashboard/onboarding/page.tsx` — first-time user flow (company info, first audit)
- Email notifications: `src/modules/email/email.service.ts` — resend/nodemailer wrapper for audit-complete, welcome, payment-confirmed

## Stream D: Blog & WhatsApp & Arabic
- Blog public pages: `src/app/blog/page.tsx` (listing), `src/app/blog/[slug]/page.tsx` (single post)
- Blog dashboard: `/dashboard/blog/page.tsx` — CRUD posts
- Blog API: `GET/POST /api/blog`, `PUT/DELETE /api/blog/[id]`
- WhatsApp send message: `POST /api/whatsapp/send` — sends via Twilio/WhatsApp Business API
- WhatsApp templates page: `/dashboard/whatsapp/page.tsx` — manage templates
- Arabic polish: RTL support in landing page, Arabic translations for key strings
