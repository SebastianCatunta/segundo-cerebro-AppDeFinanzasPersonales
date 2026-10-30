---
tipo: "constitucion"
fuente: "docs/constitution.md § 4. Seguridad"
documento: "[[Constitución]]"
tags:
  - "sdd/constitucion"
actualizado: "2026-10-30"
---

↑ [[Constitución]] · ← [[Constitución 3. Datos y dinero]] · → [[Constitución 5. Calidad]]

## 4. Seguridad
- Toda entrada al sistema DEBE validarse. NUNCA se confía en lo que envía el cliente.
- La identidad del usuario sale SIEMPRE de su sesión, nunca de los datos que envía.
- NUNCA se exponen secretos, contraseñas ni detalles internos en el código, los logs ni los mensajes de error.
