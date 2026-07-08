# Task 3 — Fix hardcoded colors to CSS variables

**Status:** DONE

## Changes

### `src/app/globals.css`
Added 4 CSS variable tokens inside `@theme` block:
- `--color-score-low: #ef4444`
- `--color-score-midlow: #f97316`
- `--color-score-mid: #eab308`
- `--color-score-high: #22c55e`

### `src/components/ui/HeroIllustration.tsx`
- Added `barFillClass` function mapping percentage to `bg-score-*` utility classes
- Replaced inline `backgroundColor` hex values with className-based approach
- Inline style now only sets `width`

### `src/components/audit/ScoreCard.tsx`
- Changed `levelColor` from `bg-red-500` / `bg-orange-500` / `bg-yellow-500` / `bg-green-500` to `bg-score-low` / `bg-score-midlow` / `bg-score-mid` / `bg-score-high`

### `src/components/audit/CategoryBreakdown.tsx`
- Changed `barColor` from `bg-red-500` / `bg-orange-500` / `bg-yellow-500` / `bg-green-500` to `bg-score-low` / `bg-score-midlow` / `bg-score-mid` / `bg-score-high`

## Build Result
- Turbopack compilation: **passed**
- TypeScript check: **failed** on pre-existing issue in `prisma/seed.ts:1` (`PrismaClient` import error) — unrelated to these changes
