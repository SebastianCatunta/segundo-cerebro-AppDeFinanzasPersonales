---
tipo: "dominio"
fuente: "packages/domain/src/fx.ts"
tags:
  - "paquete/domain"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# Dominio · `fx.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

**Módulo:** [[M3 - Monedas y tipo de cambio]]

> [!quote] Comentario del código
> Bid (compra) is the lower value and ask (venta) the higher, whatever the source calls them (ADR-06).

## Exportaciones (11)

| Nombre | Tipo | Descripción |
|---|---|---|
| `classifyBidAsk` | function | Bid (compra) is the lower value and ask (venta) the higher, whatever the source calls them (ADR-06). |
| `gap` | function | Gap = (parallel - official) / official, as a percentage and in Bs (RF-M3-12). |
| `UsdReference` | type |  |
| `FxEvent` | type |  |
| `MarketSeries` | type |  |
| `resolveUsdRate` | function | USD-Bs rate for a date: the manual value if active, else the reference in use (RF-M3-03, RF-M3-06, RF-M3-13). |
| `convert` | function | Converts an amount between two currencies through BOB, rounded per RN-06. |
| `customRateOn` | function | Last custom rate of a currency up to the end of the day in tz; else the first known one (equivalent to user_rate_on). |
| `transferPrefill` | function | Declared rate to prefill a transfer between two currencies (RF-M3-07); null if any input is missing. |
| `amountInFrom` | function | Amount that arrives given the amount that leaves and the declared rate. |
| `rateFromAmounts` | function | Inverse of amountInFrom: the declared rate implied by both amounts. |

**Pruebas:** `packages/domain/test/fx-convert.test.ts`, `packages/domain/test/fx-gap.test.ts`, `packages/domain/test/fx-resolve.test.ts`

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-06 - Fuentes de tasas de cambio]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

