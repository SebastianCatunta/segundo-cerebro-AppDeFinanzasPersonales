---
tipo: "configuracion"
fuente: "tsconfig.json"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `tsconfig.json`

TypeScript de la raíz: extiende `packages/config/tsconfig.base.json` y solo verifica los archivos de configuración JS/TS de la raíz (cada paquete tiene su propio tsconfig).

## Contenido

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./packages/config/tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "allowJs": true,
    "checkJs": true,
    "types": ["node"]
  },
  "include": ["eslint.config.js", "packages/config/*.js", "packages/config/*.ts"]
}
```
