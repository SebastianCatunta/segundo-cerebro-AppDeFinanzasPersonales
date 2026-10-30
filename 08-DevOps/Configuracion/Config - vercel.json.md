---
tipo: "configuracion"
fuente: "vercel.json"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `vercel.json`

Configuración de Vercel para la web: despliegue por Git desactivado (solo `deploy.yml`), build `pnpm --filter web build`, salida `apps/web/dist` y dos rewrites: `/api/*` → API de Render (ADR-02, evita CORS y cookies de terceros) y todo lo demás → `index.html` (SPA).

## Contenido

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": { "deploymentEnabled": false },
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm --filter web build",
  "outputDirectory": "apps/web/dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://finanzas-api-va.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-02 - Sesión entre dominios (proxy de Vercel)]]

