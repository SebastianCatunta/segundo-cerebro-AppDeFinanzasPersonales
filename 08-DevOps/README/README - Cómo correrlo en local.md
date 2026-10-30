---
tipo: "readme"
fuente: "README.md § Cómo correrlo en local"
documento: "[[README - App de Finanzas Personales]]"
tags:
  - "readme"
actualizado: "2026-10-30"
---

↑ [[README - App de Finanzas Personales]] · ← [[README - Estructura]] · → [[README - Pruebas y calidad]]

## Cómo correrlo en local

Hace falta tener Node 22 (`.nvmrc`), corepack (trae pnpm) y Docker.

```bash
corepack enable
pnpm install
docker compose up -d
cp .env.example .env
```

En `.env`, completa `DATABASE_URL` y `DATABASE_URL_DIRECT` con `postgresql://postgres:postgres@localhost:5432/finanzas_dev`, `TEST_DATABASE_URL` con la base `finanzas_test`, `RELEASE=1.0` y cualquier valor no vacío en los secretos. Con `INTEGRATIONS=fake` no se manda ningún correo real.

```bash
set -a; . ./.env; set +a
pnpm --filter @finanzas/db generate
pnpm --filter @finanzas/db migrate:deploy
pnpm --filter api exec tsx --env-file=../../.env src/main.ts
pnpm --filter web dev
```

La web queda en <http://localhost:5173>, y el proxy de Vite manda `/api` al API, en el puerto 3000.
