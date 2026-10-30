---
tipo: "integracion"
modulo: "M3"
tags:
  - "backend/integracion"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# Integración · paralelo.bo

Tipo de cambio paralelo por JSON-RPC (`https://paralelo.bo/mcp`): `get_current_rate`, `get_historical_rate` y `convert_currency` (oficial). "Venta" es el mayor de buy/sell y "compra" el menor (ADR-06). Atribución CC-BY-4.0.

- **Módulo:** [[M3 - Monedas y tipo de cambio]]
- **Puerto que implementa:** ver [[API - Puertos]]
- **Fakes:** se activan con `INTEGRATIONS=fake` (prohibido en producción, ver [[API - Configuración env.ts]]).

| Archivo | Líneas | Comentario |
|---|---|---|
| `paralelo-bo.ts` | 154 | A valid rate is a finite number, at least 0.01 and with at most 2 decimals (EC-M3-04). |
| `paralelo-bo.fake.ts` | 59 |  |

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-06 - Fuentes de tasas de cambio]]

