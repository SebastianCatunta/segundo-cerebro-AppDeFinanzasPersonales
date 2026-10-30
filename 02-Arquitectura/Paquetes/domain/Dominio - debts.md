---
tipo: "dominio"
fuente: "packages/domain/src/debts.ts"
tags:
  - "paquete/domain"
  - "modulo/M13"
actualizado: "2026-10-30"
---

# Dominio · `debts.ts`

Reglas puras (sin E/S) del paquete [[Paquete domain]], compartidas por la web y el API (capa 3, [[ADR-19 - Backend en capas]]).

**Módulo:** [[M13 - Deudas y préstamos]]

> [!quote] Comentario del código
> Decimal constructor for debt interest (ADR-03, ADR-14): high precision so the daily rate stays exact and accrued interest never drifts (RNF-18).

## Exportaciones (11)

| Nombre | Tipo | Descripción |
|---|---|---|
| `InterestPeriod` | type |  |
| `DebtStatus` | type |  |
| `PaymentSplit` | interface |  |
| `PaymentCheck` | interface |  |
| `PaymentValidation` | type |  |
| `DebtState` | interface |  |
| `dailyRate` | function | Daily rate: rate ÷ 100 ÷ 30 (monthly) or ÷ 365 (yearly) (RF-M13-02). |
| `accrue` | function | Unpaid interest carried from `fromDate` to `toDate` with simple daily interest on the outstanding capital, kept at 10 decimals (RF-M13-02, ADR-14, RNF-18). With capital 0 nothing more accrues (EC-M13-02). |
| `proposeSplit` | function | Prefilled split of a payment: interest first, the rest to capital (RF-M13-05). |
| `validatePayment` | function | Payment rules (RF-M13-05, RF-M13-06, EC-M13-01): the amount cannot exceed the pending balance; interest ≤ accrued, capital ≤ outstanding and both parts add up to the amount. |
| `deriveStatus` | function | Debt status (spec §2.13.2): forgiven when its balance was forgiven, paid when capital and interest are 0, overdue once the due date has passed with a pending balance. |

**Pruebas:** `packages/domain/test/debts.test.ts`

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]] · [[ADR-14 - Interés de deudas como foto]]
- **Requerimientos no funcionales:** [[Spec 3.6 Exactitud monetaria]]
- **Spec / Plan / Constitución:** [[Spec 2.13 M13 - Deudas y préstamos (V1.1)]]

