---
tipo: "configuracion"
fuente: "pnpm-workspace.yaml"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `pnpm-workspace.yaml`

Declara los paquetes del workspace (`apps/*`, `packages/*` y `e2e`) y autoriza los scripts de instalación de Prisma y esbuild (`allowBuilds`), que pnpm 11 bloquea por defecto.

## Contenido

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'e2e'

# Dependencias del stack (constitución §2) que necesitan sus scripts de instalación.
allowBuilds:
  '@prisma/client': true
  '@prisma/engines': true
  prisma: true
  esbuild: true
```

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Constitución 2. Stack tecnológico]]

