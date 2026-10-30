---
tipo: "frontend"
modulo: "M1"
fuente: "apps/web/src/features/profile"
tags:
  - "frontend/feature"
  - "modulo/M1"
actualizado: "2026-10-30"
---

# Web · feature `profile`

Carpeta `apps/web/src/features/profile/` de la [[Web - Visión general|SPA React]].

- **Módulo:** [[M1 - Acceso y cuenta]]
- **Textos (i18n):** `locales/es-BO/profile.json` (5 claves de primer nivel) → [[Web - i18n y locales]]

## Rutas

| Ruta | Pantalla | Precarga datos | Entrega |
|---|---|---|---|
| `/perfil` | `ProfilePage` | — | V1.0 |
| `/perfil/eliminar` | `DeleteAccountPage` | — | V1.0 |

## Endpoints que consume (`api.ts`)

| Endpoint | Método | Ruta |
|---|---|---|
| `updateMeEndpoint` | `PATCH` | `/api/me` |
| `changePasswordEndpoint` | `POST` | `/api/auth/password/change` |
| `signOutEndpoint` | `POST` | `/api/auth/sign-out` |
| `signOutAllEndpoint` | `POST` | `/api/auth/sign-out-all` |

## Componentes (4)

| Archivo | Exporta | Descripción |
|---|---|---|
| `change-password-form.tsx` | `ChangePasswordForm` | Changes the password; the API closes the other sessions and mails a notice (RF-M1-10, EC-M1-05). |
| `delete-account.tsx` | `DeleteAccount` | `/perfil/eliminar`: asks for the password and the word ELIMINAR (RF-M1-15, EC-M1-08) and offers "Exportar antes". |
| `export-button.tsx` | `ExportButton` | Time the browser gets to start the download before the blob URL is released. |
| `profile-form.tsx` | `ProfileForm` | Every IANA zone the browser knows, always including the one the profile already has. |

**Backend relacionado:** [[API auth]], [[API me]]
