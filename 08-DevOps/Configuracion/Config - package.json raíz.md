---
tipo: "configuracion"
fuente: "package.json"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `package.json`

Manifiesto raíz del monorepo `finanzas`. Fija pnpm 11 como gestor (`packageManager`), exige Node ≥ 22 y define los scripts globales: `lint`, `typecheck`, `test:unit`, `test:integration`, `depcruise`, `build` y `format`. El script `prepare` apunta los hooks de git a `.githooks/`. Las devDependencies son las herramientas transversales (ESLint, Prettier, TypeScript, Vitest, commitlint, dependency-cruiser).

## Contenido

```json
{
  "name": "finanzas",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.21.0",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "lint": "eslint --max-warnings=0 .",
    "typecheck": "tsc -p tsconfig.json && pnpm -r --if-present run typecheck",
    "test:unit": "pnpm -r --if-present run test:unit",
    "test:integration": "pnpm -r --if-present run test:integration",
    "depcruise": "depcruise apps/api/src --config .dependency-cruiser.cjs",
    "build": "pnpm -r --if-present run build",
    "format": "prettier --write .",
    "prepare": "git config core.hooksPath .githooks"
  },
  "devDependencies": {
    "@commitlint/cli": "21.2.3",
    "@commitlint/config-conventional": "21.2.3",
    "@eslint/js": "10.0.1",
    "@finanzas/config": "workspace:*",
    "@types/node": "22.20.5",
    "dependency-cruiser": "17.3.10",
    "eslint": "10.13.0",
    "prettier": "3.9.10",
    "typescript": "6.0.3",
    "typescript-eslint": "8.71.2",
    "vitest": "5.0.5"
  }
}
```
