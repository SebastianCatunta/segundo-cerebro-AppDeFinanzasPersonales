---
tipo: backend
tags: [backend/infraestructura, backend/aplicacion]
---
# Unit of Work, bloqueo por usuario y aislamiento

↑ [[API - Capa de infraestructura]] · Decisión: [[ADR-05 - Aislamiento por usuario]] · Puertos: [[API - Puertos]]

## Puerto (`application/ports/unit-of-work.ts`)

```ts
interface UnitOfWorkOptions {
  userLock?: string;   // limita los repositorios a ese usuario y, si escribe, toma su bloqueo exclusivo
  readOnly?: boolean;  // REPEATABLE READ + READ ONLY: una sola foto de la base, sin bloqueo
}
interface UnitOfWork {
  run<T>(fn: (repos: Repositories) => Promise<T>, opts?: UnitOfWorkOptions): Promise<T>;
}
```

## Implementación (`infrastructure/persistence/unit-of-work.ts`)

- Cada `run` abre una **transacción interactiva** de Prisma.
- **Escritura con `userLock`:** primero ejecuta `SELECT pg_advisory_xact_lock(hashtext('user:' || userId))`. Así, dos escrituras del mismo usuario se encolan (RNF-10), y Postgres suelta el bloqueo con el COMMIT o el ROLLBACK.
- **Lectura (`readOnly`):** `SET TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY` y sin bloqueo. Las lecturas no esperan a las escrituras (RNF-29, Fase 27).
- **Aislamiento:** con `userLock`, el cliente pasa por la extensión `forUser`, que inyecta y verifica `user_id` en cada consulta de modelo (RNF-14).
- Los repositorios se construyen dentro de la transacción (`buildRepositories(tx, userId)`) y **nunca abren transacciones propias**.
- Un error dentro de `fn` revierte todo y llega al llamador sin cambios.

## Defensa en dos capas ([[ADR-05 - Aislamiento por usuario]])

1. **Aplicación:** los repositorios reciben el `userId` de la sesión, y la extensión de Prisma lo fuerza.
2. **Base de datos:** las claves foráneas compuestas `(user_id, x_id)` hacen imposible referenciar datos de otro usuario (`@@unique([userId, id])` en cada [[Modelo de datos|entidad]]).

No usa RLS de Postgres, por su costo operativo con el pooler de Neon. Cada repositorio tiene su prueba de aislamiento (`*.isolation.test.ts`, `isolation-sweep.test.ts`, en [[Pruebas del API]]). Un recurso de otro usuario se comporta como inexistente (RN-09 → `NOT_FOUND`).
