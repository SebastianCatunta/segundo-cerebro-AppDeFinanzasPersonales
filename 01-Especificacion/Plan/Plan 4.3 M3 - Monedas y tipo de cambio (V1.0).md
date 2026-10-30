---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.3 M3 - Monedas y tipo de cambio (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M3"
modulo: "M3"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.2 M2 - Navegación y estructura (V1.0)]] · → [[Plan 4.4 M4 - Cuentas (V1.0)]]

### 4.3 M3 — Monedas y tipo de cambio (V1.0)

#### 4.3.1 Contratos

```ts
const Money   = z.string().regex(/^-?\d{1,12}(\.\d{1,2})?$/);              // ADR-03
const Rate    = z.string().regex(/^\d{1,12}(\.\d{1,2})?$/).refine(v => new Decimal(v).gte('0.01'));  // RF-M3-02
const CurrencyCode = z.string().regex(/^[A-Z]{3}$/);
const UsdReference = z.enum(['parallel_bid','parallel_ask','parallel_median','official']);

RatesCurrentDto = {
  references: Record<UsdReference, { value: Rate; observedAt: string; source: 'paralelo_bo'|'bcb'|'seed' } | null>,
  inUse: { kind: UsdReference | 'manual'; value: Rate | null; since?: string },
  gap: { pct: string; bs: Money; comparedKind: UsdReference | 'manual' } | null,   // RF-M3-12
  base: CurrencyCode, other: CurrencyCode
}
RateHistoryQuery = z.object({ kind: UsdReference, range: z.enum(['7d','30d','90d','1y']) });
FxSettingsInput  = z.object({ usdReference: UsdReference.optional(), baseCurrency: CurrencyCode.optional() });
ManualUsdInput   = z.object({ value: Rate });
CreateCurrencyInput = z.object({ code: CurrencyCode, symbol: z.string().trim().min(1).max(5), rate: Rate });
UpdateCurrencyInput = z.object({ symbol: z.string().trim().min(1).max(5).optional(), rate: Rate.optional() });
```

**Funciones de `packages/domain/fx`:**

```ts
// Tipos de entrada (se declaran y exportan desde packages/domain/src/fx.ts; no dependen de Prisma)
type FxEvent = {                      // fila de user_fx_event (§3.4), ya en camelCase
  kind: 'reference_set' | 'manual_usd_on' | 'manual_usd_off' | 'custom_rate';
  currencyCode: string | null;        // 'USD' en manual_usd_*; la moneda agregada en custom_rate
  reference: UsdReference | null;     // solo en reference_set
  value: Decimal | null;              // null en reference_set y manual_usd_off
  effectiveAt: Instant;
};
type MarketSeries = Record<UsdReference, ReadonlyArray<{ rateDate: LocalDate; value: Decimal }>>; // filas de market_rate por kind, orden libre
// Estado del usuario al final del día D = eventos con effectiveAt < startOfDayInstant(D + 1, tz). Hoy y fechas pasadas usan
// la misma regla (no hay eventos futuros). Sin reference_set, la referencia es 'parallel_median'. D se usa tal cual como
// rate_date (calendario de Bolivia). Los eventos pueden llegar sin ordenar.

classifyBidAsk(a: Decimal, b: Decimal): { bid: Decimal; ask: Decimal };     // compra = menor, venta = mayor
resolveUsdRate(input: { events: FxEvent[]; series: MarketSeries; date: LocalDate; tz: string; now: Instant }): Decimal | null;
// hoy: referencia en uso o manual activo · fecha pasada: estado del usuario al final de D (manual si estaba activo;
// si no, la referencia de ese día) → valor de D en el calendario de Bolivia → si falta compra o venta, mediana de D
// → si D no tiene datos, el día anterior más cercano → antes del primer dato, el primer valor conocido (RF-M3-06, RF-M3-13)
transferPrefill(input: { from: CurrencyCode; to: CurrencyCode; date: LocalDate; manual: Decimal | null;
  parallel: { bid: Decimal; ask: Decimal } | null; customRates: Record<CurrencyCode, Decimal> }): Decimal | null;   // RF-M3-07
// Quien llama resuelve lo de `date` (manual activo ese día, bid/ask del día, tasas con customRateOn); la función no consulta nada.
// Devuelve la tasa declarada (§4.6.1) o null si falta alguna. Bs por unidad: BOB = 1; USD = manual, o ask si se compra USD (to) y bid si se
// vende (from); otra moneda = customRates[code]. De BOB a X: Bs(X). De X a BOB: Bs(X). Entre dos monedas no BOB: Bs(from) ÷ Bs(to), round2.
// from = to → null.
amountInFrom(amountOut: Decimal, rate: Decimal, from: CurrencyCode): Decimal;             // from BOB: amountOut ÷ rate; si no: amountOut × rate; round2
rateFromAmounts(amountOut: Decimal, amountIn: Decimal, from: CurrencyCode): Decimal;      // inversa: from BOB: amountOut ÷ amountIn; si no: amountIn ÷ amountOut; round2
// La tasa recalculada se redondea a 2 decimales (RN-06), así que no siempre reproduce el monto que llega: el error de amountInFrom(amountOut, rate)
// puede llegar a amountOut × 0,005. La diferencia máxima de 0,01 de RF-M3-08 solo se garantiza para montos pequeños (amountOut ≤ 2 en la moneda
// de origen no BOB); las pruebas no deben exigirla con montos grandes. El monto que llega que el usuario editó es el que se guarda.
customRateOn(events: FxEvent[], code: CurrencyCode, date: LocalDate, tz: string): Decimal | null;
// Equivale a user_rate_on (§3.4): último custom_rate de `code` con effectiveAt antes del inicio de D+1 en tz; si ninguno, el primero conocido;
// null si la moneda no tiene ningún custom_rate.
convert(amount: Decimal, rateCurBob: Decimal, rateBaseBob: Decimal): Decimal; // ROUND_HALF_UP alejado del cero, 2 decimales
gap(parallel: Decimal, official: Decimal): { pct: Decimal; bs: Decimal };
```

