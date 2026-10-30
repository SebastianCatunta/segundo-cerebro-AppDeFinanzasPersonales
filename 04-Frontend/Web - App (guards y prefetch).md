---
tipo: "frontend"
fuente: "apps/web/src/app"
tags:
  - "frontend/router"
actualizado: "2026-10-30"
---

# App: guardas y precarga

Archivos sueltos de `app/`: guardas de sesión, Onboarding y entrega; precarga de rutas al elegir una pestaña; y el router (ver [[Web - Router y rutas]]).

| Archivo | Exporta | Descripción (comentario del código) |
|---|---|---|
| `guards.tsx` | `prefetchPrivateData`, `warmUpSession`, `RequireSession`, `RequireOnboardingDone`, `ReleaseGate` | How long the prefetched data stays fresh, so the guard does not ask for it twice. |
| `prefetch-routes.ts` | `PREFETCH_FRESH_MS`, `prefetchRoute` | How long prefetched data stays fresh, so asking again right away does not repeat the request. |
| `router.tsx` | `NotFoundPage`, `router` | The access screens: the logo of 48 px, centered over the title (RF-M2-14). Each screen centers itself in the full height, so the layout takes that job and the screen keeps only its width. |

---
## 🔗 Relacionado

- **Módulos:** [[M2 - Navegación y estructura]]

