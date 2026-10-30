---
tipo: "diseno"
fuente: "docs/design-direction.md § Marca"
documento: "[[Diseño - Dirección visual de la web]]"
tags:
  - "frontend/diseno"
actualizado: "2026-10-30"
---

↑ [[Diseño - Dirección visual de la web]] · ← [[Diseño - Color de marca verde azulado profundo]] · → [[Diseño - Tipografía IBM Plex Sans]]

## Marca

Isotipo de tres barras que suben, en blanco sobre un cuadrado de esquinas redondeadas en el color de marca (`#186253`, el `--primary` claro). No lleva texto: el nombre "Finanzas" va en el título. Los archivos están en `apps/web/public/`: `logo.svg` y `favicon.svg` (el mismo dibujo), `favicon.ico` (16, 32 y 48 px) y `apple-touch-icon.png` (180×180, sin esquinas, porque iOS las redondea).

- **a) Pestaña:** el ícono y el título "Finanzas"; `theme-color` es el color de marca.
- **b) Pantallas de acceso y Onboarding:** el logo de 48 px, centrado, sobre el título.
- **c) Cabecera:** en celular y escritorio, el logo de 24 px a la izquierda del título, después de "Volver" si lo hay.
- **d) Barra lateral de escritorio:** sin logo propio, para no repetirlo junto al de la cabecera.
- **e) Tema oscuro:** la misma marca y el mismo archivo. El cuadrado de color lleva su propio fondo, así que se lee igual sobre el fondo claro y sobre el oscuro, sin variantes ni `currentColor`.
