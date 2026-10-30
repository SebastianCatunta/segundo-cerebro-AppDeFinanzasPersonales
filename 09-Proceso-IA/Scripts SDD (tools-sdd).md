---
tipo: "proceso-ia"
fuente: "tools/sdd"
tags:
  - "ia/scripts"
actualizado: "2026-10-30"
---

# Scripts del pipeline SDD (`tools/sdd/`)

Scripts Node (sin dependencias) que automatizan el [[Pipeline SDD con agentes]]: preparan la tarea, guardan el estado, aplican los gates deterministas, registran la auditoría, cierran con commit y coordinan a las personas en las ramas de grupo. Se prueban con `node --test tools/sdd/test/`.

## Comandos

| Script | Líneas | Qué hace (comentario del código) |
|---|---|---|
| `audit.mjs` | 35 |  |
| `check.mjs` | 36 |  |
| `close.mjs` | 100 |  |
| `context.mjs` | 18 |  |
| `coordinate.mjs` | 109 | Contenido de un archivo en una rama de origin, o null si la rama o el archivo no existen. |
| `gate.mjs` | 129 | Guarda en el estado vigente; si quedó obsoleto, registra el descarte y deja terminar al subagente. |
| `pre-push.mjs` | 85 |  |
| `preflight.mjs` | 94 |  |
| `session-brief.mjs` | 34 |  |
| `state.mjs` | 136 | Espera, sin modificar nada, a que el subagente de la fase termine: el gate de la fase pasó o la tarea se bloqueó (parada del subagente o intentos agotados). Así el orquestador no depende de la notificación de fin. Corta a los `minutes` minutos (por defecto 9, bajo el límite de 10 de Bash) con `done: false`. |
| `task-parse.mjs` | 14 |  |

## Librería (`tools/sdd/lib`)

| Módulo | Líneas | Descripción |
|---|---|---|
| `brief.mjs` | 69 | Resumen del estado del proyecto para el hook SessionStart (protocolo §4.3). Función pura: se prueba sin git. |
| `context.mjs` | 129 | Paquete de contexto de una tarea (docs/execution-protocol.md §2.3). |
| `coordination.mjs` | 86 | Coordinación entre personas en las ramas de grupo (protocolo §5.2). Funciones puras: se prueban sin git. |
| `gates.mjs` | 116 | Controles de los gates (protocolo §4.1). Los usan el hook (gate.mjs) y la autoverificación (check.mjs), así un subagente puede correr exactamente lo mismo que lo va a juzgar antes de terminar. |
| `message.mjs` | 38 | Mensajes de commit y secretos: lo comparten close.mjs y pre-push.mjs. |
| `repo.mjs` | 117 | Utilidades de repositorio: raíz, comandos de shell y git. |
| `runner.mjs` | 142 | Ejecución de verificaciones por workspace. Si una herramienta todavía no está instalada, el control se salta con aviso (docs/execution-protocol.md §7). |
| `scope.mjs` | 60 | Alcance de archivos y nombres de tests (docs/execution-protocol.md §6). |
| `state.mjs` | 141 | Estado de la tarea activa: .claude/run/active-task.json y .claude/run/TASK-XXX/. |
| `tasks.mjs` | 195 | Lectura de tasks.md con el formato de docs/execution-protocol.md §6. |

**Pruebas:** `coordination.test.mjs`, `sdd.test.mjs`

**Configuración:** [[Config - branch-groups.json]], [[Config - .claude settings.json]], [[Config - hook pre-push]]
