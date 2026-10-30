---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.0 Elementos transversales"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · → [[Plan 4.1 M1 - Acceso y cuenta de usuario (V1.0)]]

### 4.0 Elementos transversales

**Cliente fetch tipado (`apps/web/src/lib/api-client.ts`):**

```ts
type Endpoint<I, O> = { method: 'GET'|'POST'|'PATCH'|'PUT'|'DELETE'; path: string; input: ZodType<I>; output: ZodType<O> };
function call<I, O>(e: Endpoint<I, O>, input: I, opts?: { background?: boolean; signal?: AbortSignal }): Promise<O>;
// background → encabezado X-Background: 1 (no renueva la sesión, RF-M1-07)
// problem+json → lanza ApiError { code, status, data, traceId }
// SESSION_EXPIRED → ui-store.openSessionExpired() sin navegar (RF-M2-08)
// TypeError de red → online.setOffline() (RF-M2-07)
```

**Formato de error (ADR-09):**

```json
{ "type": "https://errors.app/NEGATIVE_BALANCE", "title": "NEGATIVE_BALANCE", "status": 422,
  "code": "NEGATIVE_BALANCE", "data": { "accountId": "…", "resultingBalance": "-5.00" }, "traceId": "…" }
```

**Catálogo común de errores:** `VALIDATION_ERROR 400` · `SESSION_EXPIRED 401` · `NOT_FOUND 404` · `IDEMPOTENCY_CONFLICT 409` · `LIMIT_REACHED 409` · `RELEASE_NOT_AVAILABLE 404` · `INTERNAL_ERROR 500` · `UNSUPPORTED_MEDIA_TYPE 415` (mutación sin cuerpo JSON, `requireJson`) · `ORIGIN_NOT_ALLOWED 403` (`Origin` ajeno a `WEB_ORIGIN`, `checkOrigin`). Con estos dos, el catálogo completo tiene 81 códigos. Una mutación sin cabecera `Origin` (cliente que no es un navegador) no se rechaza: la sesión viaja en cookie `SameSite=Lax`. Los errores del parser JSON (cuerpo mal formado, demasiado grande o con charset inválido) responden `VALIDATION_ERROR 400`.

**Servicios compartidos del API** (capa de aplicación; la transacción y el bloqueo los da el puerto `UnitOfWork`, implementado en infraestructura):

```ts
// application/ports/unit-of-work.ts (lo implementa infrastructure/persistence/unit-of-work.ts)
interface UnitOfWork {
  run<T>(fn: (repos: Repositories) => Promise<T>,
         opts?: { userLock?: string; readOnly?: boolean }): Promise<T>;   // transacción + pg_advisory_xact_lock
}
interface Repositories { accounts: AccountRepository; transactions: TransactionRepository; /* … uno por entidad */ }
interface Clock { now(): Instant; todayFor(timezone: string): LocalDate } // fecha local (RN-07, RNF-20)
assertLimit(repos, entity, max): Promise<void>;                           // RNF-28 → LIMIT_REACHED

interface BalanceDelta { accountId: string; amount: Decimal }             // con signo
interface EarmarkWithdrawal { goalId: string; accountId: string; amount: Decimal }
BalanceGuard.apply(tx, userId, deltas: BalanceDelta[],
  opts: { earmarkWithdrawals?: EarmarkWithdrawal[]; mode: 'interactive' | 'automatic' | 'batch' }): Promise<void>;
// 1) SELECT account FOR UPDATE ordenadas por id · 2) saldo vigente
// 3) efectivo o billetera < 0 → NEGATIVE_BALANCE 422 {accountId, resultingBalance}
// 4) (V1.1) saldo < Σ apartados en una cuenta no dedicada:
//      interactive → EARMARK_CONFIRMATION_REQUIRED 409 {shortfall, proposal}, salvo que las withdrawals cubran el faltante
//      automatic (recurrentes) → AutoBlocked (el llamador crea un pendiente) · batch → Skip
LedgerHooks.afterChange(tx, userId, change: { dates: LocalDate[]; categoryIds: string[]; accountIds: string[] }): Promise<void>;
// → presupuestos (tardíos, umbrales) · metas (hitos) · avisos
```

**Tick de jobs (`POST /internal/jobs/tick`):** exige el encabezado `x-jobs-secret`, responde en menos de 25 s y procesa por lotes con este orden:
1. `fx.fetchParallel`
2. `fx.fetchOfficial`
3. `outbox.send`
4. `recurring.generate`
5. `budgets.close`
6. `budgets.defaultDecision`
7. `recurring.expirePending`
8. `notifications.scheduled`
9. `maintenance` (purga de borrados y deshacer vencidos, descarte de registros sin confirmar, retención de avisos y logs)

