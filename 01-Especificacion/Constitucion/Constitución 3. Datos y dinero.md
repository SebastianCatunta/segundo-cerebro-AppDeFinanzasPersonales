---
tipo: "constitucion"
fuente: "docs/constitution.md § 3. Datos y dinero"
documento: "[[Constitución]]"
tags:
  - "sdd/constitucion"
actualizado: "2026-10-30"
---

↑ [[Constitución]] · ← [[Constitución 2. Stack tecnológico]] · → [[Constitución 4. Seguridad]]

## 3. Datos y dinero
- El dinero se calcula SIEMPRE con precisión decimal exacta, NUNCA con punto flotante. Los montos se redondean a dos decimales, con la mitad hacia arriba.
- La historia no se reescribe: un movimiento conserva el tipo de cambio con el que se registró, y los valores históricos no cambian por movimientos del dólar ni por cambios de configuración.
- Los saldos se calculan a partir de los movimientos y NUNCA se editan a mano.
- Las cuentas y categorías con movimientos se archivan, no se borran.
- Una misma acción repetida NUNCA genera registros duplicados, y un mismo evento NUNCA genera dos avisos.
