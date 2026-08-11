# Wujood 9-Gap Implementation Plan

## Stream A: Payments & Subscriptions
- Subscription billing: link Fawry payments to Subscription model, auto-extend on payment completion
- Subscription self-serve UI: `/dashboard/subscription/page.tsx` — show tier, status, cancel/change
- API routes: `GET /api/subscriptions`, `POST /api/subscriptions/cancel`, `POST /api/subscriptions/change-tier`

## Stream B: Micro-sites
- Subdomain routing in middleware: `*.wujood.vercel.app` → look up Website by slug, rewrite to `/website/[slug]`
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

## Stream E: Pre-Launch Audit Checklist (20 items)

### SEO & Metadata
- E.1 unique page titles
- E.2 meta descriptions
- E.3 social share img (OG image)
- E.4 alt txt on images
- E.5 local schema (structured data)
- E.6 internal links
- E.7 robots.txt

### Conversion & UX
- E.8 CTA above the fold
- E.9 sticky mobile CTA
- E.10 5 FAQ's
- E.11 response time promise
- E.12 breadcrumbs
- E.13 custom 404 page
- E.14 thank you page

### Trust & Social Proof
- E.15 real reviews
- E.16 case studies
- E.17 team photo
- E.18 maps + directions

### Compliance & Analytics
- E.19 PP page (Privacy Policy)
- E.20 google analytics
