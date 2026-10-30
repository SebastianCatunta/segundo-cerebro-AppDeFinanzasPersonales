---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 4.10 M10 - Onboarding (V1.0)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
  - "modulo/M10"
modulo: "M10"
actualizado: "2026-10-30"
---

↑ [[Plan 4. Diseño Técnico por Módulo]] · ← [[Plan 4.9 M9 - Ajustes y personalización (V1.0)]] · → [[Plan 4.11 M11 - Presupuestos (V1.1)]]

### 4.10 M10 — Onboarding (V1.0)

#### 4.10.1 Contratos

```ts
OnboardingDto = { step: 1|2|3; completed: boolean; presets: { accounts: AccountPreset[]; categories: CategoryNode[] }; rate: RatesCurrentDto['inUse'] | null }
Step1Input = z.object({ baseCurrency: z.enum(['BOB','USD']) });
Step2Input = z.object({ accounts: z.array(z.object({ id: z.string().uuid(), name: AccountName, type: AccountType,
  currencyCode: CurrencyCode, balance: AmountAbs })).max(20) });   // fecha = hoy (RF-M10-04)
Step3Input = z.object({ removeCategoryIds: z.array(z.string().uuid()), newCategories: z.array(CreateCategoryInput) });
SkipInput  = z.object({ step: z.union([z.literal(1), z.literal(2), z.literal(3)]) });
```

#### 4.10.2 Endpoints

| Método y ruta | Comportamiento | Errores |
|---|---|---|
| `GET /api/onboarding` | — | `ONBOARDING_DONE 409` si ya terminó |
| `POST /api/onboarding/step1` | `UPDATE user_settings SET base_currency = …, onboarding_step = 2 WHERE onboarding_step = 1`. | `STEP_MISMATCH 409 {currentStep}` |
| `POST /api/onboarding/step2` | Crea las cuentas (idempotente, RF-M4-01 y RF-M4-02) + `onboarding_step = 3`. | `NAME_TAKEN 409` (EC-M10-02) · `VALIDATION_ERROR` (EC-M10-01) · `STEP_MISMATCH` |
| `POST /api/onboarding/step3` | Borra las precargadas desmarcadas (al quitar un padre se quitan sus hijas; la del sistema no se puede quitar → `SYSTEM_CATEGORY`, RF-M10-05), crea las nuevas y marca `onboarding_completed_at`. | `SYSTEM_CATEGORY 422` · `STEP_MISMATCH` |
| `POST /api/onboarding/skip` · `/skip-all` | Saltar el paso 1 deja BOB; el 2 no crea cuentas; el 3 conserva todas las categorías (RF-M10-02, 03, 06). `skip-all` → terminado. | `STEP_MISMATCH` |

#### 4.10.3 Ciclo de vida y concurrencia
- **En paso N → N+1 → Terminado:** cada transición es `UPDATE … WHERE onboarding_step = N AND onboarding_completed_at IS NULL`. Así un doble envío o dos dispositivos no avanzan dos veces, y se retoma donde quedó en cualquier dispositivo (RF-M10-01).
- **Una vez Terminado:** la guarda `RequireOnboardingDone` nunca vuelve a mostrarlo, y los endpoints responden `ONBOARDING_DONE`.

#### 4.10.4 UI y estado
- **`/bienvenida`:** `<OnboardingStepper>` ("Paso N de 3", "Saltar paso", "Saltar todo") con tres pasos:
  - `<BaseCurrencyStep>`: muestra "Usaremos el dólar paralelo: Bs 10,25…", o "Aún no pudimos obtener el dólar…" si no hay tasa;
  - `<AccountsStep>`: fichas marcables con nombre y "saldo de hoy", y "+ Otra cuenta";
  - `<CategoriesStep>`: árbol con casillas, la del sistema bloqueada, y "+ Agregar".
- **Al terminar:** navega a `/` en el mes actual.
- **Borradores:** `useDraft('onboarding-step2')` y `useDraft('onboarding-step3')`.

---

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M4 - Cuentas]] · [[M9 - Ajustes y personalización]]

