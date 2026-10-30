---
tipo: "frontend"
tags:
  - "frontend"
actualizado: "2026-10-30"
---

# 🖥️ Web · Visión general (`apps/web`)

↑ [[MOC Frontend]] · [[Arquitectura general]]

SPA con **React 19 + Vite**, **Tailwind CSS + shadcn/ui** (Radix), **TanStack Query 5**, **React Router 8**, react-hook-form, i18next, recharts, @dnd-kit y decimal.js. Todos los textos están en español de Bolivia (`es-BO`).

## Arranque

`index.html` ([[Config - index.html]]) → `src/main.tsx` → providers (i18n, Query y tema, [[Web - Providers]]) → `RouterProvider` con el [[Web - Router y rutas|router]].

## Estructura

```text
apps/web/src
├─ app/            router, guardas, precarga, layout y providers
│  └─ layout/      AppShell, cabecera, pestañas, sidebar, "Más", sin conexión, sesión expirada, deshacer
├─ features/<x>/   una carpeta por módulo: routes.tsx, api.ts, hooks/, components/
├─ components/ui/  primitivas de shadcn/ui
├─ lib/            cliente HTTP, borradores, formatos, errores, conexión, search params, store de UI
└─ locales/es-BO/  un JSON de textos por namespace
```

## Cómo se arma una feature

1. **`routes.tsx`** exporta las pantallas. El router las carga con `lazy`, así que cada feature es un *chunk* propio (RNF-01, RNF-03).
2. **`api.ts`** declara los endpoints como objetos `{ method, path, input, output }` con schemas Zod de contracts. `lib/api-client.ts` los llama y valida la respuesta.
3. **`hooks/`** envuelve los endpoints con TanStack Query (claves `['accounts']`, `['dashboard']`, `['me']`…).
4. **`components/`** son las vistas, con los textos sacados de `locales/es-BO/<feature>.json`.

## Estado del cliente

- **Servidor:** TanStack Query, con invalidación tras cada mutación (por ejemplo, guardar un gasto invalida `['dashboard']` y `['accounts']`).
- **URL:** el mes, los filtros y el detalle van en la URL, validados con Zod (`useValidatedSearch`, [[ADR-16 - Navegación con React Router]]).
- **Borradores:** `sessionStorage` con la clave `draft:{userId}:{formKey}`. Sobreviven a que el celular descarte la pestaña ([[ADR-17 - Estado de cliente mínimo]]).
- **UI:** store mínimo propio con `useSyncExternalStore` (diálogo de sesión expirada, sin conexión).

## Features

| Feature | Módulo |
|---|---|
| [[Web - auth]] · [[Web - profile]] | [[M1 - Acceso y cuenta]] |
| [[Web - Layout (AppShell)]] · [[Web - Router y rutas]] · [[Web - App (guards y prefetch)]] | [[M2 - Navegación y estructura]] |
| [[Web - fx]] | [[M3 - Monedas y tipo de cambio]] |
| [[Web - accounts]] | [[M4 - Cuentas]] |
| [[Web - categories]] | [[M5 - Categorías]] |
| [[Web - transactions]] | [[M6 - Transacciones]] |
| [[Web - register]] | [[M7 - Registrar]] |
| [[Web - dashboard]] | [[M8 - Inicio (dashboard)]] |
| [[Web - settings]] | [[M9 - Ajustes y personalización]] |
| [[Web - onboarding]] | [[M10 - Onboarding]] |
| [[Web - budgets]] | [[M11 - Presupuestos]] |
| [[Web - goals]] | [[M12 - Metas de ahorro]] |
| [[Web - debts]] | [[M13 - Deudas y préstamos]] |
| [[Web - recurring]] | [[M14 - Recurrentes]] |
| [[Web - notifications]] | [[M15 - Recordatorios y avisos]] |

## Transversal

[[Web - lib (utilidades)]] · [[Web - Componentes UI (shadcn)]] · [[Web - Componentes compartidos]] · [[Web - i18n y locales]] · [[Diseño - Dirección visual de la web]] · [[Config - vite.config.ts]] · [[Config - tailwind.config.ts]] · [[Config - components.json (shadcn)]] · [[Pruebas de la web]]

---
## 🔗 Relacionado

- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]]

