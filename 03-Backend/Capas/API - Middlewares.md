---
tipo: "backend"
fuente: "apps/api/src/presentation/middlewares"
tags:
  - "backend/presentacion"
actualizado: "2026-10-30"
---

# Middlewares de Express

Cadena global en `app.ts`: `traceId` → `serverTiming` → `requestLog` → `checkOrigin` → `requireJson` → `express.json()` → `catchUp`, después los routers y al final `errorHandler`. Por ruta: `requireSession`, `trackActivity`, `validate(schema)` y `releaseGate(module)`.

| Archivo | Líneas | Descripción (comentario del código) | Exporta |
|---|---|---|---|
| `catch-up.ts` | 33 | The first authenticated request of a user in their local day starts `catchUpUser` (ADR-01) without waiting for it. The mark of "already ran today" lives in memory: the jobs are idempotent. | `CatchUpDeps`, `catchUp` |
| `check-origin.ts` | 17 |  | `checkOrigin` |
| `error-handler.ts` | 61 |  | `sendProblem`, `errorHandler` |
| `release-gate.ts` | 16 |  | `releaseGate` |
| `require-json.ts` | 34 | A declared length of zero, or an empty one, announces no body. | `requireJson` |
| `require-session.ts` | 104 | Always set by `requireSession`; other suites that stub `req.auth` may leave it out. | `SessionContext`, `SessionRecord`, `SessionActivityReader`, `RequireSessionDeps`, `requireSession` |
| `server-timing.ts` | 34 | Milliseconds with one decimal; the header carries numbers only (RNF-17). | `serverTiming` |
| `track-activity.ts` | 33 | Renews the activity of the session `requireSession` left in the request; it queries nothing. | `TrackActivityDeps`, `trackActivity` |
| `validate.ts` | 21 |  | `validate` |

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-01 - Jobs con cron externo]]
- **Requerimientos no funcionales:** [[Spec 3.5 Privacidad y seguridad]]

