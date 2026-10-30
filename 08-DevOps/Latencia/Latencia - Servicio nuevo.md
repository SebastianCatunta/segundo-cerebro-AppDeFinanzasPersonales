---
tipo: "devops"
fuente: "docs/latencia-despliegue.md § Servicio nuevo"
documento: "[[Latencia del despliegue]]"
tags:
  - "devops/latencia"
actualizado: "2026-10-30"
---

↑ [[Latencia del despliegue]] · ← [[Latencia - Motivo]] · → [[Latencia - Parámetros de DATABASE_URL]]

## Servicio nuevo

Render no cambia de región un servicio existente, así que se creó uno nuevo a mano en Virginia:

- **Nuevo:** `finanzas-api-va`, en <https://finanzas-api-va.onrender.com>.
- **Viejo:** `finanzas-api-u3vu`, en Oregón. Queda para apagar.

`render.yaml` fija `name: finanzas-api-va` y `region: virginia`; `vercel.json` apunta el _rewrite_ de `/api/:path*` a la URL nueva, y la tabla de despliegue del `README.md` la cita. En el Environment `production` de GitHub hay que tener actualizados `API_URL`, `RENDER_DEPLOY_HOOK_URL` y `RENDER_SERVICE_ID` con los del servicio nuevo.
