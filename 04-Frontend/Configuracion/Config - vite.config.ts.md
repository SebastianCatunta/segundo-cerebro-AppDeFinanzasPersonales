---
tipo: "configuracion"
fuente: "apps/web/vite.config.ts"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `apps/web/vite.config.ts`

Configuración de Vite de la web: plugin de React, alias `@` → `src`, y proxy de `/api` al API local en el puerto 3000.

## Contenido

```ts
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
});
```
