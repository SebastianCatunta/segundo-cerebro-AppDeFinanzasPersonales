---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 3.8 Disponibilidad y tolerancia a fallos"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 3. Requerimientos no funcionales globales (RNF)]] · ← [[Spec 3.7 Tiempo]] · → [[Spec 3.9 Auditoría y retención]]

### 3.8 Disponibilidad y tolerancia a fallos
- **RNF-21:** Si fallan las fuentes del tipo de cambio, la app DEBE seguir funcionando con el último valor guardado (M3).
- **RNF-22:** Si falla el servicio de correo, el usuario DEBE poder reenviar los correos de la cuenta respetando los límites (M1).
- **RNF-23:** Sin conexión, la app DEBE bloquearse por completo, incluido Registrar, sin perder los borradores (M2). Es una excepción aceptada al principio rector de la constitución: no existe modo sin conexión.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]]

