---
tipo: "diseno"
fuente: "docs/design-direction.md § Metas (M12)"
documento: "[[Diseño - Dirección visual de la web]]"
tags:
  - "frontend/diseno"
actualizado: "2026-10-30"
---

↑ [[Diseño - Dirección visual de la web]] · ← [[Diseño - Reglas de componentes y pantallas]] · → [[Diseño - Presupuestos (M11)]]

## Metas (M12)

- **Anillo de progreso:** SVG de trazo de 4 px (8 px en el detalle), pista en `--muted` y avance en el color de la meta (`PALETTE`). El porcentaje va en texto dentro o al lado del anillo; el color nunca es la única señal (`role="progressbar"` con `aria-valuenow`).
- **Estado de la meta:** insignia de texto (en curso, lograda, vencida, archivada) con estilo neutro; "lograda" puede usar el color de la meta en el borde, nunca `--destructive` para "vencida".
- **Celebración:** un diálogo de shadcn con el ícono de la meta, el título y el monto logrado en 32 px / 600, y un solo botón primario para cerrarlo. Sin confeti ni animaciones propias: solo la transición del diálogo, que respeta `prefers-reduced-motion`.

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]]

