---
tipo: "protocolo"
fuente: "docs/execution-protocol.md § 1. Piezas"
documento: "[[Protocolo de ejecución con agentes]]"
tags:
  - "ia/protocolo"
actualizado: "2026-10-30"
---

↑ [[Protocolo de ejecución con agentes]] · → [[Protocolo 2. Skill implement-task TASK-XXX]]

## 1. Piezas

| Pieza | Ruta | Qué es |
|---|---|---|
| Skill orquestadora | `.claude/skills/implement-task/SKILL.md` | `/implement-task TASK-XXX`. La corre la sesión principal. Es la única que hace commit. |
| Skill de coordinación | `.claude/skills/coordinar-fases/SKILL.md` | `/coordinar-fases`: hace en bucle las tareas asignadas a la persona en las ramas de grupo, con `/implement-task` (§5.2). |
| Subagentes | `.claude/agents/test-author.md` · `implementer.md` · `sdd-auditor.md` | Una etapa del pipeline cada uno (§3). |
| Hook de agente | `.claude/settings.json` → `SubagentStop` | Ejecuta `tools/sdd/gate.mjs` (§4.1), solo para `test-author`, `implementer` y `sdd-auditor`. |
| Hook de sesión | `.claude/settings.json` → `SessionStart` | Ejecuta `tools/sdd/session-brief.mjs` (§4.3): al abrir Claude, un resumen de la rama, la tarea activa, el avance y las tareas disponibles. |
| Hook de git | `.githooks/pre-push` | Ejecuta `tools/sdd/pre-push.mjs` (§4.2). Se activa con `git config core.hooksPath .githooks`. |
| Scripts | `tools/sdd/*.mjs` | Node, sin dependencias: `task-parse`, `preflight`, `context`, `state` (único punto de cambio del estado), `audit` (registra veredictos), `gate`, `check` (corre los controles del gate sin gastar intentos), `close` (marca `[x]` y hace el commit), `session-brief` (resumen al abrir una sesión), `coordinate` (qué tarea le toca a cada persona, §5.2) y `pre-push`. Los controles de los gates viven en `lib/gates.mjs` y los comparten `gate` y `check`. Los usan los hooks, los subagentes y la skill. Sus pruebas: `node --test tools/sdd/test/*.test.mjs`. |
| Estado de ejecución | `.claude/run/` (ignorado por git) | `active-task.json` y una carpeta por tarea (§2.2). |

---
