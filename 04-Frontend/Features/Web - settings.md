---
tipo: "frontend"
modulo: "M9"
fuente: "apps/web/src/features/settings"
tags:
  - "frontend/feature"
  - "modulo/M9"
actualizado: "2026-10-30"
---

# Web · feature `settings`

Carpeta `apps/web/src/features/settings/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M9 - Ajustes y personalización]]
- **Textos (i18n):** `locales/es-BO/settings.json` (8 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/ajustes` | `SettingsHub` | — | V1.0 |
| `/ajustes/general` | `GeneralSettings` | — | V1.0 |
| `/ajustes/monedas` | `CurrencySettings` | — | V1.0 |
| `/ajustes/registrar` | `RegisterSettings` | — | V1.0 |
| `/ajustes/inicio` | `BlocksOrderList` | — | V1.0 |
| `/ajustes/recordatorios` | `PreferencesList` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `getSettingsEndpoint` | `GET` | `/api/settings` |
| `updateSettingsEndpoint` | `PATCH` | `/api/settings` |
| `listPreferencesEndpoint` | `GET` | `/api/notification-preferences` |
| `updatePreferencesEndpoint` | `PATCH` | `/api/notification-preferences` |

## Hooks (TanStack Query)

- `use-notification-preferences.ts` — `PREFERENCES_KEY`, `preferencesReleased`, `useNotificationPreferences`, `useUpdatePreference`. The configuration of the notices exists only from the V1.2 on (RF-M15-07).
- `use-settings.ts` — `SETTINGS_KEY`, `useSettings`, `useUpdateSettings`, `useFormatters`
- `use-update-settings.ts` — `AUTOSAVE_DELAY_MS`, `GeneralSettingsPatch`, `useAutosaveSettings`. Plan §4.9.3: the web saves 300 ms after the last change.

## Componentes (10)

| Archivo | Exporta | Descripción |
|---|---|---|
| `base-currency-select.tsx` | `BaseCurrencySelect` | BOB and USD are always active and have no rate of their own (RF-M3-01). |
| `blocks-order-list.tsx` | `BlocksOrderList` | Blocks 3 to 8 that exist today; the ones of V1.1 stay saved but are not shown (RF-M8-10). |
| `currency-settings.tsx` | `CurrencySettings` | "Restablecer valores por defecto" of the section: the reference goes back to the parallel median and the manual value is turned off. It refreshes every query, since the rate in use changes (plan §4.3.4, §4.9.4). |
| `favorites-picker.tsx` | `FavoritesPicker` | The favorites of this kind, in their order. |
| `general-settings.tsx` | `GeneralSettings` | `/ajustes/general`: formats, first day of the week and theme, saved on change (plan §4.9.4). |
| `preferences-list.tsx` | `PreferencesList` | The values the API takes when a setting was never chosen (plan §4.15.1). |
| `register-settings.tsx` | `RegisterSettings` | What the Registrar section changes; favorites travel one kind at a time. |
| `reset-section-button.tsx` | `ResetSectionButton` | "Restablecer valores por defecto" of one section, with confirmation (RF-M9-05, plan §4.9.4). |
| `settings-hub.tsx` | `SettingsHub` | V1.0 sections of Ajustes (spec §2.9.1). |
| `shortcuts-manager.tsx` | `ShortcutsManager` | Registrar shows the shortcuts of its context, so it is refreshed with every change. |

**Backend relacionado:** [[API settings]]

---
## 🔗 Relacionado

- **Módulos:** [[M15 - Recordatorios y avisos]] · [[M3 - Monedas y tipo de cambio]] · [[M8 - Inicio (dashboard)]]
- **Spec / Plan / Constitución:** [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]] · [[Plan 4.3 M3 - Monedas y tipo de cambio (V1.0)]] · [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]] · [[Spec 2.9 M9 - Ajustes y personalización (V1.0)]]

