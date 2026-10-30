---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.8 M8 - Inicio (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M8"
modulo: "M8"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.7 M7 - Registrar (V1.0)]] · → [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]]

### 4.8 M8 — Inicio (V1.0)

#### 4.8.1 Contratos

```ts
DashboardQuery = z.object({ month: z.string().regex(/^\d{4}-\d{2}$/) });
DashboardDto = {
  range: { firstMonth: string; currentMonth: string },                         // RF-M8-01
  cards: { income: Money; expense: Money; balance: Money; savingsRatePct: number | null;   // RF-M8-03
           variations: { income: string|null; expense: string|null; balance: Money|null; savingsRatePp: number|null } },
  budgets?: BudgetBarDto[],                                                     // V1.1 (RF-M8-08)
  byCategory: { top: { categoryId; name; amount: Money; pct: number }[5]; others: { amount: Money; pct: number } | null },
  pace: { current: { day: number; cumulative: Money }[]; previous: { day: number; cumulative: Money }[] },   // RF-M8-06
  upcoming?: UpcomingItemDto[],                                                 // V1.1 (RF-M8-09)
  balances: { netWorth: { base: Money; other: Money | null }; top: AccountDto[5]; asOfToday: true },          // RF-M8-07
  recent: TransactionDto[5]
}
```

**`packages/domain/dashboard`:** `comparisonWindow(month, today)` (tramo del mes en curso o mes completo, EC-M8-03), `pctChange` (entero redondeado con la mitad hacia arriba; anterior = 0 → null), `savingsRate` (null si no hay ingresos o el balance es negativo).

#### 4.8.2 Endpoints
- `GET /api/dashboard?month` responde con una sola consulta SQL por bloque, dentro de una transacción de solo lectura:
  - ingresos y gastos excluyen RN-02 y se convierten con las tasas guardadas (RF-M8-02);
  - el gasto por categoría suma las hijas a su padre;
  - el ritmo es la suma acumulada por día;
  - los saldos son los de hoy.
- Los bloques no liberados se omiten según `RELEASE`, y los ocultos se omiten según `dashboard_blocks`.
- **Objetivo:** p95 por debajo de 1,2 s con 5.000 movimientos (RNF-03), con los índices `ledger_tx_list` y `ledger_entry_balance`.

#### 4.8.3 Ciclo de vida y concurrencia
- **Estados de cada bloque:** Con datos, Vacío ("Aún no tienes gastos este mes · Registrar"), No disponible (no liberado: no se renderiza) y Oculto (por el ajuste).
- **Sin cuentas (EC-M8-01):** invitación a crear la primera cuenta.
- **Mes sin movimientos (EC-M8-02):** las tarjetas en 0, la tasa de ahorro oculta y los gráficos vacíos.
- **Sin tasa (EC-M8-04):** `other: null` y la leyenda "Sin tipo de cambio".
- **Lectura sin bloqueos:** basta con `READ COMMITTED`.

#### 4.8.4 UI y estado
- **`/` (Inicio):**
  - `<MonthSelector>` y `<SummaryCards>` (con variaciones: gastos que suben en rojo; ingresos, balance y tasa de ahorro que suben en verde);
  - luego, en el orden de `dashboard_blocks`: `<BudgetBlock>` (V1.1), `<CategoryBars>`, `<PaceChart>` (Recharts), `<UpcomingBlock>` (V1.1), `<BalancesBlock>` ("Saldos al día de hoy") y `<RecentBlock>`.
- **Navegación (RF-M8-10):** cada tarjeta o categoría navega a `/movimientos?month=…&kind=…` o `&categoryId=…`.
- **Estado (RF-M8-11):** `['dashboard', month]`, con `staleTime` 0 e invalidado por toda mutación.

---

---
## 🔗 Relacionado

- **Módulos:** [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

