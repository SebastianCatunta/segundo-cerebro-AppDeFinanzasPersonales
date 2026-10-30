---
tipo: flujo
tags: [arquitectura/flujo, backend]
---
# 🔁 Flujo · Una petición HTTP dentro del API

↑ [[API - Visión general]]

Recorrido de cualquier petición por `apps/api/src/presentation/app.ts`. Todos los endpoints están en el [[Catálogo de endpoints]].

```mermaid
flowchart TB
  R[Request] --> T[traceId<br/>UUID por petición]
  T --> ST[serverTiming<br/>total · db · queries]
  ST --> LOG[requestLog<br/>JSON: método, ruta, status, ms, queries]
  LOG --> CO{checkOrigin<br/>mutación con Origin ≠ WEB_ORIGIN?}
  CO -- sí --> E403[403 ORIGIN_NOT_ALLOWED]
  CO -- no --> RJ{requireJson<br/>cuerpo sin JSON?}
  RJ -- sí --> E415[415 UNSUPPORTED_MEDIA_TYPE]
  RJ -- no --> JP[express.json]
  JP --> CU[catchUp<br/>1ª petición del día → jobs del usuario]
  CU --> RT[Router del módulo]
  RT --> RS[requireSession + trackActivity]
  RS --> RG[releaseGate opcional<br/>módulo no liberado → 404]
  RG --> V[validate · schema Zod de contracts]
  V --> C[Controller → Service → Presenter]
  C --> OK[Respuesta JSON]
  C -. AppError .-> EH[errorHandler<br/>application/problem+json]
```

## Piezas

- **Middlewares:** [[API - Middlewares]]
- **Errores:** la aplicación lanza `AppError(code, data)`. El estado HTTP sale del catálogo `ErrorCode` de [[Contrato - errors]], y `errorHandler` responde con `application/problem+json` ([[ADR-09 - Errores problem+json]]). Los errores inesperados responden `INTERNAL_ERROR 500` con un `traceId`, sin detalles internos ([[Constitución 4. Seguridad]]).
- **Contexto de sesión:** `requireSession` resuelve la sesión, el usuario y su zona horaria **en una sola consulta** (RNF-29). La identidad nunca viene del cuerpo.
- **Entregas:** `releaseGate` y la variable `RELEASE` deciden qué módulos existen ([[ADR-18 - Entregas con RELEASE]]).
- **Costo visible:** cada respuesta trae `Server-Timing` ([[Plan 4.0 Elementos transversales]]).
- **Catch-up:** [[Flujo - Tick de jobs]].

## Controlador delgado

Un controlador solo valida, arma `{ userId, timezone, now, traceId }`, llama a **un** método del servicio y presenta el resultado. Toda regla vive en la aplicación o en el dominio ([[API - Capa de presentación]], [[API - Capa de aplicación]]).
