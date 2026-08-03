# Task 3.1 — shadcn/ui Setup

**Status:** DONE_WITH_CONCERNS

## What was done

### 1. Initialized shadcn/ui
- Ran `npx shadcn@latest init -d` — CLI detected Next.js 16 + Tailwind CSS v4 successfully
- Created `components.json` (style: base-nova, baseColor: neutral, iconLibrary: lucide)
- Updated `src/lib/utils.ts` with proper `cn` helper using `clsx` + `tailwind-merge`
- Updated `src/app/globals.css` with shadcn theme variables and CSS layer base styles

### 2. Installed dependencies via shadcn CLI
New packages added to `package.json`:
- `clsx` ^2.1.1
- `tailwind-merge` ^3.6.0
- `class-variance-authority` ^0.7.1
- `@base-ui/react` ^1.6.0
- `tw-animate-css` ^1.4.0
- `shadcn` ^4.16.1

### 3. Created shadcn components
All in `src/components/ui/`:

| File | Component | Notes |
|------|-----------|-------|
| `dialog.tsx` | Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger, DialogClose, DialogOverlay, DialogPortal | Created by shadcn CLI; patched to use custom Button API |
| `sonner.tsx` | Toaster | Created by shadcn CLI; patched to remove `next-themes` dependency (hardcoded dark theme) |
| `shadcn-input.tsx` | ShadcnInput | Manual — shadcn CLI would overwrite custom Input.tsx |
| `shadcn-badge.tsx` | ShadcnBadge | Manual — same |
| `shadcn-card.tsx` | ShadcnCard, ShadcnCardHeader, ShadcnCardFooter, ShadcnCardTitle, ShadcnCardDescription, ShadcnCardContent | Manual — same |
| `shadcn-tabs.tsx` | ShadcnTabs, ShadcnTabsList, ShadcnTabsTrigger, ShadcnTabsContent | Manual — uses @base-ui/react/tabs |
| `shadcn-tooltip.tsx` | ShadcnTooltip, ShadcnTooltipTrigger, ShadcnTooltipContent, ShadcnTooltipProvider | Manual — uses @base-ui/react/tooltip |
| `shadcn-skeleton.tsx` | ShadcnSkeleton | Manual — same |
| `shadcn-select.tsx` | ShadcnSelect, ShadcnSelectContent, ShadcnSelectItem, ShadcnSelectLabel, ShadcnSelectSeparator, ShadcnSelectTrigger | Manual — uses @base-ui/react/select |

### 4. Updated barrel exports
`src/components/ui/index.ts` — all shadcn components exported with `Shadcn` prefix (except Dialog/Toaster which have no naming conflict).

### 5. Verification
- `npm run lint` — PASS (58 pre-existing errors, zero new)
- `npx tsc --noEmit` — PASS (zero errors)

## Concerns

1. **shadcn CLI overwrites existing files on Windows** — Windows is case-insensitive, so `button.tsx` and `Button.tsx` are the same file. The CLI overwrote the custom `Button.tsx` twice. Had to restore it manually. Same would happen with Input, Badge, Card, Tabs, Tooltip, Skeleton. That's why those were created as `shadcn-*.tsx`.

2. **dialog.tsx uses shadcn's Button API internally** — The close button uses `variant="ghost"` and `variant="outline"` which don't exist on the custom Button. Patched to use `variant="secondary"` and inline size classes. If the custom Button is later replaced with shadcn's, the dialog will need updating.

3. **sonner.tsx hardcodes `theme="dark"`** — Removed `next-themes` dependency since the project doesn't use ThemeProvider. If a light theme is added later, this needs revisiting.

4. **Select.Root.Props requires generic type args** — Used `Record<string, unknown>` as a workaround. Not ideal for type safety but avoids generic complexity.

## Files created/modified

| File | Action |
|------|--------|
| `components.json` | Created |
| `src/lib/utils.ts` | Modified (replaced cn helper) |
| `src/app/globals.css` | Modified (added shadcn imports + theme) |
| `package.json` | Modified (new deps) |
| `package-lock.json` | Modified |
| `src/components/ui/dialog.tsx` | Created |
| `src/components/ui/sonner.tsx` | Created |
| `src/components/ui/shadcn-input.tsx` | Created |
| `src/components/ui/shadcn-badge.tsx` | Created |
| `src/components/ui/shadcn-card.tsx` | Created |
| `src/components/ui/shadcn-tabs.tsx` | Created |
| `src/components/ui/shadcn-tooltip.tsx` | Created |
| `src/components/ui/shadcn-skeleton.tsx` | Created |
| `src/components/ui/shadcn-select.tsx` | Created |
| `src/components/ui/index.ts` | Modified (added shadcn exports) |
| `src/components/ui/Button.tsx` | Restored (was overwritten by CLI) |
