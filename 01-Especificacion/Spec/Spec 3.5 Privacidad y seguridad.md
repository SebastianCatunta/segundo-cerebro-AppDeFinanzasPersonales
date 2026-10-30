---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 3.5 Privacidad y seguridad"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 3. Requerimientos no funcionales globales (RNF)]] · ← [[Spec 3.4 Idempotencia]] · → [[Spec 3.6 Exactitud monetaria]]

### 3.5 Privacidad y seguridad
- **RNF-14:** Cada usuario accede SOLO a sus datos. Un dato ajeno se comporta como inexistente.
- **RNF-15:** Los mensajes de registro, recuperación e inicio de sesión NO DEBEN revelar si un correo tiene cuenta ni cuál dato es incorrecto.
- **RNF-16:** El usuario DEBE poder exportar todos sus datos y eliminarlos por completo y de inmediato.
- **RNF-17:** La app NUNCA DEBE mostrar al usuario detalles internos en los mensajes de error.
