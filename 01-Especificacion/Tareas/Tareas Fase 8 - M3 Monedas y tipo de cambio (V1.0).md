---
tipo: "tareas"
fuente: "001-appFinanzas-mvp/tasks.md § Fase 8 - M3 Monedas y tipo de cambio (V1.0)"
documento: "[[Tareas - Backlog del MVP]]"
tags:
  - "sdd/tareas"
  - "modulo/M3"
fase: "8"
tareas: "23"
modulo: "M3"
actualizado: "2026-10-30"
---

↑ [[Tareas 2. Backlog de tareas atómicas]] · ← [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]] · → [[Tareas Fase 9 - M4 Cuentas (V1.0)]]

### Fase 8 — M3 Monedas y tipo de cambio (V1.0)

- [x] **`TASK-077`: Contratos de M3**
  - **Dependencias:** Requiere TASK-021
  - **Trazabilidad SDD:** plan §4.3.1; RF-M3-02, RF-M3-12, RF-M3-05
  - **Archivos en Alcance:**
    - `packages/contracts/src/fx.ts`
    - `packages/contracts/src/index.ts`
    - `packages/contracts/test/fx.test.ts`
  - **Especificación de Implementación:** `UsdReference`, `RatesCurrentDto`, `RateHistoryQuery`, `FxSettingsInput`, `ManualUsdInput`, `CreateCurrencyInput`, `UpdateCurrencyInput` y `CurrencyDto`, como plan §4.3.1.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-02`: el código exige 3 letras mayúsculas y la tasa, ≥ 0,01.
    - `RateHistoryQuery` solo admite los rangos 7d, 30d, 90d y 1y.
    - `RF-M3-05`: cada referencia de `RatesCurrentDto` trae `observedAt` y `source`.

- [x] **`TASK-078`: Dominio `fx`: compra y venta, y brecha**
  - **Dependencias:** Requiere TASK-026
  - **Trazabilidad SDD:** plan §4.3.1 (`classifyBidAsk`, `gap`), ADR-06; RF-M3-12, spec §1.5 (referencia del dólar)
  - **Archivos en Alcance:**
    - `packages/domain/src/fx.ts`
    - `packages/domain/src/index.ts`
    - `packages/domain/test/fx-gap.test.ts`
  - **Especificación de Implementación:** `classifyBidAsk(a, b)`: compra es el menor de los dos valores y venta el mayor, sin importar cómo los nombre la fuente. `gap(parallel, official)` = (paralelo − oficial) ÷ oficial, en % y en Bs, redondeado según RN-06.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-078`: `classifyBidAsk(10.30, 10.10)` da compra 10,10 y venta 10,30.
    - `RF-M3-12`: con paralelo 10,25 y oficial 6,96, la brecha es 47,27 % y Bs 3,29.

