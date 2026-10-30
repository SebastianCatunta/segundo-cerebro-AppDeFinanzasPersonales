---
tipo: backend
tags: [backend]
---
# ⚙️ API · Visión general (`apps/api`)

↑ [[MOC Backend]] · [[Arquitectura general]]

API **Node.js 22 + Express 5**, escrito en TypeScript y ejecutado con `tsx`. El build solo verifica tipos, sin emitir JS ([[Config - render.yaml]]). Usa Prisma, Zod y Better Auth y está en **4 capas** ([[ADR-19 - Backend en capas]], [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]]).

## Arranque

1. `main.ts` valida el entorno con `loadEnv()` ([[API - Configuración env.ts]]). Si falla, nombra las variables inválidas y sale con código 1.
2. `buildContainer(env)` crea todo el grafo de dependencias ([[API - Composición (container.ts)]]).
3. `createApp(container)` monta los middlewares y los routers ([[Flujo - Petición HTTP en el API]]) y escucha en `PORT`.

## Estructura

```text
apps/api/src
├─ main.ts                      arranque
├─ presentation/                1 · HTTP
│  ├─ app.ts                    middlewares globales + montaje de routers
│  ├─ routes/ (18)              un router por grupo de endpoints
│  ├─ controllers/ (17)         validan, arman el contexto y llaman a un servicio
│  ├─ presenters/ (16)          entidad → DTO de contracts
│  ├─ middlewares/ (9)          sesión, origen, JSON, errores, timing…
│  └─ internal/                 /internal/jobs/tick y /internal/test/*
├─ application/                 2 · casos de uso
│  ├─ services/ (19)            un caso de uso por método
│  ├─ shared/ (11)              BalanceGuard, LedgerHooks, NotificationEmitter…
│  ├─ jobs/ (7)                 tick y jobs por módulo
│  ├─ ports/ (11)               interfaces: UnitOfWork, repositorios, gateways
│  └─ errors.ts                 AppError(code, data)
├─ domain/index.ts              3 · reexporta packages/domain
├─ infrastructure/              4 · implementaciones
│  ├─ persistence/              Prisma, UnitOfWork, 28 repositorios
│  ├─ auth/better-auth.ts       AuthGateway
│  ├─ integrations/             paralelo.bo, BCB, Resend (+ fakes)
│  ├─ export/csv-zip.ts         exportación ZIP de CSV
│  └─ config/env.ts             validación del entorno
└─ composition/container.ts     raíz de composición (≈1.000 líneas)
```

## Capas

- [[API - Capa de presentación]]: [[API - Middlewares]] · [[API - Presentadores]] · [[Catálogo de endpoints]]
- [[API - Capa de aplicación]]: servicios en cada nota `API <grupo>` · compartidos · [[Job - tick]] · [[API - Puertos]]
- Dominio: [[Paquete domain]]
- [[API - Capa de infraestructura]]: [[API - Persistencia]] · [[API - Repositorios Prisma]] · [[API - Unit of Work y aislamiento]] · integraciones

## Endpoints por grupo

[[API auth]] · [[API me]] · [[API health]] · [[API settings]] · [[API fx]] · [[API currencies]] · [[API accounts]] · [[API categories]] · [[API transactions]] · [[API register]] · [[API shortcuts]] · [[API dashboard]] · [[API onboarding]] · [[API budgets]] · [[API goals]] · [[API debts]] · [[API recurring]] · [[API notifications]] · [[API internal (jobs y test-support)]]

## Pruebas

[[Pruebas del API]]: unitarias, contratos HTTP con supertest e integración contra Postgres (incluido el aislamiento entre usuarios y la concurrencia).
