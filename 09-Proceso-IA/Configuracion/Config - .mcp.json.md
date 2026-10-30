---
tipo: "configuracion"
fuente: ".mcp.json"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `.mcp.json`

Registro de servidores MCP del proyecto para Claude Code. Declara un único servidor, `neon`, que se lanza con `node tools/mcp/neon.mjs` (ver [[Config - neon.mjs]]). Es solo para desarrollo local: la aplicación no lo lee y no se despliega. No contiene ninguna clave. Visión completa en [[MCP de Neon]].

## Contenido

```json
{
  "mcpServers": {
    "neon": {
      "command": "node",
      "args": ["tools/mcp/neon.mjs"]
    }
  }
}
```
