---
name: reactive-motion-design
description: Architecture and design standards for 60/120fps reactive animations, kinetic typography, magnetic hover micro-interactions, and fluid spring modal transitions for luxury editorial web experiences.
---

# Reactive Motion Design Skill

This skill defines the motion engineering principles for luxury editorial landing pages:

## 1. Kinetic Typography
- Entrance: Subtle vertical slide (`translateY(24px) -> translateY(0)`) coupled with opacity (`0 -> 1`) using cubic-bezier easing `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo).
- Italicized words (`<em>this complicated.</em>` and `<em>our first</em>`) highlight with an accent color pulse or subtle text-shadow shimmer.

## 2. Interactive Spectrum Ribbon
- 4px top bar (`spectrum-line`): Uses animated background position / subtle gradient shift on scroll or cursor movement across the viewport.

## 3. 3D Tilt & Lighting on Hero Arch
- Mouse move on `.art-wrap`: Subtle 3D perspective tilt (`rotateX`, `rotateY` limited to ±5deg) with smooth spring interpolation.
- Ambient sheen: A subtle specular highlight moving inversely to cursor position across the arched canvas.

## 4. Magnetic Micro-interactions
- Buttons (`.btn`, `.nav-join`):
  - Arrow glyph `↗` rotates 45deg on hover (`transform: translate(2px, -2px)`).
  - Subtle magnetic cursor tracking (displacement up to 4px toward cursor).
- Text links (`.text-link`): Underline expands from center or left with smooth width transition.

## 5. Modal Transition Physics
- Native `<dialog id="research-modal">`:
  - Backdrop fade-in (`rgba(27, 5, 22, 0.6)` with backdrop-filter blur 4px).
  - Stage transitions (Stage 1 -> Stage 2 -> Stage 3):
    Horizontal sliding transition (`translateX(-20px) -> translateX(0)`) with opacity crossfade, avoiding abrupt jumps.