- [x] **`TASK-079`: Dominio `fx`: `resolveUsdRate` (tasa del dólar para una fecha)**
  - **Dependencias:** Requiere TASK-027, TASK-078
  - **Trazabilidad SDD:** plan §4.3.1 (`resolveUsdRate`); RF-M3-03, RF-M3-06, RF-M3-13, EC-M3-03, RN-04
  - **Archivos en Alcance:**
    - `packages/domain/src/fx.ts`
    - `packages/domain/test/fx-resolve.test.ts`
  - **Especificación de Implementación:** Para hoy, usa el valor manual si está activo y, si no, la referencia en uso. Para una fecha pasada, usa el estado del usuario al final de ese día (el valor manual si estaba activo; si no, la referencia de ese día) y toma el valor de ese día del calendario de Bolivia. Si falta compra o venta, usa la mediana del día; si el día no tiene datos, el día anterior más cercano; antes del primer dato, el primer valor conocido. Sin ninguna tasa, devuelve `null`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-03`: el valor manual activo tiene prioridad sobre cualquier referencia.
    - `RF-M3-06`: con una fecha pasada se usan la referencia y el valor manual que tenía el usuario ese día.
    - `RF-M3-13`: un día sin compra usa la mediana de ese día.
    - `EC-M3-03`: un día sin datos usa el anterior más cercano y, antes del primer dato, el primero.
    - Sin ninguna tasa, devuelve `null`.

- [x] **`TASK-080`: Dominio `fx`: conversión, tasa de monedas agregadas y precarga de transferencias**
  - **Dependencias:** Requiere TASK-079
  - **Trazabilidad SDD:** plan §4.3.1 (`convert`, `transferPrefill`), plan §4.6.1 (convención de la tasa declarada); RF-M3-07, RF-M3-08, EC-M3-06, RN-05, RN-06
  - **Archivos en Alcance:**
    - `packages/domain/src/fx.ts`
    - `packages/domain/test/fx-convert.test.ts`
  - **Especificación de Implementación:** `convert(amount, rateCurBob, rateBaseBob)` con redondeo RN-06. `customRateOn(events, code, date, tz)`, equivalente en dominio a `user_rate_on`. `transferPrefill({ from, to, date, manual, parallel, customRates })` según RF-M3-07: valor manual → venta si se compran dólares, compra si se venden → tasa manual de la moneda agregada → tasa cruzada a través de BOB. `amountInFrom(amountOut, rate)` y `rateFromAmounts(amountOut, amountIn)`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Tasa precargada según la dirección" (`RF-M3-07`): con compra 10,10 y venta 10,30, de Bs a $ se precarga 10,30 y Bs 1.000,00 dan $ 97,09.
    - `EC-M3-06`: con el valor manual activo se precarga el valor manual.
    - `RF-M3-08`: editar el monto que llega recalcula la tasa, con una diferencia máxima de 0,01.
    - Entre dos monedas agregadas se usa la tasa cruzada a través de BOB.

- [x] **`TASK-081`: Integración con paralelo.bo (JSON-RPC) y su *fake* (prueba técnica S-2)**
  - **Dependencias:** Requiere TASK-031, TASK-078
  - **Trazabilidad SDD:** ADR-06, plan §1.3 (S-2), plan §4.3.2 (jobs); EC-M3-04, RF-M3-04
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/rates-gateway.ts`
    - `apps/api/src/infrastructure/integrations/paralelo-bo.ts`
    - `apps/api/src/infrastructure/integrations/paralelo-bo.fake.ts`
    - `apps/api/test/unit/paralelo-bo.test.ts`
  - **Especificación de Implementación:** Cliente de `https://paralelo.bo/mcp` con `get_current_rate`, `get_historical_rate` y `convert_currency` (oficial), con *timeout* y validación de la respuesta. Descarta los valores ≤ 0, vacíos o con más de 2 decimales. El *fake* devuelve valores configurables y puede simular errores y lentitud.
  - **Criterios de Verificación (Tests & DoD):**
    - `EC-M3-04`: un valor 0, negativo o vacío se descarta.
    - Las respuestas se clasifican en compra y venta con `classifyBidAsk`.
    - Un *timeout* se informa como un fallo de la fuente, sin lanzar errores internos.

