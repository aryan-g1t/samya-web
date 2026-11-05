# Sāmya: — Beauty-Tech Complexion Shade Discovery

[![Production Deployment](https://img.shields.io/badge/Production-Live%20at%20samyaglobal.com-success?style=for-the-badge&logo=vercel)](https://www.samyaglobal.com)
[![Astro 5](https://img.shields.io/badge/Astro-5.18-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Zero CLS](https://img.shields.io/badge/CLS-0.00-brightgreen?style=for-the-badge)](https://web.dev/cls/)

> **Official Domain:** [https://www.samyaglobal.com](https://www.samyaglobal.com)  
> **Apex Domain:** [https://samyaglobal.com](https://samyaglobal.com)  
> **Source Repository:** [https://github.com/aryan-g1t/samya-web](https://github.com/aryan-g1t/samya-web)

---

## ✦ Overview

**Sāmya:** is a beauty-tech venture building precision complexion shade discovery starting with India's diverse skin tones. 

This repository houses the high-fidelity web application built from an exact 1:1 Figma design export (17,818 × 10,102 px artboard system), engineered with Astro 5, TypeScript, 60/120fps reactive motion physics, and an interactive 18-screen research survey modal.

---

## ✦ Key Features

### 1. Pixel-Exact Editorial Layout
- **Hero Section:** Asymmetric editorial grid featuring a Cormorant Garamond display headline with Wine accent, 3-dot spectrum indicator bar, full-radius outline and solid pill buttons (`border-radius: 9999px`), arched portrait photography card, and an embedded floating 7-capsule Foundation Depth Study badge.
- **Section 01 (The Problem):** Encapsulated warm card (`#FCF9F5`, `border-radius: 24px`) with a 3-column divider grid (`Limited choice.`, `Limited testing.`, `Uncertain wear.`).
- **Section 02 (Our Method):** Deep Plum (`#1B0516`) full-bleed canvas with 3 floating step cards (`Tell us.`, `Try shades.`, `Build together.`), subtle 1px spectrum divider line, and community advisory note.
- **Section 03 (The Invitation):** Warm porcelain card with Cormorant italic *"our first"* emphasis, dual copy columns, and Wine pill CTA.
- **Footer:** Deep Wine (`#76022E`, `border-radius: 40px 40px 0 0`) multi-column layout with newsletter subscription pill, golden tagline (*"Real Skin. Real Stories. A More Inclusive Tomorrow."*), social links, and stacked white branding.

### 2. 60/120fps Reactive Motion Engine (CLS = 0)
- **3D Perspective Magnetic Tilt & Specular Sheen:** Mouse tracking across the arched hero portrait calculates interpolated `rotateX` and `rotateY` transforms alongside a dynamic specular highlight reflection.
- **Kinetic Typography Scroll Reveals:** `data-animate="fade-up"` utilizing hardware-accelerated `transform` and `opacity` with cubic-bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Magnetic Button Hover:** Micro-interaction pull physics following cursor coordinates on desktop viewports.
- **Accessibility:** Comprehensive `@media (prefers-reduced-motion: reduce)` fallbacks across all animations.

### 3. Interactive 18-Screen Research Survey Modal
- **Full Journey Flow:** Complete 18-screen interactive `<dialog>` survey:
  - **Screen 1:** Study overview journey with milestone chips and "Start Survey" CTA.
  - **Screen 2:** Participant registration form with input validation.
  - **Screens 3–5, 7–9, 11–17:** Question sequences with dynamic top progress bar tracking.
  - **Screen 6:** Visual Complexion Depth Selector (Fair, Medium, Rich, Deep).
  - **Screen 10:** Halfway Milestone celebration card styled in Wine (`#76022E`) with Electric Yellow (`#F5C928`) CTA.
  - **Screen 18:** Final study confirmation state with participant ID.

### 4. Secure Admin Console & Data Management
- **Dedicated Route:** `/admin` with encrypted session auth and brute-force protection.
- **Executive KPIs:** Live metrics for total participants, completion rate, kit testing candidates, and shade depth distribution.
- **Full CRUD Suite:** Search, filter, view complete 21-parameter profiles, update testing kit statuses (`Pending`, `Kit Sent`, `Delivered`, `Archived`), append internal research notes, and add offline participants.
- **Export Tools:** Instant filtered CSV downloads and 1-click clipboard copy of participant emails for batch outreach.

---

## ✦ Design System Tokens

```css
:root {
  /* Surfaces & Ink */
  --porcelain: #F5EFE8;   /* Primary canvas background */
  --plum: #1B0516;        /* Deep ink & dark canvas */
  --warm-white: #FCF9F5;  /* Clean card surface */
  --line: #DCD0D3;        /* Hairline structural dividers */
  --ink-body: #4A3E45;    /* Secondary body typography */

  /* Chromatic Spectrum */
  --wine: #76022E;        /* Accent burgundy & logo colon */
  --purple: #7114AC;      /* Electric accent */
  --fuchsia: #E40485;     /* Spectrum stop */
  --yellow: #F5C928;      /* Milestone highlight & CTA */
  --turquoise: #00AEBD;   /* Spectrum stop */

  /* Typography */
  --font-serif: 'scotch-display', 'Cormorant Garamond', Georgia, serif;
  --font-sans: 'dm-sans', 'DM Sans', 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## ✦ Project Structure

```text
samya/
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── hero-portrait.webp          # 183 KB optimized hero portrait
│       ├── hero-portrait-mobile.webp   # 33 KB mobile portrait
│       ├── logo-dark.png               # Official transparent dark logo
│       ├── logo-white.png              # Official transparent white logo
│       ├── logo-white-stacked.png      # Stacked white footer logo
│       └── swatches-24.webp            # 24-shade foundation swatch strip
├── refer/                              # 1:1 Figma exports, artboard slices, and specs
│   ├── new_design/                     # Sliced Figma components and revamp composite
│   ├── websites.png                    # Full 17818x10102 px Figma canvas export
│   └── Samya Website pngs.zip          # Raw asset package
├── scripts/
│   ├── capture_screenshots.js          # Puppeteer automated visual regression runner
│   └── test_modal.js                   # Automated modal verification script
├── src/
│   ├── components/
│   │   ├── DepthStudyBadge.astro       # Floating 7-capsule foundation depth pill
│   │   ├── Footer.astro                # Multi-column Wine footer & newsletter
│   │   ├── Header.astro                # Responsive header & outline pill CTA
│   │   ├── Hero.astro                  # Hero with 3D tilt arch card & copy
│   │   ├── InvitationSection.astro     # Porcelain invitation card & CTA
│   │   ├── MethodSection.astro         # Deep Plum 3-step process section
│   │   ├── ProblemSection.astro        # 3-column divider card section
│   │   └── ResearchModal.astro         # Complete 18-screen interactive modal
│   ├── layouts/
│   │   └── Layout.astro                # Base HTML layout, SEO meta, font preloading
│   ├── pages/
│   │   └── index.astro                 # Root page & reactive motion controller
│   └── styles/
│       └── global.css                  # CSS reset, tokens, and utility classes
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## ✦ Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher (v22.x recommended)
- **npm:** v9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/aryan-g1t/samya-web.git
cd samya-web

# Install dependencies
npm install
```

### Development Server

```bash
# Start local development server with hot reload
npm run dev
```

Visit `http://localhost:4321` in your browser.

### Typecheck & Production Build

```bash
# Verify TypeScript and Astro diagnostics
npm run check

# Create production static build
npm run build

# Preview production build locally
npm run preview
```

### Visual Parity Verification

```bash
# Capture full-page 1440px desktop and 390px mobile screenshots
node scripts/capture_screenshots.js
```

---

## ✦ License

Private & Proprietary — Sāmya Beauty-Tech.

