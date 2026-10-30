---
tipo: "constitucion"
fuente: "docs/constitution.md § 7. Git Flow"
documento: "[[Constitución]]"
tags:
  - "sdd/constitucion"
actualizado: "2026-10-30"
---

↑ [[Constitución]] · ← [[Constitución 6. Desarrollo guiado por especificaciones (SDD)]] · → [[Constitución 8. Ejecución de tareas con agentes]]

## 7. Git Flow
- **`main`:** producción.
- **`qa`:** validación antes de producción.
- **`develop`:** integración.
- **`feature/*` y `fix/*`:** salen de `develop` y vuelven a `develop` por Pull Request.
- **Promoción:** `develop` → `qa` → `main`, siempre por Pull Request.
- **`hotfix/*`:** sale de `main` y se integra en `main`, `qa` y `develop`.
- Los commits siguen Conventional Commits.
