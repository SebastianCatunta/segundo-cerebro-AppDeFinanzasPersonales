---
tipo: "configuracion"
fuente: "tools/mcp/neon.mjs"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `tools/mcp/neon.mjs`

Lanzador del MCP de Neon, referenciado desde `.mcp.json`. Como Claude Code no lee `.env`, el script lo carga con `process.loadEnvFile`, toma `NEON_API_KEY` (si falta, avisa por stderr y sale con código 1; stdout queda reservado al protocolo MCP) y conecta con `https://mcp.neon.tech/mcp` a través de `mcp-remote`. Por defecto añade `?readonly=true`; solo `NEON_MCP_READONLY=false` permite escrituras. La clave viaja en una variable de entorno del proceso hijo (`NEON_AUTH_HEADER`), nunca en la línea de comandos ni en el repo. En Windows lanza `npx` mediante `cmd /c`. Ver [[MCP de Neon]].

## Contenido

```text
#!/usr/bin/env node
/**
 * Lanzador del MCP de Neon para Claude Code (referenciado desde `.mcp.json`).
 *
 * Claude Code no lee `.env`, así que este script lo carga, toma `NEON_API_KEY` y conecta con el servidor
 * remoto de Neon a través de `mcp-remote`. La clave nunca se escribe en el repositorio ni en la línea de
 * comandos: viaja en una variable de entorno del proceso hijo.
 *
 * Por defecto el MCP queda en solo lectura (`?readonly=true`). Para permitir escrituras, define
 * `NEON_MCP_READONLY=false` en `.env`.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const envFile = resolve(root, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

const apiKey = process.env.NEON_API_KEY?.trim();
if (!apiKey) {
  // stdout es el canal del protocolo MCP: los avisos van a stderr.
  console.error(
    'Falta NEON_API_KEY. Defínela en .env (ver .env.example y la sección "MCP de Neon" del README).',
  );
  process.exit(1);
}

const readonly = process.env.NEON_MCP_READONLY?.trim().toLowerCase() !== 'false';
const url = `https://mcp.neon.tech/mcp${readonly ? '?readonly=true' : ''}`;

// En Windows `npx` es un .cmd y Node no lo lanza directamente.
const [command, prefix] = process.platform === 'win32' ? ['cmd', ['/c', 'npx']] : ['npx', []];
const child = spawn(
  command,
  [...prefix, '-y', 'mcp-remote@latest', url, '--header', 'Authorization:${NEON_AUTH_HEADER}'],
  {
    stdio: 'inherit',
    env: { ...process.env, NEON_AUTH_HEADER: `Bearer ${apiKey}` },
  },
);

child.on('error', (error) => {
  console.error(`No se pudo iniciar mcp-remote: ${error.message}`);
  process.exit(1);
});
child.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
```
