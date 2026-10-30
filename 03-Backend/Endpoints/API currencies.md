---
tipo: "api"
modulo: "M3"
fuente: "apps/api/src/presentation/routes/currencies.routes.ts"
tags:
  - "backend/api"
  - "modulo/M3"
actualizado: "2026-10-30"
---

# API · currencies

- **Módulo:** [[M3 - Monedas y tipo de cambio]]
- **Montaje:** `/api/currencies`
- **Archivos:** `presentation/routes/currencies.routes.ts`, `presentation/controllers/currencies.controller.ts`, `presentation/presenters/currencies.presenter.ts`
- **Capa:** [[API - Capa de presentación]] → [[API - Capa de aplicación]]

## Endpoints (5)

| Método | Ruta | Sesión | Validación (contrato) | Handler |
|---|---|---|---|---|
| `GET` | `/api/currencies` | ✅ | — | `list` |
| `POST` | `/api/currencies` | ✅ | — | `create` |
| `PATCH` | `/api/currencies/:code` | ✅ | — | `update` |
| `POST` | `/api/currencies/:code/deactivate` | ✅ | — | `deactivate` |
| `POST` | `/api/currencies/:code/activate` | ✅ | — | `activate` |

Cada ruta con sesión pasa por `requireSession` + `trackActivity` y, si tiene cuerpo, por `validate(schema)` (ver [[API - Middlewares]]).

## Servicio `CurrenciesService` (218 líneas)

Archivo `application/services/currencies.service.ts`.

| Caso de uso | Descripción |
|---|---|
| `list` | The user's added currencies with their rate in force (plan §4.3.2). |
| `create` | Adds a currency and records its rate as a `custom_rate` event (RF-M3-02, RF-M3-13). A code the user already has gives `CURRENCY_CODE_TAKEN`; a rate under Bs 0.01, `RATE_BELOW_MINIMUM`. |
| `update` | Changes the symbol or the rate of a currency. Each new rate is a `custom_rate` event (RF-M3-13); BOB and USD have no rate of their own (`SYSTEM_CURRENCY`, RF-M3-01). |
| `deactivate` | Deactivates a currency (plan §4.3.3). BOB and USD give `SYSTEM_CURRENCY` (RF-M3-01), the base currency gives `BASE_CURRENCY` and a currency still in use gives `CURRENCY_IN_USE {usedBy}` (EC-M3-05). |
| `activate` | Reactivates a currency with a new rate, recorded as a `custom_rate` event (plan §4.3.3). An already active currency stays as it is, so a repeated request records nothing new. |

**Repositorios que usa (vía UnitOfWork):** `currencies`, `userFxEvents`, `userSettings`

**Servicios compartidos relacionados:** [[Compartido - currency-usage]]

**Jobs relacionados:** [[Job - fx]]

## Pruebas

- HTTP: `apps/api/test/http/currencies-deactivate.test.ts`
- HTTP: `apps/api/test/http/currencies.test.ts`

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]]

