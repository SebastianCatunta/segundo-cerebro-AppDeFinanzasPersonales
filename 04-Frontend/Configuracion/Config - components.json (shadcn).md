---
tipo: "configuracion"
fuente: "apps/web/components.json"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `apps/web/components.json`

Configuración de shadcn/ui: estilo default, Tailwind con variables CSS (base slate), íconos lucide y los alias `@/components`, `@/components/ui`, `@/lib`, `@/hooks`.

## Contenido

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```
