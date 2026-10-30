---
tipo: "adr"
adr: "ADR-11"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-11 · Idempotencia con UUID v7

## Decisión
Idempotencia: toda creación lleva un `id` UUID v7 generado por el cliente. `INSERT … ON CONFLICT (id) DO NOTHING`: 201 si es nuevo, 200 con el existente si coincide, `IDEMPOTENCY_CONFLICT 409` si difiere. Las decisiones únicas usan `UPDATE … WHERE status = <esperado>`.

## Motivo
RN-10, RNF-11 y EC-M2-02 sin tabla de llaves.

## Alternativas descartadas
Tabla de idempotency keys.

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]]
- **Requerimientos no funcionales:** [[Spec 3.4 Idempotencia]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