#### 4.3.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/rates/current` | Responde al instante con lo guardado. Si la última captura del paralelo tiene más de 1 min, dispara `fx.fetchParallel` en segundo plano (RNF-04). | — |
| `GET /api/rates/history?kind&range` | Un punto por día, desde `market_rate`. | `VALIDATION_ERROR` |
| `PATCH /api/fx-settings` | Actualiza `user_settings` e inserta `reference_set` si cambia la referencia. La base debe ser una moneda activa. | `CURRENCY_INACTIVE 422` |
| `PUT /api/fx/manual` · `DELETE /api/fx/manual` | Actualiza `manual_usd_value` y `since`, e inserta `manual_usd_on` o `manual_usd_off`. | — |
| `GET /api/currencies` · `POST /api/currencies` | Crea la moneda + `custom_rate` (con bloqueo por usuario). | `CURRENCY_CODE_TAKEN 409` · `RATE_BELOW_MINIMUM 422` |
| `PATCH /api/currencies/:code` | Un cambio de tasa inserta `custom_rate`. BOB y USD no tienen tasa propia. | `SYSTEM_CURRENCY 422` |
| `POST /api/currencies/:code/deactivate` · `/activate {rate}` | Ver 4.3.3. | `CURRENCY_IN_USE 409 {usedBy[]}` · `SYSTEM_CURRENCY 422` · `BASE_CURRENCY 422` |

**Jobs:**
- `fx.fetchParallel`: corre si la última captura tiene más de 60 min, o a pedido. Llama a `get_current_rate`, valida (> 0, ≤ 2 decimales, ≥ 0,01; EC-M3-04), clasifica compra y venta y hace `INSERT … ON CONFLICT (kind, rate_date) DO UPDATE … WHERE excluded.observed_at > market_rate.observed_at`.
- `fx.fetchOfficial`: una vez al día. Usa `convert_currency direction=official`; si falla, el widget del BCB. Guarda en la fecha de vigencia y reintenta en cada tick hasta lograrlo.
- Script `fx-backfill` (una vez): la mediana diaria desde el 01/01/2024 (1 consulta por segundo) y el oficial (6,96 hasta el 26/06/2026; la serie del BCB desde el 27/06/2026).

**Script `fx-backfill` (`packages/db/scripts/fx-backfill.ts`).** `packages/db` no puede importar de `apps/api`, así que el script define su propio cliente y escribe con SQL propio:

