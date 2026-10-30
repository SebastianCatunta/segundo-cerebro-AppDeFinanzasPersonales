---
tipo: "configuracion"
fuente: ".editorconfig"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `.editorconfig`

Formato básico del editor: UTF-8, LF, 2 espacios, línea final y sin espacios sobrantes (salvo en Markdown).

## Contenido

```text
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```
