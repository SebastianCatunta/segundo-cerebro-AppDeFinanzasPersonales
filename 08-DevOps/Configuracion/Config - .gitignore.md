---
tipo: "configuracion"
fuente: ".gitignore"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `.gitignore`

Excluye dependencias, compilados, cobertura, todo `.env*` salvo `.env.example`, reportes de Playwright, logs, `.vercel/` y el estado local del pipeline (`.claude/run/`, `.claude/worktrees/`, `settings.local.json`).

## Contenido

```text
# Estado local del pipeline de tareas (docs/execution-protocol.md)
.claude/run/
.claude/settings.local.json
.claude/worktrees/

# Dependencias
node_modules/

# Compilados y cobertura
dist/
coverage/
*.tsbuildinfo

# Variables de entorno: solo se versiona el ejemplo
.env*
!.env.example

# Playwright
playwright-report/
test-results/

# Logs y sistema
*.log
.DS_Store
Thumbs.db

# Vercel CLI (vercel link)
.vercel/
```