```ts
interface BackfillClient {
  parallelMedianOn(date: LocalDate): Promise<Decimal | null>;                          // null si la fuente no tiene dato ese día
  officialSeries(): Promise<ReadonlyArray<{ effectiveDate: LocalDate; value: Decimal }>>;  // TCO del BCB desde el 27/06/2026, una entrada por vigencia
}
runFxBackfill(input: { db: PrismaClient; client: BackfillClient; from: LocalDate; to: LocalDate; now?: () => Date;
                       sleep?: (ms: number) => Promise<void> }): Promise<{ parallel: number; official: number }>;
```
- Una fila por día de `from` a `to` para cada tipo. `parallel_median`: `parallelMedianOn(día)` (se omite el día si da `null`), fuente `paralelo_bo`. Entre consultas espera 1 s con `sleep` (el valor por defecto es el real; las pruebas lo reemplazan).
- `official`: hasta el 26/06/2026 es 6,96 con fuente `seed`. Desde el 27/06/2026, el valor de la serie con la `effectiveDate` más reciente que sea ≤ al día, con fuente `bcb`; si la serie no tiene ninguna anterior, se omite el día.
- `observed_at` determinista: el menor entre `now()` y el inicio del día siguiente en La Paz. Se escribe con `INSERT … ON CONFLICT (kind, rate_date) DO UPDATE … WHERE excluded.observed_at > market_rate.observed_at`, así que correrlo dos veces no duplica nada y no pisa lo que ya escribieron los jobs.
- Cliente real (solo en la ejecución desde la línea de comandos, sin pruebas): `parallelMedianOn` llama a `get_historical_rate` de paralelo.bo; `officialSeries` lee la fila «BANCOS (MEDIANA PONDERADA POR MONTO)» de la primera tabla de `https://www.bcb.gob.bo/bcb_tco_publico_evolutivo.php` (cabeceras `d-mes` por fecha de corte; el año sale del título «Fecha de corte dd/mm/aaaa → dd/mm/aaaa») y fija `effectiveDate` = día siguiente a la fecha de corte.

**Puerto `RatesGateway` (`application/ports/rates-gateway.ts`) y sus adaptadores.** Una fuente que falla no lanza: devuelve un resultado.

```ts
type RateFailure = 'TIMEOUT' | 'INVALID_VALUE' | 'SOURCE_ERROR';   // SOURCE_ERROR: red, HTTP no 200, error JSON-RPC o isError
type RateResult<T> = { ok: true; value: T } | { ok: false; reason: RateFailure };
type ParallelQuote = { median: Decimal; bid: Decimal | null; ask: Decimal | null; observedAt: Date };  // bid/ask ya con classifyBidAsk
type OfficialQuote = { value: Decimal; effectiveDate: LocalDate | null; observedAt: Date };            // vigencia de la tasa, si la fuente la dice
interface RatesGateway {
  fetchParallel(): Promise<RateResult<ParallelQuote>>;
  fetchOfficial(): Promise<RateResult<OfficialQuote>>;
  fetchParallelOn(date: LocalDate): Promise<RateResult<{ median: Decimal; date: LocalDate }>>;          // para fx-backfill
}
createParaleloBoGateway(opts: { url: string; timeoutMs: number; fetch?: typeof fetch; now?: () => Date }): RatesGateway;
createFakeRatesGateway(opts?: { parallel?: ParallelQuote; official?: OfficialQuote; failure?: RateFailure | null; delayMs?: number }):
  RatesGateway & { configure(patch: Partial<NonNullable<typeof opts>>): void; calls: { parallel: number; official: number; parallelOn: number } };
```

Respuestas reales de `https://paralelo.bo/mcp` (JSON-RPC 2.0 por POST, sin sesión ni autenticación; cabeceras `Content-Type: application/json` y `Accept: application/json, text/event-stream`; verificadas el 2026-10-19). Los datos útiles vienen en `result.structuredContent`; el texto de `result.content[0].text` solo se lee para la vigencia del oficial:
- `get_current_rate {}` → `{ median: 11.83, buy: 11.85, sell: 11.81, timestamp: "2026-10-19T23:04:58.836Z", … }`. Números JSON. `buy` puede ser mayor que `sell`, por eso se clasifica con `classifyBidAsk`. `observedAt` = `timestamp`. La mediana debe ser válida (si no, `INVALID_VALUE`); si `buy` o `sell` no es válido, `bid` y `ask` quedan en `null` y se usa la mediana (RF-M3-13).
- `get_historical_rate { date: "YYYY-MM-DD" }` → `{ date, median, requestedDate, illustrative: false }`. Si `illustrative` es `true`, se trata como `INVALID_VALUE`. Con un parámetro inválido responde `result.isError: true`.
- `convert_currency { amount: 1, from: "USD", to: "BOB", direction: "official" }` → `{ result: 11.69, rate: 11.69, … }`, y el texto trae «(vigencia 2026-10-17)», de donde sale `effectiveDate` (expresión `vigencia (\d{4}-\d{2}-\d{2})`; `null` si no aparece). `observedAt` = ahora. El valor es `rate`.
- Valor válido: número finito, ≥ 0,01 y con a lo sumo 2 decimales (EC-M3-04). Si no, `INVALID_VALUE`. El *timeout* da `TIMEOUT`.

