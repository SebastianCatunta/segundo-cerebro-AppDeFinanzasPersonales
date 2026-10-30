---
tipo: "contrato"
fuente: "packages/contracts/src/fx.ts"
tags:
  - "paquete/contracts"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# Contratos Zod · `fx.ts`

Archivo `packages/contracts/src/fx.ts` del paquete [[Paquete contracts]]. Define schemas Zod compartidos por la web y el API (única fuente de entradas, salidas y errores).

**Módulo:** [[M3 - Monedas y tipo de cambio]]

> [!quote] Comentario del código
> An item of `GET /api/currencies`: the currency with its status, so Ajustes can offer the active ones.

## Exportaciones (20)

| Nombre | Tipo | Descripción |
|---|---|---|
| `UsdReference` | const |  |
| `UsdReference` | type |  |
| `RatesCurrentDto` | const |  |
| `RatesCurrentDto` | type |  |
| `RateHistoryQuery` | const |  |
| `RateHistoryQuery` | type |  |
| `FxSettingsInput` | const |  |
| `FxSettingsInput` | type |  |
| `ManualUsdInput` | const |  |
| `ManualUsdInput` | type |  |
| `CreateCurrencyInput` | const |  |
| `CreateCurrencyInput` | type |  |
| `UpdateCurrencyInput` | const |  |
| `UpdateCurrencyInput` | type |  |
| `CurrencyDto` | const |  |
| `CurrencyDto` | type |  |
| `CurrencyStatus` | const |  |
| `CurrencyStatus` | type |  |
| `CurrencyListItemDto` | const | An item of `GET /api/currencies`: the currency with its status, so Ajustes can offer the active ones. |
| `CurrencyListItemDto` | type |  |
