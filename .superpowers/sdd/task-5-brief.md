### Task 5: Landing Page Restructure

**Files:**
- Modify: `src/components/LandingClient.tsx`
- Create: `src/components/landing/HeroSection.tsx`
- Create: `src/components/landing/StatsSection.tsx`
- Create: `src/components/landing/ProblemSection.tsx`
- Create: `src/components/landing/HowItWorks.tsx`
- Create: `src/components/landing/TestimonialsSection.tsx`
- Create: `src/components/landing/PricingSection.tsx`
- Create: `src/components/landing/FAASection.tsx`
- Create: `src/components/landing/FinalCTASection.tsx`
- Create: `src/components/landing/FooterSection.tsx`

Break the monolithic `LandingClient.tsx` into focused section components. Each gets its own file.

- [ ] **Step 1: Create HeroSection.tsx**

Split layout: left text (60%) + right 3D orb (40%). Gold pill tags, bold H1, AuditForm, feature bullets.

- [ ] **Step 2: Create StatsSection.tsx**

Floating card with 3 animated stat counters (50M+, 8M, 73%). Dark surface background, gold numbers.

- [ ] **Step 3: Create ProblemSection.tsx**

"8 out of 10 Egyptian SMEs are invisible online". Pain points as pills with lucide icons. 80% stat in large gold circle on right.

- [ ] **Step 4: Create HowItWorks.tsx**

3-step vertical timeline. Gold numbered circles. SVG icons. Sticky left, scrollable right.

- [ ] **Step 5: Create TestimonialsSection.tsx**

3 cards in staggered grid. Gold star ratings. Score improvement badges. Dark surface cards.

- [ ] **Step 6: Create PricingSection.tsx**

3-column grid. Gold accent on "Most Popular" (Sane'). Lucide check icons.

- [ ] **Step 7: Create FAASection.tsx**

Dark accordion, gold chevrons, clean dividers.

- [ ] **Step 8: Create FinalCTASection.tsx**

Centered CTA with AuditForm. Gold decorative line.

- [ ] **Step 9: Create FooterSection.tsx**

Minimal 3-column footer. Gold top border.

- [ ] **Step 10: Rewrite LandingClient.tsx**

Compose all sections in order. Remove inline component definitions (Marquee, StepCard, AnimatedStat, etc.) — they move to their respective section files or stay if they're simple enough.

- [ ] **Step 11: Commit**

---