- [x] **`TASK-082`: Respaldo con el widget del BCB y su *fake***
  - **Dependencias:** Requiere TASK-081
  - **Trazabilidad SDD:** ADR-06 (TCO con respaldo en el BCB), plan §4.3.2 (`fx.fetchOfficial`)
  - **Archivos en Alcance:**
    - `apps/api/src/infrastructure/integrations/bcb.ts`
    - `apps/api/src/infrastructure/integrations/bcb.fake.ts`
    - `apps/api/test/unit/bcb.test.ts`
  - **Especificación de Implementación:** Lee el TCO del widget público del BCB, con su fecha de vigencia, y valida el valor como en TASK-081.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-082`: con una respuesta de ejemplo, devuelve el valor y su fecha de vigencia; con HTML inesperado, informa el fallo.

- [x] **`TASK-083`: Repositorios de tasas de mercado, monedas y eventos de tipo de cambio**
  - **Dependencias:** Requiere TASK-033
  - **Trazabilidad SDD:** plan §3.4, ADR-12; RF-M3-13, RN-09
  - **Archivos en Alcance:**
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/market-rate.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/currency.repository.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user-fx-event.repository.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/fx-repositories.test.ts`
  - **Especificación de Implementación:** `market_rate`: `upsertIfNewer`, `latest(kind)` y `series(kind, from, to)`. `currency`: `list`, `get`, `lockForUpdate`, `lockForShare` e `insert`. `user_fx_event`: `insert` y `eventsUntil(instant)`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-13`: `upsertIfNewer` solo reemplaza el valor del día si la observación es más reciente.
    - `RN-09`: las monedas y los eventos de un usuario no son visibles para otro.

- [x] **`TASK-084`: Jobs `fx.fetchParallel` y `fx.fetchOfficial`**
  - **Dependencias:** Requiere TASK-038, TASK-082, TASK-083
  - **Trazabilidad SDD:** plan §4.3.2 (jobs), plan §4.3.3 (una sola actualización a la vez); RF-M3-04, EC-M3-01, EC-M3-04, RNF-21
  - **Archivos en Alcance:**
    - `apps/api/src/application/jobs/fx.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/integration/fx-jobs.test.ts`
  - **Especificación de Implementación:** `fx.fetchParallel` corre si la última captura tiene más de 60 minutos, o a pedido. Guarda compra, venta y mediana del día de Bolivia. `fx.fetchOfficial` corre una vez al día con paralelo.bo y, si falla, con el BCB, y reintenta en cada tick hasta lograrlo. Una sola actualización a la vez con el lease `fx_refresh` de `JobRuns` (plan §4.0 y §4.3.3), también cuando es a pedido. El contenedor arma el `RatesGateway` real (paralelo.bo y BCB) o sus *fakes* según `env.INTEGRATIONS` (plan §1.4), y registra los dos jobs con `container.jobs.registerJob`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-04`: con una captura de hace 30 minutos no consulta; con una de hace 61, sí.
    - `EC-M3-01` / `RNF-21`: si la fuente falla, el último valor queda intacto.
    - `EC-M3-04`: un valor inválido no se guarda.
    - Si paralelo.bo falla para el oficial, se usa el BCB.

- [x] **`TASK-085`: `RatesService`: tasas vigentes y tasa de un movimiento**
  - **Dependencias:** Requiere TASK-080, TASK-083, TASK-069
  - **Trazabilidad SDD:** plan §4.3.1, plan §4.3.3; RF-M3-03, RF-M3-05, RF-M3-06, RF-M3-12, EC-M3-02, RN-04, RN-05
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/rates.service.ts`
    - `apps/api/test/integration/rates-service.test.ts`
    - `packages/domain/src/index.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user-settings.repository.ts`
  - **Especificación de Implementación:** `current(ctx)` arma `RatesCurrentDto` (referencias, `inUse`, brecha, moneda base y "otra moneda"). `ratesForMovement(tx, ctx, currencyCode, date)` devuelve `{ rateCurBob, rateUsdBob | null }` según RN-04 (1,00 para BOB; la tasa de la moneda agregada; `resolveUsdRate`). `currentRateFor(ctx, currencyCode)` sirve para los saldos actuales (RN-05). `@finanzas/domain` reexporta `resolveUsdRate`, `customRateOn` y los tipos `FxEvent`, `MarketSeries` y `UsdReference`. `UserSettingsRepository` suma un método (p. ej. `fxSettings(userId)`) que devuelve la moneda base del usuario, sin cambiar `UserSettingsData`.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Valor manual con prioridad" (parte de M3): con el valor manual en 10,00 y el paralelo en 10,40, `inUse` vale 10,00 y trae `since`.
    - `RF-M3-12`: con el oficial en uso, la brecha compara la mediana del paralelo contra el oficial.
    - `EC-M3-02`: sin ninguna tasa, `rateUsdBob` es `null` y `inUse.value` es `null`.
    - `RF-M3-06`: un movimiento en BOB guarda igualmente la tasa boliviano-dólar.
    - `EC-M3-02`: `ratesForMovement` lanza `RATE_REQUIRED` cuando el movimiento no es en BOB y `resolveUsdRate` devuelve `null` (plan §4.3.3). La prueba de ese error queda en TASK-121 (escenario "Sin ninguna tasa disponible"), porque el archivo de pruebas de esta tarea ya quedó cerrado.

- [x] **`TASK-086`: Endpoints de tasas: `/api/rates/current` y `/api/rates/history`**
  - **Dependencias:** Requiere TASK-084, TASK-085
  - **Trazabilidad SDD:** plan §4.3.2; RF-M3-04, RF-M3-05, RNF-04, RNF-27
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/routes/fx.routes.ts`
    - `apps/api/src/presentation/controllers/fx.controller.ts`
    - `apps/api/src/presentation/presenters/fx.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/rates.test.ts`
  - **Especificación de Implementación:** `GET /api/rates/current` responde al instante con lo guardado y, si la última captura del paralelo tiene más de 1 minuto, dispara `fx.fetchParallel` en segundo plano. `GET /api/rates/history?kind&range` devuelve un punto por día.
  - **Criterios de Verificación (Tests & DoD):**
    - `RNF-04`: con la fuente simulada lenta (5 s), `current` responde en menos de 100 ms.
    - `RF-M3-04`: una captura de hace más de 1 minuto dispara la actualización una sola vez.
    - `RNF-27` / `RF-M3-05`: cada valor incluye su fuente y su `observedAt`.
    - `history` con `range=30d` devuelve como máximo 30 puntos.

