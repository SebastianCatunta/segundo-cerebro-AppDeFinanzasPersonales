---
tipo: "configuracion"
fuente: "packages/config/package.json"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `packages/config/package.json`

Paquete `@finanzas/config`: exporta el tsconfig base, la configuración de ESLint y la base de Vitest compartidas.

## Contenido

```json
{
  "name": "@finanzas/config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./tsconfig.base.json": "./tsconfig.base.json",
    "./eslint": "./eslint.config.js",
    "./vitest": "./vitest.base.ts"
  },
  "peerDependencies": {
    "@eslint/js": "^10.0.1",
    "eslint": "^10.13.0",
    "typescript": "^6.0.3",
    "typescript-eslint": "^8.71.2",
    "vitest": "^5.0.5"
  },
  "devDependencies": {
    "@eslint/js": "10.0.1",
    "eslint": "10.13.0",
    "typescript": "6.0.3",
    "typescript-eslint": "8.71.2",
    "vitest": "5.0.5"
  }
}
```
