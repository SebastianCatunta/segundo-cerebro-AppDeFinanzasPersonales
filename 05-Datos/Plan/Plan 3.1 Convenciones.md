---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 3.1 Convenciones"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 3. Esquema de Datos y Persistencia Global]] · → [[Plan 3.2 Tipos enumerados]]

### 3.1 Convenciones
- Toda tabla de negocio tiene `user_id uuid NOT NULL REFERENCES auth_user ON DELETE CASCADE`. Eliminar la cuenta borra todo con un `DELETE` (RF-M1-15, RNF-16).
- Las tablas referenciables declaran `UNIQUE (user_id, id)` y se referencian con claves foráneas compuestas `(user_id, x_id)` (ADR-05).
- Montos y tasas: `numeric(14,2)`. Interés interno: `numeric(24,10)`. Fechas de negocio: `date`, día local del usuario (RN-07). Instantes: `timestamptz`.
- Estados: enums de Postgres. Archivado: `status` + `archived_at`. Borrado deshacible: solo en `ledger_transaction` (`deleted_at`).
- `updated_at` lo mantiene el trigger `set_updated_at()`.
- Extensiones: `unaccent`.
- Orden de la migración: las claves foráneas que apuntan a tablas definidas más abajo en este documento (por ejemplo `user_settings → account` o `ledger_transaction → recurring_rule`) se crean con `ALTER TABLE … ADD CONSTRAINT` al final de la migración inicial.

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]]
- **Decisiones (ADR):** [[ADR-05 - Aislamiento por usuario]]
- **Requerimientos no funcionales:** [[Spec 3.5 Privacidad y seguridad]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - LedgerTransaction]]