- [x] **`TASK-087`: Referencia del dólar, moneda base y valor manual**
  - **Dependencias:** Requiere TASK-086
  - **Trazabilidad SDD:** plan §4.3.2 (`PATCH /api/fx-settings`, `/api/fx/manual`), plan §4.3.3; RF-M3-03, RF-M3-11, RF-M3-13
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/fx-settings.service.ts`
    - `apps/api/src/presentation/routes/fx.routes.ts`
    - `apps/api/src/presentation/controllers/fx.controller.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/user-settings.repository.ts`
    - `apps/api/src/presentation/middlewares/require-json.ts`
    - `apps/api/test/http/fx-settings.test.ts`
  - **Especificación de Implementación:** `PATCH /api/fx-settings` actualiza la referencia (e inserta `reference_set`) y la moneda base (debe estar activa; si no, `CURRENCY_INACTIVE`). `PUT /api/fx/manual` activa el valor manual (`manual_usd_on`) y `DELETE` lo desactiva (`manual_usd_off`), en la misma transacción que `user_settings`. Nada se reescribe. `app.ts` monta el router de fx en `/api`; `UserSettingsRepository` suma un método (p. ej. `updateFx`) que escribe `base_currency`, `usd_reference` y el valor manual dentro de `uow.run`. `requireJson` deja pasar las mutaciones sin cuerpo (p. ej. `DELETE /api/fx/manual`); una con cuerpo que no es JSON sigue dando 415 y `checkOrigin` sigue aplicando.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-11`: cambiar la referencia o la base no modifica ninguna fila de `ledger_transaction`.
    - `RF-M3-13`: cada cambio de referencia queda en `user_fx_event`.
    - `RF-M3-03`: el valor manual activo no vence solo.
    - Una base inactiva da `CURRENCY_INACTIVE`.

