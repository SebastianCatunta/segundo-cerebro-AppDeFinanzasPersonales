---
tipo: "adr"
adr: "ADR-06"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-06 · Fuentes de tasas de cambio

## Decisión
Tasas: paralelo.bo por JSON-RPC (`get_current_rate`, `get_historical_rate`, `convert_currency` official). "Venta" = el mayor de buy/sell, "compra" = el menor. TCO: paralelo.bo, con respaldo en el widget del BCB. Carga única del histórico. Atribución CC-BY-4.0 (RNF-27).

## Motivo
Fuentes reales verificadas el 2026-10-16. El BCB solo publica un TCO desde el 27/06/2026.

## Alternativas descartadas
Extraer compra y venta oficiales del sitio del BCB (ya no existen).

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.9 Auditoría y retención]]

