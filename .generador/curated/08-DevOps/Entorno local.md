---
tipo: devops
tags: [devops/local]
---
# 💻 Entorno local

↑ [[MOC DevOps]] · Fuente: [[README - Cómo correrlo en local]]

**Requisitos:** Node 22 ([[Config - .nvmrc]]), corepack (trae pnpm) y Docker.

```bash
corepack enable
pnpm install                 # también apunta los hooks de git a .githooks/
docker compose up -d         # Postgres 16 con finanzas_dev y finanzas_test
cp .env.example .env         # completar las URLs, RELEASE=1.0 y los secretos
set -a; . ./.env; set +a
pnpm --filter @finanzas/db generate
pnpm --filter @finanzas/db migrate:deploy
pnpm --filter api exec tsx --env-file=../../.env src/main.ts   # API en :3000
pnpm --filter web dev                                           # web en :5173
```

- **Base de datos:** [[Config - docker-compose.yml]] + [[Config - docker init.sql]].
- **Variables:** [[Variables de entorno]]. Con `INTEGRATIONS=fake` no sale ningún correo real y las tasas son falsas.
- **Proxy:** Vite manda `/api` a `http://localhost:3000` ([[Config - vite.config.ts]]), el mismo papel que cumple Vercel en producción ([[ADR-02 - Sesión entre dominios (proxy de Vercel)]]).
- **Latencia de Neon:** `DB_LATENCY_MS` agrega espera a cada consulta para reproducir la distancia ([[Latencia del despliegue]]).

## Calidad antes de un PR

`pnpm lint` · `pnpm typecheck` · `pnpm depcruise` · `pnpm test:unit` · `pnpm test:integration` · `pnpm --filter e2e test` · `node --test tools/sdd/test/` → [[README - Pruebas y calidad]] · [[Estrategia de pruebas]]
