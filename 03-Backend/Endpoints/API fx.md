---
tipo: "api"
modulo: "M3"
fuente: "apps/api/src/presentation/routes/fx.routes.ts"
tags:
  - "backend/api"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# API · fx

- **Módulo:** [[M3 - Monedas y tipo de cambio]]
- **Montaje:** `/api/rates`, `/api/fx-settings`, `/api/fx`
- **Archivos:** `presentation/routes/fx.routes.ts`, `presentation/controllers/fx.controller.ts`, `presentation/presenters/fx.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (5)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/rates/current` | ✅ | — | `current` |
| `GET` | `/api/rates/history` | ✅ | — | `history` |
| `PATCH` | `/api/fx-settings` | ✅ | [[Contrato - fx\|FxSettingsInput]] | `updateSettings` |
| `PUT` | `/api/fx/manual` | ✅ | [[Contrato - fx\|ManualUsdInput]] | `setManual` |
| `DELETE` | `/api/fx/manual` | ✅ | — | `clearManual` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `RatesService` (355 líneas)

Archivo `application/services/rates.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `current` | Current references, the rate in use and the gap (RF-M3-03, RF-M3-05, RF-M3-12). |
| `currentRateFor` | Current Bs per unit of the currency, for current balances (RN-05); `null` without a rate. |
| `currentRatesFor` | `currentRateFor` of several currencies, read inside the caller's transaction so a caller that already has one does not open another; one entry per code. |
| `ratesForMovement` | Rates of a movement of that currency and date, inside the caller's transaction (RN-04). Throws `RATE_REQUIRED` when a non-BOB movement has no rate (EC-M3-02). |
| `transferRate` | Declared rate a transfer from `from` to `to` on `date` starts with (RF-M3-07), inside the caller's transaction, with the convention of plan §4.6.1; `null` when a rate is missing. |

**Repositorios que usa (vía UnitOfWork):** `marketRates`, `userFxEvents`, `userSettings`

## Servicio `FxSettingsService` (129 líneas)

Archivo `application/services/fx-settings.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `update` | Changes the USD reference and the base currency (RF-M3-11). A new reference is recorded as a `reference_set` event (RF-M3-13); the base must be an active currency (`CURRENCY_INACTIVE`). |
| `setManual` | Turns the manual USD value on; it never expires by itself (RF-M3-03, plan §4.3.3). |
| `clearManual` | Turns the manual USD value off (plan §4.3.3). |

**Repositorios que usa (vía UnitOfWork):** `currencies`, `userFxEvents`, `userSettings`

**Servicios compartidos relacionados:** [[Compartido - currency-usage]]

**Jobs relacionados:** [[Job - fx]]

## Pruebas

- HTTP: `apps/api/test/http/fx-settings.test.ts`
- Integración: `apps/api/test/integration/fx-jobs.test.ts`
- Integración: `apps/api/test/integration/fx-repositories.test.ts`

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]] · [[Plan 4.6 M6 - Transacciones (V1.0)]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