- [x] **`TASK-088`: Monedas agregadas: crear, listar y actualizar su tasa**
  - **Dependencias:** Requiere TASK-086
  - **Trazabilidad SDD:** plan §4.3.2 (`/api/currencies`), plan §4.3.3; RF-M3-01, RF-M3-02, EC-M3-07, RF-M3-13
  - **Archivos en Alcance:**
    - `apps/api/src/application/services/currencies.service.ts`
    - `apps/api/src/presentation/routes/currencies.routes.ts`
    - `apps/api/src/presentation/controllers/currencies.controller.ts`
    - `apps/api/src/presentation/presenters/currencies.presenter.ts`
    - `apps/api/src/presentation/app.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/currency.repository.ts`
    - `apps/api/test/http/currencies.test.ts`
  - **Especificación de Implementación:** `POST` crea la moneda y su `custom_rate` con bloqueo por usuario. `PATCH /:code` cambia el símbolo o la tasa (un cambio de tasa inserta `custom_rate`); BOB y USD no tienen tasa propia (`SYSTEM_CURRENCY`). `GET` lista con la tasa vigente. `CurrencyRepository` suma un método (p. ej. `updateSymbol`) que escribe `currency.symbol` del usuario dentro de `uow.run`, en la misma transacción que el `custom_rate`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-02`: un código repetido da `CURRENCY_CODE_TAKEN`.
    - `EC-M3-07`: una tasa menor que Bs 0,01 da `RATE_BELOW_MINIMUM`.
    - `RF-M3-13`: cada cambio de tasa queda en el historial.
    - `RF-M3-01`: cambiar la tasa de USD da `SYSTEM_CURRENCY`.
    - Hay un test de aislamiento entre usuarios.

- [x] **`TASK-089`: Desactivar y reactivar monedas (`CurrencyUsage`)**
  - **Dependencias:** Requiere TASK-088
  - **Trazabilidad SDD:** plan §4.3.3 (Activa → Inactiva), plan §4.0 (servicios compartidos); RF-M3-01, EC-M3-05
  - **Archivos en Alcance:**
    - `apps/api/src/application/shared/currency-usage.ts`
    - `apps/api/src/application/services/currencies.service.ts`
    - `apps/api/src/presentation/routes/currencies.routes.ts`
    - `apps/api/src/presentation/controllers/currencies.controller.ts`
    - `apps/api/src/application/ports/repositories.ts`
    - `apps/api/src/infrastructure/persistence/repositories/currency.repository.ts`
    - `apps/api/src/presentation/middlewares/require-json.ts`
    - `apps/api/test/http/currencies-deactivate.test.ts`
  - **Especificación de Implementación:** `CurrencyUsage.register(module, check)` y `check(tx, userId, code)`, que devuelve `usedBy[]`. Cada módulo registra su verificación en su fase. `deactivate` toma `FOR UPDATE` sobre la moneda; no se permite con BOB, USD ni la base, ni si está en uso. `activate {rate}` inserta un `custom_rate`. `CurrencyRepository` suma un método (p. ej. `setStatus`) que escribe `currency.status` del usuario dentro de `uow.run`. `requireJson` trata `Content-Length: 0` como una petición sin cuerpo, para que `POST /:code/deactivate` no dé `UNSUPPORTED_MEDIA_TYPE`.
  - **Criterios de Verificación (Tests & DoD):**
    - `RF-M3-01`: desactivar BOB o USD da `SYSTEM_CURRENCY`, y desactivar la base, `BASE_CURRENCY`.
    - `EC-M3-05`: con un uso registrado de prueba, responde `CURRENCY_IN_USE {usedBy}`.
    - Reactivar exige una tasa nueva.

- [x] **`TASK-090`: Endpoint interno de prueba para fijar las tasas del *fake***
  - **Dependencias:** Requiere TASK-060, TASK-084
  - **Trazabilidad SDD:** plan §1.5 (`qa-e2e`: tasas fijas), plan §1.4 (*fakes*)
  - **Archivos en Alcance:**
    - `apps/api/src/presentation/internal/test-support.controller.ts`
    - `apps/api/src/composition/container.ts`
    - `apps/api/test/http/test-support.test.ts`
  - **Especificación de Implementación:** Solo con `INTEGRATIONS=fake`: `POST /internal/test/rates` fija la compra, la venta, la mediana y el oficial del *fake*, o simula una fuente caída, y fuerza `fx.fetchParallel`. `container.ts` expone el *fake* que crea `buildRateSources` para pasárselo al controlador. Cuerpo: `{ bid?, ask?, median?, official?, failure? }`; las tasas van como texto decimal (ADR-03) y `failure` es un `RateFailure` del puerto (`'TIMEOUT' | 'INVALID_VALUE' | 'SOURCE_ERROR'`) o `null` para quitar la falla. Responde 204; un cuerpo inválido da `VALIDATION_ERROR`.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-090`: después de fijar 10,10 y 10,30, las filas `parallel_bid` y `parallel_ask` de `market_rate` del día valen 10,10 y 10,30; con `failure` fijado, la llamada no escribe filas nuevas; con `INTEGRATIONS=real`, la ruta responde 404.

