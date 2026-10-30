---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.7 M7 - Registrar (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M7"
modulo: "M7"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.6 M6 - Transacciones (V1.0)]] · → [[Plan 4.8 M8 - Inicio (V1.0)]]

### 4.7 M7 — Registrar (V1.0)

#### 4.7.1 Contratos

```ts
RegisterContextDto = {
  defaultAccountId: string | null,
  lastUsed: { expense: string | null; income: string | null; transferPair: { from: string; to: string } | null },
  grid: { expense: CategoryChip[8]; income: CategoryChip[8] },   // RF-M7-04
  shortcuts: ShortcutDto[],                                        // visibles, en orden
  todayRecent: TransactionDto[3],                                  // los 3 últimos creados hoy (RF-M7-07)
  accounts: Pick<AccountDto, 'id'|'name'|'type'|'currencyCode'|'free'|'card'|'dedicatedGoal'>[]
}
CreateShortcutInput = z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(30), kind: z.enum(['expense','income','transfer']),
  amount: Amount.optional(), accountId, destAccountId: z.string().uuid().optional(), categoryId: z.string().uuid().optional(), note: Note.optional() });
UpdateShortcutInput = CreateShortcutInput.omit({ id: true }).partial();
parseAmountInput(raw: string): Decimal | null   // domain: solo dígitos; "." o "," seguidos de 1 o 2 dígitos al final = decimal; sin miles (RF-M7-02)
```

#### 4.7.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/register/context` | Una sola consulta compuesta. Grilla: favoritas en su orden → más usadas en 60 días por categoría exacta (con empate por el uso más reciente) → precargadas por `seed_order`; nunca archivadas. "Última cuenta usada": la del último movimiento creado de ese tipo, si sigue activa. Si no hay, la primera cuenta activa por `sort_order` (RF-M7-03). | — |
| `POST /api/transactions` | Igual que en M6. La respuesta incluye `undoToken` y `todayRecent`. | Igual que en M6 |
| `GET /api/shortcuts` · `POST /api/shortcuts` · `PATCH` · `PUT /api/shortcuts/order` · `DELETE /api/shortcuts/:id` | Tope de 12, contando los ocultos (RF-M7-09). | `LIMIT_REACHED 409` (EC-M7-06) |

#### 4.7.3 Ciclo de vida y concurrencia
- **Formulario Vacío → Con borrador → Listo → Guardado:**
  - Al montarse o limpiarse genera un `id` (UUID v7) que viaja en el borrador `register`.
  - "Guardar" se habilita según RF-M7-06; en una transferencia exige además monto > 0.
  - Al guardar con éxito: `drafts.clear('register')`, un nuevo `id`, el toast con "Deshacer" y el foco en el monto.
- **Al entrar a Registrar (RF-M7-02):** con el formulario vacío, tipo Gasto y foco en el monto. Con borrador, se restaura tal cual, con su tipo.
- **Errores (EC-M7-02, EC-M7-03):** `NEGATIVE_BALANCE` muestra el error y no limpia el formulario. `EARMARK_CONFIRMATION_REQUIRED` abre `<EarmarkConfirmDialog>` con la propuesta; al confirmar se reenvía con el mismo `id` y `earmarkWithdrawals`; al cancelar, el formulario queda intacto.
- **Sin tasa (EC-M7-04):** `RATE_REQUIRED` abre `<AskRateDialog>` "¿A cuánto lo tomamos?" y se reenvía con `manualUsdRate`.
- **Atajo Visible ⇄ Oculto:** se calcula al leer (su cuenta o categoría está activa). Se elimina en cascada con su cuenta o su categoría.
- **Cuenta por defecto archivada (EC-M7-05):** `user_settings.default_account_id` pasa a NULL en la misma transacción del archivado.

#### 4.7.4 UI y estado
- **`/registrar`:**
  - `<KindToggle>` (Gasto · Ingreso · Transferencia), `<AmountInput inputMode="decimal" autoFocus>`, `<AccountChip>` (saldo libre; en tarjetas, el crédito disponible o la deuda; y el aviso "Esto resta a tu meta X" si es dedicada, RF-M7-14);
  - `<CategoryGrid>` con 8 categorías, `<AllCategoriesSheet>` (padres desplegables) y `<DateChips>` (Hoy · Ayer · Calendario, sin fechas futuras);
  - `<SecondLevel>`: nota (en el primer nivel si `always_show_note`), otra cuenta, otra fecha, comisión, "Guardar como atajo";
  - `<ShortcutChips>` (rellenan el formulario sin guardar), `<TodayRecent>` y `<QuickAccountForm>` si no hay cuentas (EC-M7-01).
- **Teclado (RF-M7-12):** orden de Tab lineal; Enter en el monto con el formulario listo equivale a "Guardar".
- **Rendimiento (RNF-01, RNF-02):** el contexto se precarga en cuanto la sesión está lista (`prefetchQuery`). La pantalla no hace ninguna petición antes de que el usuario escriba. Guardar es una sola transacción.
- **Estado:** `['register','context']`, que se actualiza con la respuesta de guardar, sin una petición extra.

---

---
## 🔗 Relacionado

- **Módulos:** [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]]

