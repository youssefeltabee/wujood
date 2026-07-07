### Task 1: Theme — New CSS variables + dark base

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite globals.css with dark luxe theme**

Replace cream/teal/terracotta palette with dark/gold/cyan. Keep animation keyframes, replace color references.

New theme tokens:
```css
@theme {
  --font-heading: var(--font-cairo), system-ui, sans-serif;
  --font-body: var(--font-dm-sans), var(--font-cairo), system-ui, sans-serif;
  --color-bg-primary: #0A0A0A;
  --color-bg-surface: #1A1A1A;
  --color-bg-elevated: #242424;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #8B8B8B;
  --color-text-muted: #555555;
  --color-accent-gold: #D4A853;
  --color-accent-cyan: #00C9B7;
  --color-border-subtle: #2A2A2A;
}
```

Add dark mode base styles:
```css
html { background-color: #0A0A0A; color: #FFFFFF; }
body { background-color: #0A0A0A; }
```

Keep all animation keyframes (rise-up, push-in, blob, etc.) — they're still useful.

- [ ] **Step 2: Update layout.tsx**

Add `class="dark"` to `<html>` element to ensure Tailwind dark mode if needed.

- [ ] **Step 3: Commit**

---

