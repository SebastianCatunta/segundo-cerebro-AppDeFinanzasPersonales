---
tipo: "configuracion"
fuente: "apps/web/index.html"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `apps/web/index.html`

HTML de entrada de la SPA: `lang="es-BO"`, color de tema `#186253` (verde azulado de la marca), favicons (svg, ico, apple-touch) y el montaje de `src/main.tsx` en `#root`.

## Contenido

```html
<!doctype html>
<html lang="es-BO">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#186253" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <title>Finanzas</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```
