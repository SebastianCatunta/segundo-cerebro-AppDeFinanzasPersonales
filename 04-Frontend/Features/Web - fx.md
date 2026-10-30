---
tipo: "frontend"
modulo: "M3"
fuente: "apps/web/src/features/fx"
tags:
  - "frontend/feature"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# Web · feature `fx`

Carpeta `apps/web/src/features/fx/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M3 - Monedas y tipo de cambio]]
- **Textos (i18n):** `locales/es-BO/fx.json` (9 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/tipo-de-cambio` | `ExchangeRatePage` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `getCurrentRatesEndpoint` | `GET` | `/api/rates/current` |

## Hooks (TanStack Query)

- `use-current-rate.ts` — `CURRENT_RATE_KEY`, `useCurrentRate`
- `use-rate-history.ts` — `RateHistoryRange`, `RateHistory`, `useRateHistory`. One point per day, the value as decimal text (ADR-03).

## Componentes (10)

| Archivo | Exporta | Descripción |
|---|---|---|
| `add-currency-dialog.tsx` | `activateCurrencyEndpoint`, `checkRate`, `currencyErrorMessage`, `AddCurrencyDialog` | What the user typed as a rate in Bs: a value under Bs 0.01 is told apart from a malformed one, so it gets its own explanation (RF-M3-02, EC-M3-07). |
| `currencies-list.tsx` | `CurrenciesList` | The added currencies with their rate in Bs: add, edit the rate, deactivate (RF-M3-02). |
| `current-rates-card.tsx` | `CurrentRatesCard` | The source is shown next to its data, linked when it has a site (RNF-27). |
| `edit-currency-rate-dialog.tsx` | `EditCurrencyRateDialog` | A new rate in Bs for an added currency: edits it, or reactivates a deactivated one, which always needs a new rate (RF-M3-02, plan §4.3.3). |
| `gap-card.tsx` | `GapCard` | Gap of the rate in use against the official one, in % and in Bs (RF-M3-12). |
| `manual-value-banner.tsx` | `ManualValueBanner` | Fixed notice while the manual value has priority (RF-M3-03, scenario "Valor manual con prioridad"). |
| `manual-value-card.tsx` | `ManualValueCard` | What the user typed as a rate, or null when it is not a valid one. |
| `rate-chip.tsx` | `RateChip` |  |
| `rate-history-chart.tsx` | `RateHistoryChart` | ADR-03: the only place a rate becomes a `number`, to draw it. |
| `reference-selector.tsx` | `ReferenceSelector` | The USD reference used to convert balances and totals (RF-M3-03, RF-M3-11). |

**Backend relacionado:** [[API fx]], [[API currencies]]

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]]
- **Requerimientos no funcionales:** [[Spec 3.9 Auditoría y retención]]
- **Spec / Plan / Constitución:** [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]]

