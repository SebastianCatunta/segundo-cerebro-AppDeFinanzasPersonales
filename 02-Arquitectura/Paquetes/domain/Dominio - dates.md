---
tipo: "dominio"
fuente: "packages/domain/src/dates.ts"
tags:
  - "paquete/domain"
actualizado: "2026-10-30"
---

# Dominio · `dates.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

> [!quote] Comentario del código
> Calendar day as ISO text 'YYYY-MM-DD', in the user's time zone (RN-07).

## Exportaciones (13)

| Nombre | Tipo | Descripción |
|---|---|---|
| `LocalDate` | type | Calendar day as ISO text 'YYYY-MM-DD', in the user's time zone (RN-07). |
| `YearMonth` | type | Month as ISO text 'YYYY-MM'. |
| `Instant` | type | A point in time, as returned by `Clock.now()`. |
| `DateRange` | interface | Inclusive range of calendar days. |
| `BOLIVIA_TIME_ZONE` | const | Time zone of the Bolivian calendar used for market rates (RF-M3-13). |
| `todayFor` | function | Local calendar day of an instant in a time zone (RN-07, RNF-20). |
| `isFutureFor` | function | True when the date is after today in the user's time zone (RN-07). |
| `boliviaDay` | function | Calendar day of an instant in Bolivia, used for market rates (RF-M3-13). |
| `monthRange` | function | First and last day of a month 'YYYY-MM'. |
| `clampDay` | function | Day that exists in the month: a missing day falls on the last day (RF-M14-02). |
| `addMonths` | function | Adds whole months; a missing day falls on the last day of the target month (RF-M14-02). |
| `daysBetween` | function | Calendar days from `from` to `to` (negative when `to` is earlier). |
| `startOfDayInstant` | function | First instant of a local day in a time zone (RNF-20). On days whose midnight is skipped by a daylight saving change, it is the first instant that exists in that day. |

**Pruebas:** `packages/domain/test/dates.test.ts`

---
## 🔗 Relacionado

- **Módulos:** [[M14 - Recurrentes]] · [[M3 - Monedas y tipo de cambio]]
- **Requerimientos no funcionales:** [[Spec 3.7 Tiempo]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

