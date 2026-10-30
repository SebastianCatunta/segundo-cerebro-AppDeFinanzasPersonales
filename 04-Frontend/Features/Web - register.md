---
tipo: "frontend"
modulo: "M7"
fuente: "apps/web/src/features/register"
tags:
  - "frontend/feature"
  - "modulo/M7"
actualizado: "2026-10-30"
---

# Web · feature `register`

Carpeta `apps/web/src/features/register/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M7 - Registrar]]
- **Textos (i18n):** `locales/es-BO/register.json` (16 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/registrar` | `RegisterPage` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `registerContextEndpoint` | `GET` | `/api/register/context` |
| `createTransactionEndpoint` | `POST` | `/api/transactions` |

## Hooks (TanStack Query)

- `use-register-context.ts` — `REGISTER_CONTEXT_KEY`, `registerContextQuery`, `useRegisterContext`, `useCreateTransaction`. Plan §4.7.4: the context of Registrar, updated with the answer of saving.

## Componentes (14)

| Archivo | Exporta | Descripción |
|---|---|---|
| `account-chip.tsx` | `AccountChip` | `<AccountChip>` (plan §4.7.4): the preselected account with its free balance; a card shows its available credit when it has a limit, or its debt (RF-M7-11). An expense from an account dedicated to a goal warns that it takes from the goal (RF-M7-14). |
| `all-categories-sheet.tsx` | `AllCategoriesSheet` | The active categories of the kind; it loads only once the sheet is open. |
| `amount-input.tsx` | `AmountInput` | What the amount may hold while typing (RF-M7-02): digits and one final "." or "," with up to 2 digits, whatever the number format. No thousands separators nor operations. |
| `ask-rate-dialog.tsx` | `AskRateDialog` | What the user typed as a rate, as decimal text; `null` when it is not one over 0. |
| `category-grid.tsx` | `swatchOf`, `CategoryMark`, `CategoryGrid` | The accent of a category in light and dark (the 12 colors of `PALETTE`). |
| `date-chips.tsx` | `dayBefore`, `DateChips` | The calendar (react-day-picker and date-fns) loads when the picker opens, not with the screen (RNF-01), already in Spanish. |
| `fee-field.tsx` | `FeeField` | Shown only once the API asks for it: there is no "Comisiones bancarias" (EC-M6-08). |
| `kind-toggle.tsx` | `KindToggle` | The kinds the form offers, in their order. |
| `register-form.tsx` | `RegisterForm` | The UUID v7 of the movement, kept in the draft so a retry is idempotent (ADR-11). |
| `save-as-shortcut-dialog.tsx` | `SaveAsShortcutDialog` | What the form holds now, saved as a shortcut (RF-M7-10). |
| `second-level.tsx` | `NoteField`, `SecondLevel` | The note of the movement, up to 140 characters (RF-M6-03). |
| `shortcut-chips.tsx` | `ShortcutChips` | `<ShortcutChips>` (plan §4.7.4): the visible shortcuts of the current kind. Tapping one fills the form without saving it (RF-M7-09). |
| `today-recent.tsx` | `TodayRecent` | How many of today's movements Registrar shows (RF-M7-07). |
| `transfer-fields.tsx` | `TransferFields` | Only when both accounts use different currencies (RF-M3-07). |

**Backend relacionado:** [[API register]], [[API shortcuts]]

---
## 🔗 Relacionado

- **Módulos:** [[M3 - Monedas y tipo de cambio]] · [[M6 - Transacciones]]
- **Decisiones (ADR):** [[ADR-11 - Idempotencia con UUID v7]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]]
- **Spec / Plan / Constitución:** [[Plan 4.7 M7 - Registrar (V1.0)]]

