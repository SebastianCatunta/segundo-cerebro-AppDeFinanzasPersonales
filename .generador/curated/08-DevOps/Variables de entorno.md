---
tipo: devops
tags: [devops/entorno]
---
# 🔐 Variables de entorno

↑ [[MOC DevOps]] · Plantilla: [[Config - .env.example]] · Validación: [[API - Configuración env.ts]] · Fuente: [[README - Secretos y variables]]

> [!warning] Ningún secreto se versiona
> `.gitignore` excluye todo `.env*` salvo `.env.example`, y el hook `pre-push` rechaza los archivos `.env`, las claves y las URLs de base de datos con contraseña. Este vault documenta **nombres y propósito**, nunca valores.

## Ejecución del API (Render o `.env` local)

| Variable | Para qué | Regla |
|---|---|---|
| `NODE_ENV` | `development`, `test` o `production` | En producción la fija `render.yaml` |
| `PORT` | Puerto HTTP (3000 en local) | 1 a 65535 |
| `DATABASE_URL` | Conexión de Prisma en ejecución (pooler de Neon en producción) | Obligatoria |
| `AUTH_SECRET` | Secreto de Better Auth (firma de sesiones) | `openssl rand -base64 32` |
| `HMAC_SECRET` | HMAC del correo (por ejemplo, en `login_throttle` y `email_send_log`) | Aleatorio |
| `JOBS_SECRET` | Encabezado `x-jobs-secret` del tick | Aleatorio |
| `RESEND_API_KEY` | API key de Resend | Obligatoria desde el primer arranque |
| `EMAIL_FROM` | Remitente en un dominio verificado | Por defecto, `onboarding@resend.dev` |
| `RELEASE` | Entrega activa: `1.0`, `1.1` o `1.2` | [[ADR-18 - Entregas con RELEASE]] |
| `WEB_ORIGIN` | Origen permitido para las mutaciones (`checkOrigin`) | URL |
| `INTEGRATIONS` | `real` o `fake` | `fake` está prohibido en producción |
| `DB_LATENCY_MS` | Latencia artificial por consulta (pruebas de rendimiento) | Distinto de 0 está prohibido en producción |

## Despliegue (Environment `production` de GitHub, solo `main`)

| Variable | Tipo | Para qué |
|---|---|---|
| `DATABASE_URL_DIRECT` | Secreto | Migraciones sin pooler (`directUrl` de Prisma) |
| `RENDER_DEPLOY_HOOK_URL`, `RENDER_API_KEY`, `RENDER_SERVICE_ID` | Secretos | Disparar el deploy del API y esperar a que quede `live` |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | Secretos | `vercel pull/build/deploy` |
| `WEB_URL`, `API_URL` | Variables | Pruebas de humo |

## Pruebas (local)

| Variable | Para qué |
|---|---|
| `TEST_DATABASE_URL` | Base `finanzas_test` de las pruebas de integración y E2E |
| `TEST_TIMEOUT_MS` | Timeout por prueba en PCs lentas ([[Config - vitest.base.ts]]) |
| `E2E_RELEASE` | Entrega con la que corre Playwright ([[Config - playwright.config.ts]]) |

Ver [[Entorno local]] y [[Flujo - Despliegue a producción]].
