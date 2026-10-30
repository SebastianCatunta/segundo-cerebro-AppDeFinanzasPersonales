---
tipo: "adr"
adr: "ADR-09"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-09 · Errores problem+json

## Decisión
Errores: `application/problem+json` (RFC 9457) con `code` estable y datos seguros; la web los traduce con i18next. Errores inesperados: `INTERNAL_ERROR` + `traceId`.

## Motivo
Constitución §4.

## Alternativas descartadas
Formato propio con el mensaje en español desde el servidor.

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Constitución 4. Seguridad]]