Cada job:
- toma su *lease* en `job_run` con `JobRuns.tryAcquire(job, now)`: `INSERT … ON CONFLICT (job) DO NOTHING` y después `UPDATE job_run SET locked_until = now + 5 min, last_started_at = now WHERE job = $1 AND (locked_until IS NULL OR locked_until < now)`. Si no se actualizó ninguna fila, otra corrida lo tiene y lo salta. Al terminar, con éxito o con error, `JobRuns.finish(job, now, error?)` vuelve `locked_until` a NULL y registra el fin y el error. Si el proceso muere, el lease vence solo a los 5 minutos;
- recorre a los usuarios por lotes, con `withUserLock` por usuario;
- es idempotente gracias a claves únicas y transiciones condicionadas;
- registra su ejecución en `job_run`.

**Por qué un lease y no `pg_try_advisory_lock`:** un *advisory lock* de sesión vive en una conexión. Con el pool de Prisma, y en producción con el pooler de Neon (PgBouncer en modo transacción), tomarlo y soltarlo pueden caer en conexiones distintas: el bloqueo queda tomado y el job se salta para siempre. El lease es una fila con vencimiento y funciona con cualquier conexión. Los bloqueos de transacción (`pg_advisory_xact_lock`, el bloqueo por usuario) no tienen este problema, porque se liberan con su transacción.

La primera petición autenticada de cada usuario en el día ejecuta `catchUpUser(userId)`, que corre los mismos jobs solo para él (ADR-01).

**Costo de una petición (RNF-03, RNF-29):** el tiempo de una lectura es, sobre todo, el número de viajes secuenciales a la base multiplicado por la latencia entre el API y Neon (50 a 150 ms si las regiones difieren). Reglas:
- **Medición:** cada respuesta lleva `Server-Timing` (`total`, `db` y `queries`, solo números) y el registro de la petición incluye `durationMs` y `queries`, para ver el costo real en producción.
- **Sesión en una consulta:** `requireSession` resuelve la sesión, la última actividad y la zona horaria con una sola sentencia (hoy son varias). Sin caché: revocar una sesión surte efecto en la siguiente acción (EC-M1-05, EC-M1-06).
- **Lecturas sin bloqueo por usuario:** una ejecución `readOnly` del `UnitOfWork` no toma el *advisory lock* (solo lo necesitan las escrituras, RNF-10) y corre en `REPEATABLE READ`: sus sentencias ven una sola foto de la base y no esperan a las escrituras del mismo usuario. Quien escribe sigue tomando el bloqueo.
- **Un endpoint, pocas transacciones:** un servicio no abre una transacción por cada dato; lo que se pide junto se lee junto, y las lecturas independientes (gráficos, cuentas, recientes) corren en paralelo con `Promise.all`. Presupuesto de sentencias SQL por petición, que verifica TASK-261: `GET /api/me` ≤ 8, `GET /api/dashboard` ≤ 35 y cualquier otra lectura de lista ≤ 12. Como el conteo no muestra cuánto se encadena, las pruebas también repiten estas lecturas con `DB_LATENCY_MS=25` (cada operación de Prisma espera 25 ms, solo fuera de producción) y exigen que el Inicio responda en menos de 700 ms y cada lista en menos de 400 ms.
- **Deuda conocida (TASK-261):** al cerrar la Fase 27, `GET /api/accounts` ejecuta 21 sentencias (566 ms con `DB_LATENCY_MS=25`) y `GET /api/transactions` 32 (929 ms), sobre el presupuesto de 12. Antes de la fase eran 46 y 37. Las pruebas de TASK-261 fijan para estos dos endpoints el tope medido (21 y 32 sentencias; 900 y 1200 ms con 25 ms) para detectar cualquier retroceso, y el objetivo sigue siendo 12 y 400 ms. El tiempo real depende de la distancia entre el API y Neon (TASK-260): en la misma región, 32 sentencias son décimas de segundo.
- **Web:** la sesión y los datos de la pantalla se piden a la vez que baja su código: el *loader* de la ruta precarga la consulta principal, el enlace de cada pestaña la precarga al apuntar o tocar, y mientras tanto se muestra un esqueleto, nunca una pantalla en blanco.
- **Despliegue:** el API y la base de datos van en la misma región (`region` en `render.yaml` y la región del proyecto de Neon), con `DATABASE_URL` por el pooler de Neon y un límite de conexiones suficiente para las lecturas en paralelo.

---

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]]
- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]] · [[ADR-09 - Errores problem+json]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.10 Límites por usuario]] · [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.7 Tiempo]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - JobRun]]

