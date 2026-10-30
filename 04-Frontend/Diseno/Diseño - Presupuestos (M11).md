---
tipo: "diseno"
fuente: "docs/design-direction.md § Presupuestos (M11)"
documento: "[[Diseño - Dirección visual de la web]]"
tags:
  - "frontend/diseno"
actualizado: "2026-10-30"
---

↑ [[Diseño - Dirección visual de la web]] · ← [[Diseño - Metas (M12)]]

## Presupuestos (M11)

- **Barra de progreso:** barra horizontal de 8 px con radio completo, pista en `--muted` y avance en el color de la categoría (`PALETTE`; el presupuesto general usa `--primary`). Las marcas de los umbrales son líneas verticales de 1 px en `--muted-foreground`. Pasado el 100 % la barra queda llena y el texto dice "Superado por …"; el exceso no se pinta con `--destructive`. El porcentaje y lo gastado de lo disponible van en texto junto a la barra (`role="progressbar"` con `aria-valuenow`); el color nunca es la única señal.
- **Lo memorable:** en el detalle, el disponible en 32 px / 600 y debajo el texto de ritmo ("Puedes gastar … por día durante … días", "Vas … por encima del ritmo" o "Superado por …") en 16 px; en la lista, el disponible alineado a la derecha y el ritmo como texto secundario de 14 px.
- **Estado:** insignia de texto neutra (activo, pausado, finalizando, finalizado). Un cierre pendiente de decisión se marca con una insignia con borde `--primary` y el texto "Decidir cierre", nunca solo con color.
- **Desglose del arrastre e historial:** lista simple con separadores de 1 px; cada fila con su etiqueta a la izquierda y el monto con signo y `tabular-nums` a la derecha. El historial muestra los 12 últimos períodos, el más reciente arriba.
- **Acciones:** pausar, reanudar, reiniciar el arrastre y eliminar van en un menú secundario; eliminar y reiniciar el arrastre piden confirmación con un diálogo de shadcn, y solo eliminar usa el botón `destructive`.
- **Decisión de cierre:** un formulario en hoja o diálogo con el resultado en 32 px / 600 arriba, un campo por destino (arrastrar, enviar a meta, descartar) con la suma restante visible, y un único botón primario "Confirmar decisión" que solo se habilita cuando la suma cuadra.

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]]

