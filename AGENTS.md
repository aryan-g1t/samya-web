# AGENTS.md — Sāmya: Engineering Directives & Standards

This document establishes the architectural constraints, design system tokens, quality gates, and workflow standards for all AI agents and engineers operating within this repository.

---

## 1. Project Mission & North Star
**Sāmya:** is a beauty-tech venture building complexion shade discovery starting with India's diverse skin tones.
- **Visual Reference Files:**
  - Desktop: `refer/samya_desktop_full.png` (1440 × 3152 px)
  - Mobile: `refer/samya_mobile_full.png` (390 × 4041 px)
  - Prototype Reference: `refer/samya_landing_redesign.html`
- **Quality Mandate:** Pixel-exact fidelity against the reference imagery, separated into dedicated Desktop (1440px) and Mobile (390px) responsive viewports, elevated by 60/120fps reactive animations and zero layout jitter (Cumulative Layout Shift = 0).

---

## 2. Tech Stack & Architecture Constraints
- **Framework:** Astro 5 (HTML-first, 0 KB baseline client JS, Island architecture for interactive components).
- **Language:** TypeScript (`strict: true`, no implicit `any`).
- **Styling:** CSS Design Tokens on `:root` + Scoped CSS / Modern Tailwind.
- **Testing & Verification:** Playwright / Headless Chromium for automated visual screenshot regression against `refer/*.png`.
- **Version Control:** Git micro-commits after every discrete sub-task.

---

## 3. Strict Design Tokens (Never Deviate)
```css
:root {
  /* Surfaces & Ink */
  --porcelain: #F5EFE8;   /* Primary canvas background */
  --plum: #1B0516;        /* Deep ink & primary typography */
  --warm-white: #FCF9F5;  /* Clean card surface */
  --line: #DCD0D3;        /* Hairline structural dividers */
  --muted: #6E5D68;       /* Secondary body copy */

  /* Chromatic Spectrum */
  --wine: #76022E;        /* Accent burgundy (e.g., logo colon ':', em text) */
  --purple: #7114AC;      /* Electric accent & focus rings */
  --fuchsia: #E40485;     /* Spectrum gradient stop */
  --yellow: #F5C928;      /* Spectrum gradient stop */
  --turquoise: #00AEBD;   /* Spectrum gradient stop */

  /* Typography */
  --serif: 'scotch-display', 'Cormorant Garamond', Georgia, serif;
  --sans: 'dm-sans', 'DM Sans', 'Manrope', Arial, sans-serif;
}
```

---

## 4. Antipatterns to Avoid (Strict Rules)
1. **NO Layout Jitter (CLS > 0):** Never animate `width`, `height`, `margin`, `padding`, `top`, `left`. Always animate `transform` and `opacity` with `will-change: transform`.
2. **NO Font Popping / FOUT:** Web fonts (`Cormorant Garamond` & `Manrope`) must be preloaded in `<head>` with size-adjust fallbacks to eliminate text shifting.
3. **NO Monolithic Framework Bloat:** Do not ship heavy React/Vue runtime bundles to render static editorial sections. Use static HTML with selective island hydration.
4. **NO Hard Cuts in Modals:** Multi-stage flows must transition smoothly using spring-physics / slide crossfades, never abrupt `hidden` toggles without transition.
5. **NO Arbitrary Padding / Colors:** Never introduce arbitrary colors outside the tokens table.

---

## 5. Development Workflow & Verification Gates
1. **Spec First:** Consult `samya_implementation_plan.md` before altering code.
2. **Micro-Commits:** Every phase (Scaffolding → Desktop Layout → Mobile Layout → Motion → Modal → Testing) must conclude with an atomic Git commit (`feat:`, `fix:`, `refactor:`, `test:`).
3. **Visual Parity Audit:** Run visual comparisons against `refer/samya_desktop_full.png` and `refer/samya_mobile_full.png` before declaring tasks complete.

