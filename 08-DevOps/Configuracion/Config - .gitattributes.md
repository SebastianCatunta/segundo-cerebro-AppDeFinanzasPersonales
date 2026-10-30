---
tipo: "configuracion"
fuente: ".gitattributes"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `.gitattributes`

Obliga a que los hooks de `.githooks/` tengan fin de línea LF, porque se ejecutan con `sh` (importante en Windows).

## Contenido

```text
# Los hooks de git se ejecutan con sh: siempre con fin de línea LF.
.githooks/* text eol=lf
```
