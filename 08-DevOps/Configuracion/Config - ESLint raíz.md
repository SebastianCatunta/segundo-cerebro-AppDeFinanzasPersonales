---
tipo: "configuracion"
fuente: "eslint.config.js"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `eslint.config.js`

ESLint plano de la raíz: usa `createConfig` de `@finanzas/config/eslint` e ignora `tools/` (scripts del pipeline, probados con `node --test`) y `.claude/worktrees/`.

## Contenido

```js
import { createConfig } from '@finanzas/config/eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  // SDD pipeline scripts: built outside tasks.md and verified with `node --test` (execution protocol).
  // .claude/worktrees: checkouts of other sessions, each linted in its own folder.
  globalIgnores(['tools/', '.claude/worktrees/']),
  createConfig({ tsconfigRootDir: import.meta.dirname }),
);
```
