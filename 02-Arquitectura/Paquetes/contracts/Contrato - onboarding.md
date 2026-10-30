---
tipo: "contrato"
fuente: "packages/contracts/src/onboarding.ts"
tags:
  - "paquete/contracts"
  - "modulo/M10"
actualizado: "2026-10-30"
---

# Contratos Zod · `onboarding.ts`

Archivo `packages/contracts/src/onboarding.ts` del paquete [[Paquete contracts]]. Define schemas Zod compartidos por la web y el API (única fuente de entradas, salidas y errores).

**Módulo:** [[M10 - Onboarding]]

> [!quote] Comentario del código
> Most accounts created in step 2 at once.

## Exportaciones (14)

| Nombre | Tipo | Descripción |
|---|---|---|
| `OnboardingStep` | const |  |
| `OnboardingStep` | type |  |
| `AccountPreset` | const | A suggested account of step 2, checked or not by default. |
| `AccountPreset` | type |  |
| `OnboardingDto` | const |  |
| `OnboardingDto` | type |  |
| `Step1Input` | const |  |
| `Step1Input` | type |  |
| `Step2Input` | const | The balance date is always today, set by the server (RF-M10-04). |
| `Step2Input` | type |  |
| `Step3Input` | const |  |
| `Step3Input` | type |  |
| `SkipInput` | const |  |
| `SkipInput` | type |  |
