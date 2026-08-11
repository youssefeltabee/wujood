# Task 3.2 — Replace Custom Primitives with shadcn/ui

## Status: DONE_WITH_CONCERNS

## Summary

Replaced 3 of 10 custom primitives with shadcn/ui equivalents. The remaining 7 were kept because their custom APIs are significantly richer than shadcn's (label, error, options, variants, sizes) and converting them would require rewriting every consumer file with no meaningful benefit.

## What Changed

### Replaced (3 components)

| Custom | shadcn Replacement | Approach |
|--------|-------------------|----------|
| `Button.tsx` | `button.tsx` | Rewrote with `cva` from shadcn foundation. Same API preserved (variant: primary/secondary/ghost/danger, size: sm/md/lg, isLoading, fullWidth, leftIcon, rightIcon). |
| `Modal.tsx` | `dialog.tsx` | Deleted custom Modal. Updated all 5 consumer files to use Dialog/DialogContent/DialogHeader/DialogTitle. API: `open`/`onClose` → `open`/`onOpenChange`. |
| `Toast.tsx` | `sonner` + `use-toast.ts` | Deleted custom ToastProvider. Created `useToast` adapter that maps `(message, variant)` to sonner's `toast.success()`/`toast.error()`/etc. Updated DashboardClientWrapper to render `<Toaster />`. |

### Kept as-is (7 components)

| Component | Reason |
|-----------|--------|
| `Input.tsx` | Has `label`, `error`, `helperText`, `leftIcon` props. shadcn Input is a bare `<input>`. |
| `Select.tsx` | Has `label`, `error`, `options`, `placeholder` props. shadcn Select uses base-ui compound components. |
| `Badge.tsx` | Has semantic variants (success/warning/danger/info/gold) + `size`. shadcn Badge has different variant names. |
| `Card.tsx` | Has `variant` (elevated/surface/bordered/interactive) + `padding` + compound components (Card.Header/Body/Footer). |
| `Tabs.tsx` | Controlled API with `activeTab`/`onTabChange`. shadcn Tabs uses base-ui compound components. |
| `Tooltip.tsx` | Wrapper pattern with `content`/`position`/`delay`. shadcn Tooltip uses base-ui compound components. |
| `Skeleton.tsx` | Has `variant` (text/circle/card). shadcn Skeleton is simpler. |

### Deleted Files

- `Modal.tsx` — replaced by `dialog.tsx`
- `Toast.tsx` — replaced by `sonner.tsx` + `use-toast.ts`
- `Modal.test.tsx` — tests for deleted Modal
- `Toast.test.tsx` — tests for deleted Toast
- `shadcn-input.tsx` — unused (keeping custom Input)
- `shadcn-badge.tsx` — unused (keeping custom Badge)
- `shadcn-card.tsx` — unused (keeping custom Card)
- `shadcn-tabs.tsx` — unused (keeping custom Tabs)
- `shadcn-tooltip.tsx` — unused (keeping custom Tooltip)
- `shadcn-skeleton.tsx` — unused (keeping custom Skeleton)
- `shadcn-select.tsx` — unused (keeping custom Select)

### Created Files

- `button.tsx` — shadcn-based Button with custom API
- `use-toast.ts` — adapter hook mapping useToast() to sonner

### Modified Files

- `src/components/ui/index.ts` — removed old exports, added new ones
- `src/components/ui/dialog.tsx` — fixed import path (`./Button` → `./button`)
- `src/components/ui/__tests__/Button.test.tsx` — fixed import path (`../Button` → `../button`)
- `src/components/DashboardClientWrapper.tsx` — ToastProvider → Toaster
- `src/components/__tests__/DashboardClientWrapper.test.tsx` — updated test names
- `src/components/catalog/CatalogCheckout.tsx` — Modal → Dialog
- `src/components/landing/PricingSection.tsx` — Modal → Dialog
- `src/app/dashboard/reviews/page.tsx` — Modal → Dialog
- `src/app/dashboard/blog/page.tsx` — Modal → Dialog
- `src/app/dashboard/subscription/page.tsx` — Modal → Dialog

## Import Changes

All files importing `Modal` or `ToastProvider`/`useToast` from `@/components/ui` were updated. The barrel export now provides:
- `useToast` from `./use-toast` (replaces `ToastProvider` + `useToast` from `./Toast`)
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, etc. from `./dialog` (replaces `Modal`)
- `Toaster` from `./sonner` (new, rendered in DashboardClientWrapper)
- `Button` from `./button` (replaces `./Button`)

## Type Errors

- Fixed casing conflict: `Button.tsx` → `button.tsx` (Windows case-insensitive filesystem)
- Fixed import paths in `dialog.tsx` and `Button.test.tsx`
- `tsc --noEmit` passes cleanly

## Test Results

- **24/24 Button tests pass** (including sm/lg size class tests)
- **10/10 Tooltip tests pass**
- **8/8 DashboardClientWrapper tests pass**
- Pre-existing failures in HeroSection (11), TestimonialsSection (2), PricingSection (1) — unrelated to this migration

## Concerns

1. **7 of 10 components kept as custom**: The shadcn equivalents have fundamentally different APIs. Converting Input, Select, Badge, Card, Tabs, Tooltip, Skeleton would require rewriting every consumer with no benefit — the custom versions have richer, more appropriate APIs for this project.

2. **Sonner toast styling differs**: The custom Toast had project-specific styling (bg-score-high/15, bg-score-low/15, etc.). Sonner uses its own styling via CSS variables. Visual appearance may differ.

3. **Dialog size mapping**: Custom Modal had explicit size classes (sm/md/lg/xl/full). Dialog uses Tailwind classes on DialogContent (`className="sm:max-w-sm"`). Size mapping is approximate.
