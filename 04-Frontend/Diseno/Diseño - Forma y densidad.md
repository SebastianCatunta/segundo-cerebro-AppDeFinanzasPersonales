---
tipo: "diseno"
fuente: "docs/design-direction.md § Forma y densidad"
documento: "[[Diseño - Dirección visual de la web]]"
tags:
  - "frontend/diseno"
actualizado: "2026-10-30"
---

↑ [[Diseño - Dirección visual de la web]] · ← [[Diseño - Tipografía IBM Plex Sans]] · → [[Diseño - Reglas de componentes y pantallas]]

## Forma y densidad

- Radio base `--radius: 0.5rem` en todo; los controles pequeños (casillas, insignias) usan `calc(var(--radius) - 2px)`.
- Densidad cómoda, celular primero: objetivos táctiles de al menos 44 px de alto, 16 px de margen lateral, espaciado en múltiplos de 4 px.
- Una columna en celular. En escritorio (≥ 1024 px) el contenido se centra con un ancho máximo cómodo; no se estira.
