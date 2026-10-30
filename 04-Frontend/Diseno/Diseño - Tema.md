---
tipo: "diseno"
fuente: "docs/design-direction.md § Tema"
documento: "[[Diseño - Dirección visual de la web]]"
tags:
  - "frontend/diseno"
actualizado: "2026-10-30"
---

↑ [[Diseño - Dirección visual de la web]] · ← [[Diseño - Estética y tono]] · → [[Diseño - Color de marca verde azulado profundo]]

## Tema

Claro y oscuro, y el valor por defecto es el del sistema (`theme = system`). Los fondos NO se tocan: `--background` es `0 0% 100%` en claro y `222.2 84% 4.9%` en oscuro, porque el contraste AA de los 12 colores de categoría se mide contra ellos (`THEME_BACKGROUND`).
