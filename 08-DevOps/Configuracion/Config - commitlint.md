---
tipo: "configuracion"
fuente: "commitlint.config.cjs"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `commitlint.config.cjs`

Conventional Commits (constitución §7) limitado a los tipos `feat, fix, docs, test, chore, build, ci, refactor, perf`. El asunto puede empezar con el ID de la tarea (`feat(db): TASK-003 ...`), por eso `subject-case` está desactivado. Lo corren CI y el hook `pre-push`.

## Contenido

```js
/**
 * Conventional Commits (constitution §7), limited to the commit types the project uses.
 * Task commits start their subject with the task id (`feat(db): TASK-003 ...`), so the subject case is free.
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'test', 'chore', 'build', 'ci', 'refactor', 'perf'],
    ],
    'subject-case': [0],
  },
};
```

---
## 🔗 Relacionado

- **Fases de tareas:** [[Tareas Fase 0 - Cimientos, configuración e infraestructura base]]
- **Spec / Plan / Constitución:** [[Constitución 7. Git Flow]]

