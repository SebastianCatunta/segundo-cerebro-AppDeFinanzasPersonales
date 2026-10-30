---
tipo: "frontend"
fuente: "apps/web/src/lib"
tags:
  - "frontend/lib"
actualizado: "2026-10-30"
---

# Librería `lib/` de la web

Utilidades transversales: cliente HTTP tipado con Zod, borradores en sessionStorage ([[ADR-17 - Estado de cliente mínimo]]), formateadores, traducción de errores problem+json, detección de conexión, parámetros de búsqueda validados (`useValidatedSearch`) y el store de UI.

| Archivo | Exporta | Descripción (comentario del código) |
|---|---|---|
| `api-client.ts` | `HttpMethod`, `Endpoint`, `CallOptions`, `ApiErrorInit`, `ApiError`, `CreateApiClientOptions`, `Call`, `createApiClient`, `call` |  |
| `drafts.ts` | `DraftIssues`, `LoadDraftOptions`, `RestoredDraft`, `Drafts`, `CreateDraftsOptions`, `createDrafts`, `saveDraft`, `loadDraft`, `clearDraft`, `clearAllDrafts`, `UseDraftOptions`, `UseDraft`, `useDraft` |  |
| `formatters.ts` | `Formatters`, `buildFormatters` | Amount as decimal text and the currency symbol, e.g. "Bs 1.234,56" (RF-M9-02). |
| `i18n-errors.ts` | `ApiErrorLike`, `messageForError` |  |
| `last-session-hint.ts` | `LastSessionHint`, `saveLastSessionHint`, `readLastSessionHint`, `clearLastSessionHint` | What the last successful `/api/me` of this device said that is enough to start asking for the data of the Inicio before the session answers: the time zone (to know the month) and whether the Onboarding is done. Never the email, the name or the id (RF-M1-04). |
| `online.ts` | `CreateOnlineOptions`, `Online`, `createOnline`, `online` |  |
| `search-params.ts` | `SearchSchema`, `SearchValue`, `SetSearch`, `parseSearch`, `serializeSearch`, `useValidatedSearch` |  |
| `ui-store.ts` | `TabMemoryEntry`, `TabMemory`, `UndoState`, `UiState`, `UiStore`, `rootFor`, `createUiStore`, `uiStore`, `useUiStore` |  |
| `use-back-to-close.ts` | `useBackToClose` | Lets the Back button close an open dialog without leaving the screen (RF-M2-06). |
| `use-is-desktop.ts` | `useIsDesktop` | True from 1024 px up, where the sidebar replaces the bottom bar. |
| `utils.ts` | `cn` |  |

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]] · [[M9 - Ajustes y personalización]]

