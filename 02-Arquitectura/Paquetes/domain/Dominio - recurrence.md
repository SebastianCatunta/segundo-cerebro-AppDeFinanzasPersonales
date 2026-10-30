---
tipo: "dominio"
fuente: "packages/domain/src/recurrence.ts"
tags:
  - "paquete/domain"
  - "modulo/M14"
actualizado: "2026-10-30"
---

# Dominio · `recurrence.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

**Módulo:** [[M14 - Recurrentes]]

> [!quote] Comentario del código
> Daily, weekly (a single weekday, 0 = Sunday), monthly (fixed day) or yearly (RF-M14-01).

## Exportaciones (8)

| Nombre | Tipo | Descripción |
|---|---|---|
| `RecurrenceFrequency` | type | Daily, weekly (a single weekday, 0 = Sunday), monthly (fixed day) or yearly (RF-M14-01). |
| `RecurrenceEnd` | type | No end, until a date (inclusive) or after a number of generated occurrences. |
| `RecurrenceRule` | interface |  |
| `Installment` | interface | "Cuota X de N" (RF-M14-13). |
| `nextDates` | function | The next `n` occurrences on or after `fromDate` (RF-M14-01, RF-M14-02, EC-M14-01). An end date is respected; an end by count depends on the generated count (see `isFinished`). |
| `skippedDates` | function | Occurrences skipped while paused: after `pausedAt` and before `today`, with their original date, up to the end date when it passed during the pause (RF-M14-09, EC-M14-06). |
| `isFinished` | function | True when the rule is Finalizada: it reached N generated occurrences (registered, pending and omitted) or its end date passed (RF-M14-09, EC-M14-05, EC-M14-06). |
| `installment` | function | "Cuota X de N" of the next occurrence when the end is by count; null otherwise (RF-M14-13). |

**Pruebas:** `packages/domain/test/recurrence.test.ts`
