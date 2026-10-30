---
tipo: "dominio"
fuente: "packages/domain/src/format.ts"
tags:
  - "paquete/domain"
  - "modulo/M9"
actualizado: "2026-10-30"
---

# Dominio · `format.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

**Módulo:** [[M9 - Ajustes y personalización]]

> [!quote] Comentario del código
> Formats an amount as "Bs 1.234,56" or "Bs 1,234.56" (RF-M9-02); negatives use U+2212.

## Exportaciones (9)

| Nombre | Tipo | Descripción |
|---|---|---|
| `NumberFormat` | type |  |
| `DateFormat` | type |  |
| `WeekStart` | type |  |
| `formatMoney` | function | Formats an amount as "Bs 1.234,56" or "Bs 1,234.56" (RF-M9-02); negatives use U+2212. |
| `parseAmountInput` | function | Parses what the user typed as an amount (RF-M7-02): digits only, with an optional final "." or "," followed by 1 or 2 digits as the decimal part. No thousands separators nor operations; anything else gives null. |
| `WeekDay` | type |  |
| `formatDate` | function | Formats a calendar day as "15/10/2026", "2026-10-15" or "15 oct 2026" (RF-M9-03). |
| `relativeDay` | function | Relative label for list rows (RF-M9-03): "Hoy", "Ayer", or the abbreviated day and its number ("Lun 13") inside the week of `today` that starts on `weekStart` (RF-M9-04); outside that week, the date in the chosen format. |
| `weekDays` | function | Abbreviated day names in calendar order, starting on `weekStart` (RF-M9-04). |

**Pruebas:** `packages/domain/test/format-date.test.ts`, `packages/domain/test/format-money.test.ts`

---
## 🔗 Relacionado

- **Módulos:** [[M7 - Registrar]]

