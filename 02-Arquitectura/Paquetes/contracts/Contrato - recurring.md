---
tipo: "contrato"
fuente: "packages/contracts/src/recurring.ts"
tags:
  - "paquete/contracts"
  - "modulo/M14"
actualizado: "2026-10-30"
---

# Contratos Zod · `recurring.ts`

Archivo `packages/contracts/src/recurring.ts` del paquete [[Paquete contracts]]. Define schemas Zod compartidos por la web y el API (única fuente de entradas, salidas y errores).

**Módulo:** [[M14 - Recurrentes]]

> [!quote] Comentario del código
> Daily, weekly (a single weekday), monthly (fixed day) or yearly (RF-M14-01).

## Exportaciones (22)

| Nombre | Tipo | Descripción |
|---|---|---|
| `RuleFrequency` | const | Daily, weekly (a single weekday), monthly (fixed day) or yearly (RF-M14-01). |
| `RuleFrequency` | type |  |
| `RuleEnd` | const |  |
| `RuleEnd` | type |  |
| `RuleKind` | const |  |
| `RuleKind` | type |  |
| `RuleMode` | const |  |
| `RuleMode` | type |  |
| `CreateRuleInput` | const | The amount is required in automatic mode and optional in confirmation mode (RF-M14-14). |
| `CreateRuleInput` | type |  |
| `UpdateRuleInput` | const | Editing only affects future occurrences (RF-M14-10). |
| `UpdateRuleInput` | type |  |
| `ConfirmOccurrenceInput` | const |  |
| `ConfirmOccurrenceInput` | type |  |
| `ResumeInput` | const | The skipped dates the user chooses to register when resuming a rule (RF-M14-09). |
| `ResumeInput` | type |  |
| `RuleStatus` | const |  |
| `RuleStatus` | type |  |
| `RuleDto` | interface |  |
| `OccurrenceDto` | interface |  |
| `UpcomingDto` | interface |  |
| `RecurringOverviewDto` | interface |  |
