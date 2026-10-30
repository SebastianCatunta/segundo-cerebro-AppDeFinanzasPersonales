---
tipo: "configuracion"
fuente: ".githooks/pre-push"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `.githooks/pre-push`

Hook de git que delega en `tools/sdd/pre-push.mjs`: commitlint, detección de secretos y trazabilidad de tareas antes de cada push (protocolo §4.2).

## Contenido

```text
#!/bin/sh
# Compuerta de la fase antes de subir (docs/execution-protocol.md §4.2).
exec node "$(git rev-parse --show-toplevel)/tools/sdd/pre-push.mjs" "$@"
```
