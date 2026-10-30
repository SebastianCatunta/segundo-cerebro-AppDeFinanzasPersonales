---
tipo: "frontend"
fuente: "apps/web/src/app/layout"
tags:
  - "frontend/layout"
  - "modulo/M2"
actualizado: "2026-10-30"
---

# Layout: AppShell y navegación

Estructura visible de la app (M2): cabecera con botón "Volver", barra de pestañas inferior (móvil), barra lateral (escritorio), menú "Más", overlay sin conexión, diálogo de sesión expirada y toast de "Deshacer".

| Archivo | Exporta | Descripción (comentario del código) |
|---|---|---|
| `app-shell.tsx` | `AppShell` |  |
| `back-button.tsx` | `BackButton` | Goes back inside the app, or to the parent screen when the user arrived by a direct link (EC-M2-04). |
| `bottom-tab-bar.tsx` | `useTabLink`, `BottomTabBar` | Modules whose memory the current location feeds; "More" remembers what was opened from it. |
| `header.tsx` | `Header` |  |
| `more-menu.tsx` | `MoreMenu` | The "More" screen: sections without released modules are hidden (RF-M2-12). |
| `nav-items.ts` | `NavSection`, `NavItem`, `TAB_ITEMS`, `MAIN_ITEMS`, `SECTION_ITEMS`, `SECTION_ORDER`, `ALL_ITEMS` | The five tabs of the bottom bar; "more" exists only in this format (RF-M2-02). |
| `offline-overlay.tsx` | `OfflineOverlay` | Turns the browser `offline` event into the app's offline state (plan §4.2.3). |
| `route-parents.ts` | `parentOf` | Screen a route hangs from, or null for tab roots (RF-M2-13). |
| `session-expired-dialog.tsx` | `SessionExpiredDialog` | Sign-in on top of the current screen; the screen underneath stays mounted (RF-M2-08). |
| `sidebar.tsx` | `Sidebar` | Always mounted, shown from lg up; the collapsed state lives in the user's settings (RF-M2-09). |
| `undo-toast.tsx` | `UndoToast` | What the API asked to confirm before reverting (RF-M12-05). |

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M2 - Navegación y estructura]]
- **Spec / Plan / Constitución:** [[Plan 4.2 M2 - Navegación y estructura (V1.0)]]

