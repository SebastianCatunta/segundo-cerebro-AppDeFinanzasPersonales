---
tipo: "configuracion"
fuente: ".claude/settings.json"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `.claude/settings.json`

Configuración de Claude Code del proyecto: hook `SessionStart` → `session-brief.mjs` (resumen del estado al abrir sesión), hook `SubagentStop` para `test-author|implementer|sdd-auditor` → `gate.mjs` (gates deterministas, hasta 30 min) y permisos para los scripts de `tools/sdd`.

## Contenido

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/tools/sdd/session-brief.mjs\"",
            "timeout": 10
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "matcher": "^(test-author|implementer|sdd-auditor)$",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/tools/sdd/gate.mjs\"",
            "timeout": 1800
          }
        ]
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(node tools/sdd/preflight.mjs:*)",
      "Bash(node tools/sdd/state.mjs:*)",
      "Bash(node tools/sdd/context.mjs:*)",
      "Bash(node tools/sdd/task-parse.mjs:*)",
      "Bash(node tools/sdd/audit.mjs:*)",
      "Bash(node tools/sdd/check.mjs:*)",
      "Bash(node tools/sdd/coordinate.mjs:*)"
    ]
  }
}
```