- [x] **`TASK-091`: Script de carga única del histórico de tasas (`fx-backfill`)**
  - **Dependencias:** Requiere TASK-083
  - **Trazabilidad SDD:** ADR-06, plan §4.3.2 (script `fx-backfill`)
  - **Archivos en Alcance:**
    - `packages/db/scripts/fx-backfill.ts`
    - `packages/db/package.json`
    - `pnpm-lock.yaml`
    - `packages/db/test/fx-backfill.test.ts`
  - **Especificación de Implementación:** Carga la mediana diaria del paralelo desde el 01/01/2024 (una consulta por segundo) y el oficial: 6,96 hasta el 26/06/2026 y la serie del BCB desde el 27/06/2026. Es idempotente, gracias a `upsertIfNewer`, y recibe el cliente de tasas por inyección.
  - **Criterios de Verificación (Tests & DoD):**
    - `TASK-091`: con un cliente simulado de 10 días, inserta 10 medianas y el oficial correcto a cada lado del 27/06/2026; correrlo dos veces no duplica nada.

- [x] **`TASK-092`: Web: `useCurrentRate` y ficha del dólar en la cabecera**
  - **Dependencias:** Requiere TASK-072, TASK-086, TASK-090
  - **Trazabilidad SDD:** plan §4.3.4 (`RateChip`, estado), plan §4.2.4; spec §2.2.1 (cabecera); RF-M3-04
  - **Archivos en Alcance:**
    - `apps/web/src/features/fx/api.ts`
    - `apps/web/src/features/fx/hooks/use-current-rate.ts`
    - `apps/web/src/features/fx/components/rate-chip.tsx`
    - `apps/web/src/app/layout/header.tsx`
    - `apps/web/src/locales/es-BO/fx.json`
    - `e2e/m3-rate-chip.spec.ts`
  - **Especificación de Implementación:** `useCurrentRate()` con la clave `['rates','current']`, refrescada cada 60 s con `background: true`. `RateChip` muestra "$ 10,25" con la referencia en uso, un distintivo si es el valor manual o "$ —" si no hay tasa, y lleva a `/tipo-de-cambio`.
  - **Criterios de Verificación (Tests & DoD):**
    - Con las tasas del *fake* fijadas, la ficha muestra el valor de la mediana.
    - Con la fuente caída y sin datos, muestra "$ —".
    - Con el valor manual activo, muestra el distintivo.

- [x] **`TASK-093`: Web: panel de Tipo de cambio**
  - **Dependencias:** Requiere TASK-087, TASK-092
  - **Trazabilidad SDD:** plan §4.3.4 (`/tipo-de-cambio`); RF-M3-03, RF-M3-05, RF-M3-11, RF-M3-12, RNF-27
  - **Archivos en Alcance:**
    - `apps/web/src/features/fx/components/current-rates-card.tsx`
    - `apps/web/src/features/fx/components/gap-card.tsx`
    - `apps/web/src/features/fx/components/reference-selector.tsx`
    - `apps/web/src/features/fx/components/manual-value-card.tsx`
    - `apps/web/src/features/fx/components/manual-value-banner.tsx`
    - `apps/web/src/features/fx/routes.tsx`
    - `apps/web/src/app/router.tsx`
    - `apps/web/src/locales/es-BO/fx.json`
    - `e2e/m3-fx-panel.spec.ts`
  - **Especificación de Implementación:** Las 4 referencias con "actualizado hace X" y la fuente enlazada; la brecha en % y en Bs; el selector de referencia; el valor manual con el aviso fijo "Usando tu valor manual (Bs X) desde hace N días". Toda mutación invalida todas las consultas.
  - **Criterios de Verificación (Tests & DoD):**
    - Escenario "Valor manual con prioridad" (UI): activar Bs 10,00 muestra el aviso y la ficha con su distintivo.
    - `RNF-27`: el enlace a paralelo.bo se ve junto a cada tasa del paralelo.
    - `RF-M3-05`: cada tasa muestra "actualizado hace X".
    - Sin violaciones de axe.

