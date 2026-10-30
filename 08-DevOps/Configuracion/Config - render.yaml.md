---
tipo: "configuracion"
fuente: "render.yaml"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `render.yaml`

Blueprint de Render del API (`finanzas-api-va`, región Virginia, plan gratis). `autoDeploy: false`: solo despliega `deploy.yml` mediante el Deploy Hook. Build: corepack + pnpm install + generar Prisma + build del API. Start: `pnpm --filter api start`. Health check en `/api/health`. Las variables secretas van con `sync: false` (se cargan en el panel).

## Contenido

```yaml
# Render Blueprint of the API (plan §1.5, ADR-20). Render does not deploy from Git on its own:
# deploy.yml calls the Deploy Hook after CI and the migrations pass.
services:
  - type: web
    name: finanzas-api-va
    runtime: node
    plan: free
    region: virginia
    branch: main
    autoDeploy: false
    buildCommand: corepack enable && pnpm install --frozen-lockfile --prod=false && pnpm --filter @finanzas/db generate && pnpm --filter api build
    startCommand: pnpm --filter api start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: '22'
      - key: DATABASE_URL
        sync: false
      - key: AUTH_SECRET
        sync: false
      - key: HMAC_SECRET
        sync: false
      - key: JOBS_SECRET
        sync: false
      - key: RESEND_API_KEY
        sync: false
      - key: EMAIL_FROM
        sync: false
      - key: RELEASE
        sync: false
      - key: WEB_ORIGIN
        sync: false
      - key: INTEGRATIONS
        sync: false
```

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-20 - CI-CD con GitHub Actions]]
- **Spec / Plan / Constitución:** [[Plan 1.5 Integración y despliegue continuos (ADR-20)]]

