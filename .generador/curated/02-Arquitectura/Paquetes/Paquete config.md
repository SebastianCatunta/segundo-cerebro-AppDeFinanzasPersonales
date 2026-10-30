---
tipo: paquete
tags: [paquete/config, devops]
---
# 📦 Paquete `@finanzas/config`

↑ [[Monorepo pnpm]]

Configuración compartida que extienden todos los paquetes:

| Export | Archivo | Nota |
|---|---|---|
| `@finanzas/config/tsconfig.base.json` | TypeScript estricto (ES2023, NodeNext) | [[Config - tsconfig.base.json]] |
| `@finanzas/config/eslint` | `createConfig()`: reglas con tipos, sin tests `.only`/`.skip`, sin `parseFloat` en el código de dinero | [[Config - eslint compartido]] |
| `@finanzas/config/vitest` | Base de Vitest (timeouts, `.env` de pruebas) | [[Config - vitest.base.ts]] |

Manifiesto: [[Config - packages config package.json]]. Uso en la raíz: [[Config - ESLint raíz]], [[Config - tsconfig.json raíz]].
