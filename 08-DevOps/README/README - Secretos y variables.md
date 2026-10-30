---
tipo: "readme"
fuente: "README.md § Secretos y variables"
documento: "[[README - App de Finanzas Personales]]"
tags:
  - "readme"
actualizado: "2026-10-30"
---

↑ [[README - App de Finanzas Personales]] · ← [[README - Desarrollo guiado por especificaciones (SDD) con agentes]] · → [[README - MCP de Neon (Claude Code)]]

## Secretos y variables

Ningún secreto se versiona. `.gitignore` excluye todo `.env*` salvo [[Config - .env.example|.env.example]], y el `pre-push` rechaza archivos `.env`, claves y URLs de base de datos con contraseña.

| Variable                                                                                                                                     | Local  | Producción                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| `DATABASE_URL`, `AUTH_SECRET`, `HMAC_SECRET`, `JOBS_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `RELEASE`, `WEB_ORIGIN`, `INTEGRATIONS`         | `.env` | Variables del servicio en Render                              |
| `DATABASE_URL_DIRECT`, `RENDER_DEPLOY_HOOK_URL`, `RENDER_API_KEY`, `RENDER_SERVICE_ID`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | —      | Secretos del Environment `production` de GitHub (solo `main`) |
| `NEON_API_KEY` y, opcional, `NEON_MCP_READONLY` (solo el MCP de Neon)                                            | `.env` | —                                                             |
| `WEB_URL`, `API_URL`                                                                                                                         | —      | Variables del Environment `production`                        |
| `TEST_DATABASE_URL` y, opcionales, `TEST_TIMEOUT_MS` (PC lenta) y `DB_LATENCY_MS` (latencia simulada)                                        | `.env` | —                                                             |