**Respaldo del BCB (`infrastructure/integrations/bcb.ts`).** `createBcbGateway(opts: { url: string; timeoutMs: number; fetch?: typeof fetch; now?: () => Date }): Pick<RatesGateway, 'fetchOfficial'>` y `createFakeBcbGateway(opts?: { official?: OfficialQuote; failure?: RateFailure | null; delayMs?: number })` con la misma forma que el *fake* de paralelo.bo (`configure`, `calls.official`). La URL es `https://www.bcb.gob.bo/bcb_tco_publico_ultima_cotizacion.php`: un `GET` que devuelve un fragmento de HTML (sin autenticación), verificado el 2026-10-19. Se lee con expresiones regulares, sin analizador de HTML:
- Valor: el texto de `<div class="tco-public-value">Bs 11,69/$us</div>`; la coma decimal se convierte en punto y se valida como en paralelo.bo.
- Vigencia: `<span class="tco-public-vigencia">VIGENCIA: DEL SÁBADO 17 DE OCTUBRE DE 2026 AL LUNES 19 DE OCTUBRE DE 2026</span>`. `effectiveDate` es la primera fecha («17 de octubre de 2026» → `2026-10-17`), con los meses en español sin importar mayúsculas o acentos; `null` si no se puede leer.
- Si falta el elemento del valor (HTML inesperado) → `SOURCE_ERROR`; si está pero no es un valor válido → `INVALID_VALUE`. HTTP distinto de 200 o error de red → `SOURCE_ERROR`; *timeout* → `TIMEOUT`. `observedAt` = ahora.

#### 4.3.3 Ciclo de vida y concurrencia
- **Moneda Activa → Inactiva:** `SELECT … FOR UPDATE` sobre `currency` → cada módulo responde a `currencyUsage.check(tx, userId, code)` (cuentas activas, metas no archivadas, presupuestos activos o pausados, deudas activas, reglas no eliminadas) → `UPDATE … SET status = 'inactive'`. Toda creación con esa moneda toma `FOR SHARE` y verifica `status = 'active'`, así no hay carreras.
- **Inactiva → Activa:** exige una tasa nueva → inserta `custom_rate`.
- **Valor manual:** se activa o desactiva con una transacción que actualiza `user_settings` e inserta el evento. Nunca vence solo.
- **Una sola actualización a la vez:** el lease `fx_refresh` de `job_run` (§4.0), también cuando la actualización es a pedido. Si la fuente falla, se conserva el último valor (EC-M3-01).
- **Sin ninguna tasa (EC-M3-02):** si `resolveUsdRate` devuelve null y el movimiento no es en BOB → `RATE_REQUIRED 409`. El cliente reenvía con `manualUsdRate`, que en la misma transacción activa el valor manual y queda como tasa del movimiento. Sin tasa, los equivalentes se muestran como "Sin tipo de cambio" (EC-M8-04).
- **Cambiar la referencia o la base (RF-M3-11):** nada se reescribe. El cliente invalida todas las consultas.

#### 4.3.4 UI y estado
- **`/tipo-de-cambio`:**
  - `<CurrentRatesCard>`: las 4 referencias, "actualizado hace X" y la fuente enlazada (RF-M3-05, RNF-27);
  - `<GapCard>`, `<ReferenceSelector>` y `<ManualValueCard>` (con `<ManualValueBanner>` "Usando tu valor manual…");
  - `<RateHistoryChart>` (Recharts, pestañas 7d/30d/90d/1a; los `number` solo dentro del gráfico);
  - `<CurrenciesList>` y `<AddCurrencyDialog>`.
- **`/ajustes/monedas`:** `<BaseCurrencySelect>` + el mismo panel.
- **`<RateChip>`** en la cabecera, con un distintivo si el valor manual está activo y "$ —" si no hay tasa.
- **Estado:** `useCurrentRate()` (`['rates','current']`, cada 60 s en segundo plano) y `useRateHistory(kind, range)`. Toda mutación de M3 llama a `invalidateQueries()` global.

---

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M8 - Inicio (dashboard)]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.9 Auditoría y retención]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - Currency]] · [[Entidad - JobRun]] · [[Entidad - MarketRate]] · [[Entidad - UserSettings]]

