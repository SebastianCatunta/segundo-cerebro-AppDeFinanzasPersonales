---
tipo: "protocolo"
fuente: "docs/execution-protocol.md § 7. Arranque"
documento: "[[Protocolo de ejecución con agentes]]"
tags:
  - "ia/protocolo"
actualizado: "2026-10-30"
---

↑ [[Protocolo de ejecución con agentes]] · ← [[Protocolo 6. Formato de tasks.md que leen los scripts]]

## 7. Arranque

- La skill, los subagentes, los hooks y `tools/sdd/` se construyen en una sesión dedicada **antes de TASK-001**, fuera de `tasks.md`, porque el pipeline no puede construirse a sí mismo. Esa sesión también agrega `.claude/run/` a `.gitignore`.
- Hasta que existan el monorepo y sus scripts, `gate.mjs` salta con aviso los controles cuya herramienta todavía no está instalada (typecheck, lint, dependency-cruiser, Vitest).
- Durante el arranque, `core.hooksPath` se configura a mano. Desde la Fase 0, lo hace el script `prepare` del `package.json` raíz.

---
## 🔗 Relacionado

- **Fases de tareas:** [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]]