- [x] **`TASK-094`: Web: gráfico de evolución de las tasas**
  - **Dependencias:** Requiere TASK-093
  - **Trazabilidad SDD:** plan §4.3.4 (`RateHistoryChart`), ADR-03 (solo los gráficos usan `number`); spec §2.3.1 (consultar el panel)
  - **Archivos en Alcance:**
    - `apps/web/src/features/fx/hooks/use-rate-history.ts`
    - `apps/web/src/features/fx/components/rate-history-chart.tsx`
    - `apps/web/src/features/fx/routes.tsx`
    - `apps/web/src/locales/es-BO/fx.json`
    - `e2e/m3-rate-history.spec.ts`
  - **Especificación de Implementación:** Gráfico de Recharts con pestañas 7d, 30d, 90d y 1a, con un punto por día. La conversión a `number` ocurre solo dentro del gráfico. Tiene un texto alternativo con el último valor.
  - **Criterios de Verificación (Tests & DoD):**
    - Cambiar de pestaña pide el rango correcto y el gráfico se dibuja.
    - Las pestañas se manejan con el teclado.

- [x] **`TASK-095`: Web: lista de monedas, agregar, editar la tasa y desactivar**
  - **Dependencias:** Requiere TASK-089, TASK-093
  - **Trazabilidad SDD:** plan §4.3.4 (`CurrenciesList`, `AddCurrencyDialog`); RF-M3-02, EC-M3-05, EC-M3-07
  - **Archivos en Alcance:**
    - `apps/web/src/features/fx/components/currencies-list.tsx`
    - `apps/web/src/features/fx/components/add-currency-dialog.tsx`
    - `apps/web/src/features/fx/components/edit-currency-rate-dialog.tsx`
    - `apps/web/src/features/fx/routes.tsx`
    - `apps/web/src/locales/es-BO/fx.json`
    - `e2e/m3-currencies.spec.ts`
  - **Especificación de Implementación:** Agregar una moneda con código, símbolo y valor en Bs; editar su tasa; desactivarla y reactivarla. Los errores se traducen con el catálogo.
  - **Criterios de Verificación (Tests & DoD):**
    - Agregar EUR a 11,20 la muestra en la lista.
    - `EC-M3-07`: una tasa de 0,001 muestra la explicación de valor demasiado bajo.
    - `EC-M3-05`: desactivar una moneda en uso muestra qué la usa (cubierto cuando existan cuentas, TASK-101).

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]] · [[ADR-06 - Fuentes de tasas de cambio]] · [[ADR-12 - Datos de mercado globales]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.8 Disponibilidad y tolerancia a fallos]] · [[Spec 3.9 Auditoría y retención]]
- **Fases de tareas:** [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 2 - Contratos y catálogos compartidos]] · [[Tareas Fase 3 - Dominio transversal]] · [[Tareas Fase 4 - Base del API]] · [[Tareas Fase 6 - M1 Acceso y cuenta de usuario (V1.0)]]
- **Spec / Plan / Constitución:** [[Plan 1.3 Registro de decisiones (ADR)]] · [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]] · [[Plan 1.5 Integración y despliegue continuos (ADR-20)]] · [[Plan 3.4 Ajustes y tipo de cambio (M3, M9, M10)]] · [[Plan 4.0 Elementos transversales]] · [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]] · [[Plan 4.6 M6 - Transacciones (V1.0)]] · [[Spec 1.5 Glosario]] · [[Spec 1.6 Reglas de negocio transversales (RN)]] · [[Spec 2.2 M2 - Navegación y estructura (V1.0)]] · [[Spec 2.3 M3 - Monedas y tipo de cambio (V1.0)]]
- **Entidades:** [[Entidad - Currency]] · [[Entidad - LedgerTransaction]] · [[Entidad - MarketRate]] · [[Entidad - UserFxEvent]] · [[Entidad - UserSettings]]

