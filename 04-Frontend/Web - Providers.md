---
tipo: "frontend"
fuente: "apps/web/src/app/providers"
tags:
  - "frontend/providers"
actualizado: "2026-10-30"
---

# Providers de la app

Proveedores de React montados en `main.tsx`: i18next, TanStack Query (cliente y reintentos) y tema claro/oscuro.

| Archivo | Exporta | Descripción (comentario del código) |
|---|---|---|
| `i18n.ts` | `LANGUAGE`, `resources` |  |
| `index.tsx` | `AppProviders` |  |
| `query-client.ts` | `createQueryClient`, `queryClient` |  |
| `theme.tsx` | `ThemeMode`, `readStoredTheme`, `applyTheme`, `storeTheme`, `applyStoredTheme`, `ThemeProvider` |  |
