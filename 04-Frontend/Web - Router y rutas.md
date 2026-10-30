---
tipo: "frontend"
fuente: "apps/web/src/app/router.tsx"
tags:
  - "frontend/router"
actualizado: "2026-10-30"
---

# Web · Router y rutas

Definido en `apps/web/src/app/router.tsx` con React Router ([[ADR-16 - Navegación con React Router]]). Cada pantalla se descarga solo al entrar (`lazy`), y algunas precargan sus datos mientras baja el código (RNF-29). Las guardas `RequireSession`, `RequireOnboardingDone` y `ReleaseGate` viven en `app/guards.tsx`.

## Jerarquía

```text
/ (RootLayout)
├─ PublicLayout → registro, entrar, revisa-tu-correo, confirmar, olvide-mi-contrasena, restablecer
└─ RequireSession (precalienta la sesión)
   ├─ bienvenida (Onboarding)   ·  onboarding → redirige a /bienvenida
   └─ RequireOnboardingDone
      ├─ AppShell → Inicio, movimientos, registrar, cuentas, mas, categorias, tipo-de-cambio, perfil, ajustes
      └─ ReleaseGate(M11/M12/M14/M13) → AppShell → presupuestos, metas, recurrentes, deudas
* → NotFoundPage
```

## Todas las rutas (35)

| Ruta | Feature | Pantalla | Precarga | Entrega |
|---|---|---|---|---|
| `/registro` | [[Web - auth\|auth]] | `SignUpForm` | — | V1.0 |
| `/entrar` | [[Web - auth\|auth]] | `SignInForm` | — | V1.0 |
| `/revisa-tu-correo` | [[Web - auth\|auth]] | `CheckEmail` | — | V1.0 |
| `/confirmar` | [[Web - auth\|auth]] | `ConfirmLink` | — | V1.0 |
| `/olvide-mi-contrasena` | [[Web - auth\|auth]] | `ForgotPasswordForm` | — | V1.0 |
| `/restablecer` | [[Web - auth\|auth]] | `ResetPasswordForm` | — | V1.0 |
| `/bienvenida` | [[Web - onboarding\|onboarding]] | `OnboardingPage` | — | V1.0 |
| `/` | [[Web - dashboard\|dashboard]] | `DashboardPage` | — | V1.0 |
| `/movimientos` | [[Web - transactions\|transactions]] | `TransactionsPage` | ✅ | V1.0 |
| `/movimientos/:id` | [[Web - transactions\|transactions]] | `TransactionDetailPage` | — | V1.0 |
| `/registrar` | [[Web - register\|register]] | `RegisterPage` | — | V1.0 |
| `/cuentas` | [[Web - accounts\|accounts]] | `AccountsPage` | ✅ | V1.0 |
| `/cuentas/nueva` | [[Web - accounts\|accounts]] | `NewAccountPage` | — | V1.0 |
| `/cuentas/:id` | [[Web - accounts\|accounts]] | `AccountDetailPage` | — | V1.0 |
| `/cuentas/:id/editar` | [[Web - accounts\|accounts]] | `EditAccountPage` | — | V1.0 |
| `/categorias` | [[Web - categories\|categories]] | `CategoriesPage` | ✅ | V1.0 |
| `/categorias/nueva` | [[Web - categories\|categories]] | `CategoryFormPage` | — | V1.0 |
| `/categorias/archivadas` | [[Web - categories\|categories]] | `ArchivedCategoriesPage` | — | V1.0 |
| `/categorias/:id/editar` | [[Web - categories\|categories]] | `CategoryFormPage` | — | V1.0 |
| `/presupuestos` | [[Web - budgets\|budgets]] | `BudgetsPage` | ✅ | M11 |
| `/presupuestos/:id` | [[Web - budgets\|budgets]] | `BudgetDetailPage` | — | M11 |
| `/metas` | [[Web - goals\|goals]] | `GoalsPage` | ✅ | M12 |
| `/metas/:id` | [[Web - goals\|goals]] | `GoalDetailPage` | — | M12 |
| `/recurrentes` | [[Web - recurring\|recurring]] | `RecurringPage` | ✅ | M14 |
| `/deudas` | [[Web - debts\|debts]] | `DebtsPage` | ✅ | M13 |
| `/deudas/:id` | [[Web - debts\|debts]] | `DebtDetailPage` | — | M13 |
| `/tipo-de-cambio` | [[Web - fx\|fx]] | `ExchangeRatePage` | — | V1.0 |
| `/perfil` | [[Web - profile\|profile]] | `ProfilePage` | — | V1.0 |
| `/perfil/eliminar` | [[Web - profile\|profile]] | `DeleteAccountPage` | — | V1.0 |
| `/ajustes` | [[Web - settings\|settings]] | `SettingsHub` | — | V1.0 |
| `/ajustes/general` | [[Web - settings\|settings]] | `GeneralSettings` | — | V1.0 |
| `/ajustes/monedas` | [[Web - settings\|settings]] | `CurrencySettings` | — | V1.0 |
| `/ajustes/registrar` | [[Web - settings\|settings]] | `RegisterSettings` | — | V1.0 |
| `/ajustes/inicio` | [[Web - settings\|settings]] | `BlocksOrderList` | — | V1.0 |
| `/ajustes/recordatorios` | [[Web - settings\|settings]] | `PreferencesList` | — | V1.0 |

Además: `/mas` (`MoreMenu`) y `/ajustes/recordatorios` detrás de `PreferencesGate` (solo V1.2, RF-M15-07).

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]]
- **Requerimientos no funcionales:** [[Spec 3.11 Rendimiento de cada pestaña]]

