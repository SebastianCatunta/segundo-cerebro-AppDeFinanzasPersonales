---
tipo: "diseno"
fuente: "docs/design-direction.md § Reglas de componentes y pantallas"
documento: "[[Diseño - Dirección visual de la web]]"
tags:
  - "frontend/diseno"
actualizado: "2026-10-30"
---

↑ [[Diseño - Dirección visual de la web]] · ← [[Diseño - Forma y densidad]] · → [[Diseño - Metas (M12)]]

## Reglas de componentes y pantallas

- Usar los componentes de shadcn/ui tal cual, con estos tokens. No crear variantes de botón nuevas sin una razón en la spec.
- **Un solo botón primario por vista.** Las demás acciones, secundarias o de texto.
- **Montos:** el signo `−` (menos) va delante en gastos y el `+` en ingresos; nunca se comunica solo por color. La moneda y el formato salen de los formateadores (`useFormatters`), no se escriben a mano.
- **Formularios:** etiqueta visible encima del campo, error debajo en `--destructive` y con texto que explica cómo corregirlo. Foco visible siempre (anillo de `--ring`).
- **Estados vacíos y errores:** dicen qué pasó y qué hacer; sin disculpas ni humor. Los textos van en `locales/es-BO`, nunca en el código.
- **Movimiento:** solo como respuesta a una acción (abrir, expandir, confirmar) y breve. Sin animaciones de entrada ni efectos al pasar el cursor. Respetar `prefers-reduced-motion`.
- **Accesibilidad:** contraste AA (≥ 4,5:1), navegación completa con teclado, `aria-label` en botones de solo ícono, y los íconos de lucide-react nunca son la única señal.

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]]

