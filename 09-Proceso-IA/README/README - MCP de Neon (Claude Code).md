---
tipo: "readme"
fuente: "README.md § MCP de Neon (Claude Code)"
documento: "[[README - App de Finanzas Personales]]"
tags:
  - "readme"
actualizado: "2026-10-30"
---

↑ [[README - App de Finanzas Personales]] · ← [[README - Secretos y variables]] · → [[README - Puesta en marcha del despliegue (una sola vez)]]

## MCP de Neon (Claude Code)

[[Config - .mcp.json|.mcp.json]] conecta Claude Code con el servidor MCP de Neon para listar tablas, ver el esquema y consultar la base durante el desarrollo. Es solo para desarrollo local: la aplicación no lo lee y no se despliega.

1. Consigue una API key de Neon (**Settings → API keys**, en la consola). Si el proyecto de Neon es de otra persona, esa persona crea la clave, o te invita al proyecto para que crees la tuya. Pásala por un canal privado, nunca por el repositorio ni por un chat grupal.
2. Pégala en tu `.env` local como `NEON_API_KEY=…`. El archivo está en `.gitignore`: la clave no se versiona. En el repositorio solo está el nombre de la variable.
3. Reinicia Claude Code en la carpeta del proyecto, aprueba el servidor `neon` y comprueba que aparece conectado con `/mcp`.

Por defecto queda en **solo lectura**. Para permitir escrituras, agrega `NEON_MCP_READONLY=false` a tu `.env`. Cuidado con la base a la que apunta la clave: con escrituras habilitadas, el MCP puede modificarla.
