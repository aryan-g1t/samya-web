# Sāmya: Pixel-Perfection & Visual Parity Rule

Enforce strict visual parity with `refer/samya_desktop_full.png` (1440px) and `refer/samya_mobile_full.png` (390px) while maintaining the design tokens from `refer/samya_landing_redesign.html`.

## 1. Design System Tokens
- Canvas background: `#F5EFE8` (Porcelain)
- Ink / Plum: `#1B0516`
- Wine: `#76022E`
- Purple: `#7114AC`
- Fuchsia: `#E40485`
- Yellow: `#F5C928`
- Turquoise: `#00AEBD`
- Line / Dividers: `#DCD0D3`
- Fonts: `Cormorant Garamond` (Serif: 400, 500, 600, italic) and `Manrope` (Sans: 400, 500, 600, 700)

## 2. Desktop (1440px Viewport) Geometry
- Max container: `min(100% - 112px, 1360px)` centered.
- Hero Grid: `minmax(0, 1.08fr) minmax(0, 0.92fr)` with gap `clamp(48px, 5vw, 98px)`.
- Hero Arch: `clamp(490px, 40.5vw, 610px)` height with `border-radius: 260px 260px 3px 3px` and offset border frame.
- Problem Cards: 3 equal horizontal columns with 1px vertical borders (`#DCD0D3`).
- Method Steps: 3 equal horizontal columns with progress dots.

## 3. Mobile (390px Viewport) Geometry
- Max container: `min(100% - 36px, 1360px)`.
- Navigation: Text links hidden, only logo and compact "Join our research" pill visible.
- Hero Grid: 1 column vertical stack, art height clamped to `380px` with `border-radius: 210px 210px 3px 3px`.
- Problem Cards: 1 column vertical stack with horizontal divider borders.
- Method Steps: 1 column vertical stack with bottom divider borders (`#684A5E`).

## 4. Animation & Interaction Standard
- 60fps/120fps transform- and opacity-based animations only. Never animate width, height, margin, or top/left.
- Honor `@media (prefers-reduced-motion: reduce)`.
