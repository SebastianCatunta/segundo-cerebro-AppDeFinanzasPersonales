---
tipo: "diseno"
fuente: "docs/design-direction.md § Color de marca: verde azulado profundo"
documento: "[[Diseño - Dirección visual de la web]]"
tags:
  - "frontend/diseno"
actualizado: "2026-10-30"
---

↑ [[Diseño - Dirección visual de la web]] · ← [[Diseño - Tema]] · → [[Diseño - Marca]]

## Color de marca: verde azulado profundo

Solo para la acción principal, los enlaces y el foco. Los 12 colores de `PALETTE` son de las categorías, no de la marca.

| Token (`index.css`) | Claro | Oscuro |
|---|---|---|
| `--primary` | `168 60% 24%` | `168 48% 52%` |
| `--primary-foreground` | `0 0% 100%` | `222.2 84% 4.9%` |
| `--ring` | `168 60% 24%` | `168 48% 52%` |
| `--destructive` | `0 72% 45%` | `0 84% 66%` |
| `--destructive-foreground` | `0 0% 100%` | `222.2 84% 4.9%` |
| `--muted-foreground` | `215.4 16.3% 42%` | `215 20.2% 65.1%` (sin cambio) |

El resto de tokens de shadcn (`--secondary`, `--muted`, `--accent`, `--border`, `--input`) se queda en los neutros actuales. `--destructive` es solo para errores y acciones que borran, nunca para "gasto". Sirve a la vez de color de texto y de fondo de botón, así que cumple AA (≥ 4,5:1) en las dos formas, en claro y en oscuro: sobre blanco 5,8:1 y con texto blanco 5,8:1 (claro); sobre el fondo oscuro 6,2:1 y con texto oscuro 6,2:1 (oscuro). `--muted-foreground` sobre `--muted` queda en 5,2:1 en claro.
