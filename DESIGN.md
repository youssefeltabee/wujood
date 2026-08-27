# Wujood — Dark Luxe Cairo Design System

> Agent constraint file. Every UI prompt must follow this before generating or editing. Run the 10-point audit before marking done.

## Palette — one accent, one surface system
- Surfaces: `bg-primary #0A0A0A` → `bg-surface #1A1A1A` → `bg-elevated #242424` → `bg-card #161616`. Exactly 3 elevated levels + border `border-subtle #2A2A2A`. No extra grays.
- Accents: **Gold #D4A853** primary, **Cyan #00C9B7** secondary. Gold for CTAs/highlights (≤3 uses above the fold). Cyan only for secondary badges. No purple/blue gradients. No violet-to-fuchsia mesh.
- Text: `text-primary #FFFFFF`, `text-secondary #8B8B8B`, `text-muted #555555`.

## Typography — intentional, not Inter
- Display/headings: `Cairo` (--font-cairo). UI/body: `DM Sans` (--font-dm-sans) + Cairo fallback. Never Inter/system-ui by accident.
- Ramp: 14 / 16 / 20 / 28 / 40. Body 16px/1.6. Headings semibold only. Max paragraph width 65ch. Two weights max in marketing sections.
- Arabic is first-class: RTL via `dir`, logical properties only. Test both locales after every landing edit.

## Spacing
- Use standard Tailwind spacing (4 = 1rem). Do not define `--spacing-xs/lg` style tokens — they hijack `max-w-*` utilities (incident 2026-08-26). Existing tokens: `--spacing-nav-height 64px`, `--spacing-section 6rem`.

## Layout — break the 3-card grid
- Hero must have a point of view: asymmetric, editorial headline, real product UI (HeroMockup with score ring), not interchangeable gradient. Swap-test: competitor logo must not fit.
- Feature sections vary: one bento, one side-by-side, one list. Never three identical card rows.
- Whitespace is earned: airy, not dense slide-deck. Mobile is designed, not shrunk — primary CTA visible without scrolling.

## Motion — one idea, not a theme park
- One motion concept per page. Current: `rise-up` fade (marketing), `count-flash` for stats. No concurrent blob + pulse + shimmer + stagger on same viewport.
- Durations 150–300ms for micro-interactions. Nothing loops forever. Respect `prefers-reduced-motion: reduce` (already gated in globals.css).
- If motion disabled, page still looks complete.

## Copy — Egyptian SME specific
- Headlines state a specific outcome for Egyptian SMEs (WhatsApp, EGP, Cairo). No "empowering businesses with innovative solutions."
- Feature bullets are falsifiable and verifiable in UI. CTA labels are verbs with objects (e.g., "See Your Score" not "Get started" alone).

## Components — limited variants
- One button style (gold primary), one card style (card-lux + glass-panel), one input style. No variant explosion.
- Icons: Lucide, 16–20px consistent stroke. No emoji as icons.

## Anti-patterns (hard bans)
- No purple/blue gradient hero
- No Inter default font
- No three equal feature cards
- No emoji icons
- No infinite looping animations
- No `max-w-*` via custom spacing tokens
- No hardcoded locale strings outside `src/lib/i18n.tsx`

## 10-point pre-ship audit — must be 10/10
| # | Question | Pass |
|---|----------|------|
| 1 | Squint at 50%: hierarchy obvious? |  |
| 2 | Swap test: competitor logo fails? |  |
| 3 | Can you name typefaces + why? |  |
| 4 | Accent ≤3 uses above fold? |  |
| 5 | Disable animations: still good? |  |
| 6 | Headline mentions Wujood's actual job? |  |
| 7 | Mobile: primary CTA visible without scroll? |  |
| 8 | Re-prompt "remove gradients/generic patterns": little changes? |  |
| 9 | No vibe-coded tells (7 tells) remain? |  |
| 10 | Both locales render without strips/overlaps? |  |

Reference: Agent-Design Anti-Slop Checklist (2026-07-04), OhhWells 7 Tells, Reddit 7 Steps.
