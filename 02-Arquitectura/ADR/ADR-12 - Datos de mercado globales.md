---
tipo: "adr"
adr: "ADR-12"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-12 · Datos de mercado globales

## Decisión
Datos de mercado globales (`market_rate`) sin `user_id`; los escriben solo los jobs.

## Motivo
Son públicos e iguales para todos. Única excepción a la regla del `user_id`.

## Alternativas descartadas
Copiar las tasas por usuario.

---
## 🔗 Relacionado

- **Entidades:** [[Entidad - MarketRate]]

