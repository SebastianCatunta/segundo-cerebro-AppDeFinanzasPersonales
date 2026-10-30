---
tipo: "frontend"
modulo: "M14"
fuente: "apps/web/src/features/recurring"
tags:
  - "frontend/feature"
  - "modulo/M14"
actualizado: "2026-10-30"
---

# Web · feature `recurring`

Carpeta `apps/web/src/features/recurring/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M14 - Recurrentes]]
- **Textos (i18n):** `locales/es-BO/recurring.json` (11 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/recurrentes` | `RecurringPage` | ✅ | solo si M14 está liberado |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `overviewEndpoint` | `GET` | `/api/recurring` |
| `confirmOccurrenceEndpoint` | `POST` | `/api/recurring/occurrences/${encodeURIComponent(occurrenceId)}/confirm` |
| `skipOccurrenceEndpoint` | `POST` | `/api/recurring/occurrences/${encodeURIComponent(occurrenceId)}/skip` |

## Hooks (TanStack Query)

- `use-recurring.ts` — `RECURRING_KEY`, `recurringQuery`, `useRecurring`, `useConfirmOccurrence`, `useSkipOccurrence`. Confirming registers a movement, so it also refreshes the movements, accounts and Inicio.

## Componentes (6)

| Archivo | Exporta | Descripción |
|---|---|---|
| `confirm-pending-dialog.tsx` | `ConfirmPendingDialog` | A positive decimal typed by the user as text with 2 decimals, or `null` (ADR-03). |
| `pending-list.tsx` | `PendingList` | "Pendientes de confirmar", each with Confirmar and Omitir (RF-M14-13). |
| `resume-dialog.tsx` | `ResumeDialog` | Asks which skipped occurrences to register when a paused rule resumes (RF-M14-09). |
| `rule-form.tsx` | `RuleForm` | Creates a recurring rule (RF-M14-01): the start is today or later (RF-M14-03) and the amount is required only in automatic mode (RF-M14-14). |
| `rules-list.tsx` | `useRuleAmount`, `RulesList` | The amount of a rule with its sign, or "monto por definir" without one (RF-M14-14). |
| `upcoming-30.tsx` | `Upcoming30` | "Próximos vencimientos" of the next 30 days (RF-M14-13). |

**Backend relacionado:** [[API recurring]]

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]]

