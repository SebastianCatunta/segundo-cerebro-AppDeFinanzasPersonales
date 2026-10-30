---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.9 M9 - Ajustes y personalización (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M9"
modulo: "M9"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.8 M8 - Inicio (V1.0)]] · → [[Plan 4.10 M10 - Onboarding (V1.0)]]

### 4.9 M9 — Ajustes y personalización (V1.0)

#### 4.9.1 Contratos

```ts
UpdateSettingsInput = z.object({
  numberFormat: z.enum(['dot_comma','comma_dot']), dateFormat: z.enum(['dmy','iso','short_text']),
  weekStart: z.enum(['monday','sunday']), theme: z.enum(['system','light','dark']), sidebarCollapsed: z.boolean(),
  defaultAccountId: z.string().uuid().nullable(), alwaysShowNote: z.boolean(),
  dashboardBlocks: z.array(z.object({ key: z.enum(['budget','byCategory','pace','upcoming','balances','recent']), visible: z.boolean() })).length(6),
  favoriteCategories: z.object({ kind: z.enum(['expense','income']), ids: z.array(z.string().uuid()).max(8) })
}).partial().strict();
ResetSettingsInput = z.object({ section: z.enum(['general','currencies','register','dashboard','reminders']) });
SettingsDto = { …todos los campos, favorites: { expense: string[]; income: string[] } }
```

**`packages/domain/format`:** `formatMoney(amount, symbol, numberFormat)` → "Bs 1.234,56" o "Bs 1,234.56" (RF-M9-02); `formatDate(date, dateFormat)`; `relativeDay(date, today, weekStart, dateFormat)` → "Hoy", "Ayer", "Lun 13", y fuera de la semana la fecha con `formatDate` (RF-M9-03); `weekDays(weekStart)` da el orden de los días del calendario (RF-M9-04).

#### 4.9.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/settings` | — | — |
| `PATCH /api/settings` | Parcial. Gana la última escritura (EC-M9-01). `defaultAccountId` debe ser una cuenta activa. `favoriteCategories` reemplaza las del tipo en `favorite_category` dentro de una transacción. | `ACCOUNT_ARCHIVED 409` · `CATEGORY_ARCHIVED 409` · `VALIDATION_ERROR` |
| `POST /api/settings/reset` | Devuelve la sección a sus valores por defecto. `currencies` solo cambia la referencia a la mediana y desactiva el valor manual (con su evento); `register` deja la cuenta por defecto en NULL, borra las favoritas y apaga la nota siempre visible. Nunca toca datos (RF-M9-05). | — |

#### 4.9.3 Ciclo de vida y concurrencia
- Cada ajuste está en su valor por defecto o en uno personalizado. Se guarda al instante: la web guarda 300 ms después del último cambio, con actualización optimista y revirtiendo si hay error (RF-M9-01).
- **Otros dispositivos:** reflejan el cambio al reenfocar la ventana (`refetchOnWindowFocus`) o al recargar (EC-M9-01).
- **Primer pintado del tema:** usa la copia en localStorage para evitar un parpadeo; el valor del servidor prevalece al cargar.

#### 4.9.4 UI y estado
- **Rutas:**
  - `/ajustes/general`: formatos, primer día de la semana, tema;
  - `/ajustes/monedas`: M3;
  - `/ajustes/registrar`: cuenta por defecto, `<FavoritesPicker>` con hasta 8 por tipo, atajos reordenables, nota siempre visible;
  - `/ajustes/inicio`: `<BlocksOrderList>` con interruptores de visibilidad;
  - `/ajustes/recordatorios`: V1.2, M15.
- **"Restablecer valores por defecto":** cada sección tiene el suyo, con confirmación.
- **Estado:** `useSettings()` con la clave `['settings']`. `I18nProvider` y `ThemeProvider` leen de ahí.

---

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M15 - Recordatorios y avisos]] · [[M3 - Monedas y tipo de cambio]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Entidades:** [[Entidad - FavoriteCategory]]

