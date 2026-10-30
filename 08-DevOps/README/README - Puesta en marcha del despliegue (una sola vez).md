---
tipo: "readme"
fuente: "README.md § Puesta en marcha del despliegue (una sola vez)"
documento: "[[README - App de Finanzas Personales]]"
tags:
  - "readme"
actualizado: "2026-10-30"
---

↑ [[README - App de Finanzas Personales]] · ← [[README - Secretos y variables]] · → [[README - Estado del proyecto]]

## Puesta en marcha del despliegue (una sola vez)

Los agentes no pueden crear cuentas ni cargar secretos, así que estos pasos los hace una persona. Cada uno está detallado en los «Pasos manuales» de [[Tareas - Backlog del MVP|TASK-171, TASK-172, TASK-173 y TASK-174]]:

1. **Neon:** crear el proyecto y guardar las URLs con pooler y directa.
2. **Resend:** crear la API key.
3. **Secretos de la app:** generar `AUTH_SECRET`, `HMAC_SECRET` y `JOBS_SECRET` con `openssl rand -base64 32`.
4. **Vercel:** `vercel link` en la raíz, crear el token y anotar `WEB_URL`.
5. **Render:** crear el Blueprint desde `render.yaml` (rama `main`), cargar las variables y anotar `API_URL`, el Deploy Hook, la API key y el ID del servicio.
6. **GitHub:** crear el Environment `production` con sus secretos y variables, y proteger `develop`, `qa` y `main` con el check `ci`.
7. **cron-job.org:** programar `POST $API_URL/internal/jobs/tick` cada minuto, con `x-jobs-secret`, `Content-Type: application/json` y el cuerpo `{}`.
8. **Primer despliegue:** promover `develop` → `qa` → `main` por PR y revisar el workflow `deploy` en Actions.

---
## 🔗 Relacionado

- **Fases de tareas:** [[Tareas Fase 17 - Cierre de V1.0 rendimiento, accesibilidad y despliegue]]

