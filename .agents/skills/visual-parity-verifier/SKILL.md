---
name: visual-parity-verifier
description: Inspection and verification procedures to ensure sub-pixel rendering accuracy against desktop and mobile reference imagery.
---

# Visual Parity Verifier Skill

Use this procedure when verifying the visual fidelity of Sāmya: against reference renders.

## Reference Targets
1. `refer/samya_desktop_full.png` (1440 × 3152 px)
2. `refer/samya_mobile_full.png` (390 × 4041 px)

## Audit Checklist
- [ ] Typography line-heights and baseline alignment.
- [ ] Clamped font-sizes at 1440px and 390px.
- [ ] Border offsets (`inset: 0 0 20px 22px` desktop vs `inset: 0 0 12px 12px` mobile).
- [ ] Color token hex matching:
  - Porcelain `#F5EFE8`
  - Plum `#1B0516`
  - Wine `#76022E`
  - Purple `#7114AC`
  - Fuchsia `#E40485`
  - Yellow `#F5C928`
  - Turquoise `#00AEBD`
- [ ] Responsive navigation collapse at 960px and 540px.
- [ ] Zero horizontal overflow on mobile viewports.

