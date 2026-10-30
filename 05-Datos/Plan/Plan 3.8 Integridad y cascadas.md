---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 3.8 Integridad y cascadas"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 3. Esquema de Datos y Persistencia Global]] · ← [[Plan 3.7 Avisos e infraestructura (M15)]] · → [[Plan 3.9 Seguridad a nivel de datos]]

### 3.8 Integridad y cascadas
- **Al eliminar al usuario:** cascada total desde `auth_user`. Antes se encola el correo de confirmación en `email_outbox`, que no tiene clave foránea al usuario.
- **Cuentas y categorías:** `RESTRICT` desde movimientos, asientos, presupuestos y reglas. Por eso no se pueden borrar si tienen historia (RN-08, constitución §3); se archivan.
- **Atajos:** se borran en cascada con su cuenta o categoría (R1, RF-M4-13).
- **Comisión:** se borra en cascada con su transferencia (RF-M6-05).
- **Regla eliminada:** sus pendientes caen en cascada y sus movimientos quedan con `recurring_rule_id = NULL` y conservan `recurring_label` (RF-M14-11).
- **Período de presupuesto:** sus ajustes tardíos y umbrales caen en cascada al eliminar el presupuesto ("desaparece con su historia").

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M4 - Cuentas]] · [[M6 - Transacciones]]
- **Spec / Plan / Constitución:** [[Constitución 3. Datos y dinero]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - AuthUser]] · [[Entidad - EmailOutbox]]

