---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 5.5 Matriz de trazabilidad (spec → plan)"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 5. Matriz de Verificación y Estrategia de Testing]] · ← [[Plan 5.4 Definición de terminado de cada módulo]]

### 5.5 Matriz de trazabilidad (spec → plan)

Cada regla, requerimiento, caso borde y RNF de `spec.md` v1.5 con la sección del plan que lo resuelve.

| ID | Dónde se resuelve |
|---|---|
| RN-01 | ADR-04 + 4.4 — saldo = inicial + Σ asientos |
| RN-02 | 4.4, 4.6, 4.8, 4.11 |
| RN-03 | 4.6.1 — la moneda del asiento es la de la cuenta |
| RN-04 | 4.3.1 `resolveUsdRate` + columnas `rate_*` (3.5) |
| RN-05 | 4.4.2 (saldos con la tasa vigente) / 4.8.2 (ingresos y gastos con la tasa guardada) |
| RN-06 | 1.3 |
| RN-07 | 3.1, 4.0, 4.6 |
| RN-08 | 3.8 |
| RN-09 | 3.9 |
| RN-10 | 1.3, 3.7, 4.15 |
| RN-11 | 4.5 |
| RN-12 | 4.4, 5.2 |
| RN-13 | 3.1 / schemas con `trim` + `CHECK (name = btrim(name))` |
| RF-M1-01 | 4.1.1 — `SignUpInput` |
| RF-M1-02 | 4.1 |
| RF-M1-03 | 4.1 |
| RF-M1-04 | 4.1.2 sign-in — sin sesión hasta confirmar |
| RF-M1-05 | 4.1 |
| RF-M1-06 | 3.3, 4.1 |
| RF-M1-07 | 3.3, 4.0 |
| RF-M1-08 | 4.1 |
| RF-M1-09 | 4.1 |
| RF-M1-10 | 4.1 |
| RF-M1-11 | 4.1 |
| RF-M1-12 | 4.1 |
| RF-M1-13 | 4.1.1 — `UpdateMeInput` no acepta el correo |
| RF-M1-14 | 4.1.2 — `GET /api/me/export` |
| RF-M1-15 | 3.1, 4.1 |
| RF-M1-16 | 3.2 — enum `email_kind` |
| RF-M1-17 | 4.1 |
| RF-M1-18 | 4.1.2 confirmation/status, 4.1.4 — confirmación desde otro dispositivo |
| EC-M1-01 | 4.1 |
| EC-M1-02 | 4.1 |
| EC-M1-03 | 4.1.3 — el descarte borra la fila y libera el correo; el nuevo registro se trata como nuevo |
| EC-M1-04 | 5.2 |
| EC-M1-05 | 4.1 |
| EC-M1-06 | 4.1 |
| EC-M1-07 | 4.1 |
| EC-M1-08 | 4.1.2 — `INVALID_PASSWORD` / `CONFIRMATION_MISMATCH` |
| EC-M1-09 | 4.1.2 sign-up — reemplaza nombre y contraseña, `registered_at = now()`, enlace nuevo |
| EC-M1-10 | 4.1 |
| EC-M1-11 | 4.1.2 confirmation/status — cierra la sesión del otro usuario en el navegador |
| EC-M1-12 | 4.1.3 — espera por HMAC de cualquier correo |
| EC-M1-13 | 4.1.2, 4.1.4 — confirmation/status y ConfirmLink |
| EC-M1-14 | 4.1.2 — un `signup_ticket` por usuario; la recuperación lo borra |
| RF-M2-01 | 4.2.3 / 4.2.4 — BottomTabBar y Sidebar por ancho |
| RF-M2-02 | 4.2.4 — "Más" solo en BottomTabBar |
| RF-M2-03 | 1.3, 4.2 |
| RF-M2-04 | 1.3, 4.2 |
| RF-M2-05 | 4.2 |
| RF-M2-06 | 1.3, 4.2 |
| RF-M2-07 | 4.0, 4.2 |
| RF-M2-08 | 4.0 |
| RF-M2-09 | 4.2 |
| RF-M2-10 | 1.3, 4.2 |
| RF-M2-11 | 4.2 |
| RF-M2-12 | 4.2 |
| RF-M2-13 | 4.2.4 — Volver |
| RF-M2-14 | 4.2.4 — Marca |
| EC-M2-01 | 4.2 |
| EC-M2-02 | 1.3, 4.2 |
| EC-M2-03 | 4.2 |
| EC-M2-04 | 4.2.4 — Volver |
| RF-M3-01 | 3.4 |
| RF-M3-02 | 4.3 |
| RF-M3-03 | ADR-06 + 4.3.1 `resolveUsdRate` (manual primero) |
| RF-M3-04 | 4.3.2 — jobs `fx.*` y actualización al abrir |
| RF-M3-05 | 4.3 |
| RF-M3-06 | 4.3 |
| RF-M3-07 | 4.3, 4.14 |
| RF-M3-08 | 4.6 |
| RF-M3-09 | 4.6 |
| RF-M3-10 | 4.6 |
| RF-M3-11 | 4.3 |
| RF-M3-12 | 4.3 |
| RF-M3-13 | 3.4, 4.3 |
| EC-M3-01 | 4.3 |
| EC-M3-02 | 4.3 |
| EC-M3-03 | 4.3.1 — cadena de respaldo de `resolveUsdRate` |
| EC-M3-04 | 4.3 |
| EC-M3-05 | 4.3.2 — `CURRENCY_IN_USE {usedBy}` |
| EC-M3-06 | 4.3.1 — `transferPrefill` prioriza el valor manual |
| EC-M3-07 | 4.3.2 — `RATE_BELOW_MINIMUM` |
| RF-M4-01 | 4.10 |
| RF-M4-02 | 4.4, 4.10 |
| RF-M4-03 | 4.4 |
| RF-M4-04 | 4.4, 5.4 |
| RF-M4-05 | 4.4.2 adjust |
| RF-M4-06 | 4.4.2 PATCH — `CURRENCY_LOCKED` |
| RF-M4-07 | 3.5, 4.4 |
| RF-M4-08 | 4.4.4 — AccountHeader de tarjeta |
| RF-M4-09 | 4.4.2 — solo las activas en los selectores y totales; historia por RN-11 |
| RF-M4-10 | 4.4 |
| RF-M4-11 | 4.4.2 — `PUT /api/accounts/order` |
| RF-M4-12 | 4.7.3 — RF-M7-03 |
| RF-M4-13 | 3.8, 4.4 |
| EC-M4-01 | 4.4, 4.6 |
| EC-M4-02 | 4.4.2 — `IMMUTABLE_FIELD` + trigger `account_initial_immutable` |
| EC-M4-03 | 4.14 |
| EC-M4-04 | 4.4.2 restore — `NAME_TAKEN` |
| EC-M4-05 | 4.4 |
| EC-M4-06 | 4.4 |
| EC-M4-07 | 4.4.2 restore — `CURRENCY_INACTIVE` |
| EC-M4-08 | 4.4 |
| RF-M5-01 | 4.5 |
| RF-M5-02 | 3.5 — índice `category_active_name` |
| RF-M5-03 | 4.5.3 — totales con la jerarquía actual |
| RF-M5-04 | 4.5 |
| RF-M5-05 | 4.5 |
| RF-M5-06 | 4.7.2 — la grilla excluye las archivadas |
| RF-M5-07 | 4.5, 4.11 |
| RF-M5-08 | 4.5 |
| RF-M5-09 | 4.5 |
| EC-M5-01 | 3.5 — índice `category_active_name` → `NAME_TAKEN` |
| EC-M5-02 | 4.5.2 merge — `MERGE_INVALID` |
| EC-M5-03 | 4.5 |
| EC-M5-04 | 4.5.2 restore — `NAME_TAKEN` |
| EC-M5-05 | 4.5 |
| EC-M5-06 | 4.5.2 restore — `PARENT_ARCHIVED` |
| EC-M5-07 | 4.5.2 DELETE — `CATEGORY_IN_USE` |
| RF-M6-01 | 4.6 |
| RF-M6-02 | 4.6.2 — orden `(date, created_at)` |
| RF-M6-03 | 4.6 |
| RF-M6-04 | 4.6 |
| RF-M6-05 | 3.8, 4.6 |
| RF-M6-06 | 4.6 |
| RF-M6-07 | 4.6 |
| RF-M6-08 | 4.6.2 — PATCH, DELETE y undo con `BalanceGuard` |
| RF-M6-09 | 4.6 |
| RF-M6-10 | 4.6 |
| RF-M6-11 | 4.6 |
| RF-M6-12 | 4.6 |
| RF-M6-13 | 4.6 |
| RF-M6-14 | 4.6 |
| EC-M6-01 | 4.6 |
| EC-M6-02 | 4.6 |
| EC-M6-03 | 4.6 |
| EC-M6-04 | 4.6.2 PATCH — conserva la tasa guardada |
| EC-M6-05 | 4.6 |
| EC-M6-06 | 4.6 |
| EC-M6-07 | 4.6.2 PATCH — `AMOUNT_OUT_OF_RANGE` |
| EC-M6-08 | 4.6 |
| RF-M7-01 | 4.2.4 — pestaña Registrar |
| RF-M7-02 | 4.7 |
| RF-M7-03 | 4.7 |
| RF-M7-04 | 4.7 |
| RF-M7-05 | 4.7.4 — DateChips |
| RF-M7-06 | 4.7 |
| RF-M7-07 | 4.7 |
| RF-M7-08 | 4.2.3 — `useDraft` |
| RF-M7-09 | 4.7 |
| RF-M7-10 | 4.7.2 — shortcuts |
| RF-M7-11 | 4.7.4 — AccountChip |
| RF-M7-12 | 4.7 |
| RF-M7-13 | 4.7.4 — `always_show_note` |
| RF-M7-14 | 4.7, 4.12 |
| EC-M7-01 | 4.7 |
| EC-M7-02 | 4.4, 4.7 |
| EC-M7-03 | 4.7 |
| EC-M7-04 | 4.7 |
| EC-M7-05 | 4.7 |
| EC-M7-06 | 4.7 |
| EC-M7-07 | 4.7.4 — grilla vacía con "Crear categoría" |
| EC-M7-08 | 4.2.3 — `useDraft.validateRefs` |
| RF-M8-01 | 4.8 |
| RF-M8-02 | 4.8 |
| RF-M8-03 | 4.8 |
| RF-M8-04 | 4.8.1 — `comparisonWindow` / `pctChange` |
| RF-M8-05 | 4.8.1 — `byCategory` |
| RF-M8-06 | 4.8 |
| RF-M8-07 | 4.8 |
| RF-M8-08 | 4.8 |
| RF-M8-09 | 4.8 |
| RF-M8-10 | 4.8 |
| RF-M8-11 | 4.8 |
| EC-M8-01 | 4.8 |
| EC-M8-02 | 4.8 |
| EC-M8-03 | 4.8 |
| EC-M8-04 | 4.3, 4.8 |
| RF-M9-01 | 4.9 |
| RF-M9-02 | 4.9 |
| RF-M9-03 | 4.9 |
| RF-M9-04 | 4.9.1 — `relativeDay` / calendario |
| RF-M9-05 | 4.9 |
| RF-M9-06 | 4.11 — cada presupuesto con sus propios valores |
| EC-M9-01 | 4.9 |
| EC-M9-02 | 4.7.3 — `default_account_id` = NULL al archivar |
| RF-M10-01 | 4.10 |
| RF-M10-02 | 4.10 |
| RF-M10-03 | 4.10.2 skip — sin cuentas |
| RF-M10-04 | 4.10 |
| RF-M10-05 | 4.10 |
| RF-M10-06 | 4.10.2 skip — conserva las precargadas |
| EC-M10-01 | 4.10 |
| EC-M10-02 | 4.10 |
| EC-M10-03 | 4.7.4 / 4.10.2 — grilla y "Ver todas" vacíos con "Crear categoría" |
| RF-M11-01 | 4.11 |
| RF-M11-02 | 4.11 |
| RF-M11-03 | 4.11 |
| RF-M11-04 | 3.6 CHECK `start_day` 1–28 + 4.11.1 `periodFor` |
| RF-M11-05 | 4.11 |
| RF-M11-06 | 4.11 |
| RF-M11-07 | 4.11 |
| RF-M11-08 | 4.11 |
| RF-M11-09 | 4.11 |
| RF-M11-10 | 4.11.3 — job `budgets.defaultDecision` |
| RF-M11-11 | 4.11 |
| RF-M11-12 | 4.11 |
| RF-M11-13 | 4.11 |
| RF-M11-14 | 4.11.1 — el gasto no tiene tope; "Superado por X" |
| EC-M11-01 | 4.11.1 — `available` puede ser negativo; "Superado por X" |
| EC-M11-02 | 4.11 |
| EC-M11-03 | 4.11 |
| EC-M11-04 | 4.11 |
| EC-M11-05 | 4.11 |
| EC-M11-06 | 4.11 |
| EC-M11-07 | 4.11.1 — `periodFor` con `next_start_day` |
| EC-M11-08 | 4.11 |
| EC-M11-09 | 4.11.3 — `finalizing` → decisión sin "Arrastrar" |
| RF-M12-01 | 4.12 |
| RF-M12-02 | 1.3, 4.12 |
| RF-M12-03 | 3.6 `dedicated_account_id UNIQUE` + 4.12.2 dedicate |
| RF-M12-04 | 4.12.2 earmarks — ≤ saldo libre |
| RF-M12-05 | 4.12 |
| RF-M12-06 | 4.12 |
| RF-M12-07 | 4.12 |
| RF-M12-08 | 4.12 |
| RF-M12-09 | 4.12 |
| EC-M12-01 | 4.12 |
| EC-M12-02 | 4.4.2 — `ACCOUNT_HAS_EARMARKS {goals}` |
| EC-M12-03 | 1.3, 4.12 |
| EC-M12-04 | 4.12 |
| EC-M12-05 | 4.12, 4.14 |
| EC-M12-06 | 4.12 |
| EC-M12-07 | 4.12 |
| EC-M12-08 | 4.12.2 — `ACCOUNT_NOT_DEDICABLE` |
| RF-M13-01 | 4.13.1 — `CreateDebtInput` |
| RF-M13-02 | 4.13.1 `dailyRate` / `accrue` + ADR-14 |
| RF-M13-03 | 4.13.2 PATCH — no acepta tasa ni período |
| RF-M13-04 | 1.3, 4.13 |
| RF-M13-05 | 4.13 |
| RF-M13-06 | 4.13 |
| RF-M13-07 | 4.13 |
| RF-M13-08 | 4.13.3 — interés en "Intereses"; capital y movimiento inicial sin contar (RN-02) |
| RF-M13-09 | 4.13.1 — `PaymentInput.account.declaredRate` |
| RF-M13-10 | 4.13 |
| RF-M13-11 | 4.13 |
| RF-M13-12 | 4.13 |
| RF-M13-13 | 4.13 |
| RF-M13-14 | 4.13 |
| EC-M13-01 | 4.13 |
| EC-M13-02 | 4.13 |
| EC-M13-03 | 4.13 |
| EC-M13-04 | 4.13 |
| EC-M13-05 | 4.13.2 — `NOT_LAST_PAYMENT` |
| EC-M13-06 | 4.13 |
| EC-M13-07 | 4.13.3 — eliminar el último pago devuelve la deuda a activa |
| EC-M13-08 | 4.13 |
| RF-M14-01 | 4.14.1 — `frequency` |
| RF-M14-02 | 4.14 |
| RF-M14-03 | 4.14 |
| RF-M14-04 | 4.14 |
| RF-M14-05 | 4.14 |
| RF-M14-06 | 4.14 |
| RF-M14-07 | 4.14 |
| RF-M14-08 | 4.14.2 confirm |
| RF-M14-09 | 4.14.2 resume |
| RF-M14-10 | 4.14 |
| RF-M14-11 | 3.8, 4.14 |
| RF-M14-12 | 1.3, 3.6, 4.14 |
| RF-M14-13 | 4.14 |
| RF-M14-14 | 4.14 |
| RF-M14-15 | 3.6 — `recurring_rule.name` |
| EC-M14-01 | 4.14 |
| EC-M14-02 | 4.14 |
| EC-M14-03 | 4.14 |
| EC-M14-04 | 4.14 |
| EC-M14-05 | 4.14 |
| EC-M14-06 | 4.14 |
| EC-M14-07 | 4.14 |
| RF-M15-01 | 4.15 — solo la bandeja; sin correo de avisos ni push |
| RF-M15-02 | 4.15 |
| RF-M15-03 | 4.15 |
| RF-M15-04 | 4.12, 4.15 |
| RF-M15-05 | 4.15 |
| RF-M15-06 | 4.15 |
| RF-M15-07 | 4.15 |
| RF-M15-08 | 4.15.1 — no existe ese tipo de aviso |
| RF-M15-09 | 4.15 |
| RF-M15-10 | 4.15 |
| RF-M15-11 | 4.15 |
| RF-M15-12 | 4.15 |
| EC-M15-01 | 4.14 |
| EC-M15-02 | 4.15 |
| EC-M15-03 | 4.15 |
| RNF-01 | 1.2, 4.7, 5.1, 5.3 |
| RNF-02 | 1.2, 4.7, 5.1, 5.3 |
| RNF-03 | 4.8, 5.1, 5.3 |
| RNF-04 | 4.3, 5.3 |
| RNF-05 | 5.3 |
| RNF-06 | 4.15, 5.3 |
| RNF-07 | 5.3 |
| RNF-08 | 5.3 |
| RNF-09 | 4.6, 5.3 |
| RNF-10 | 1.1, 4.4, 4.6, 5.3 |
| RNF-11 | 1.3, 4.6, 5.3 |
| RNF-12 | 3.7, 4.11, 5.3 |
| RNF-13 | 1.3, 5.3 |
| RNF-14 | 3.9, 5.3 |
| RNF-15 | 5.3 |
| RNF-16 | 3.1, 5.3 |
| RNF-17 | 5.3 |
| RNF-18 | 1.3, 5.3 |
| RNF-19 | 1.1, 5.3 |
| RNF-20 | 4.0, 5.3 |
| RNF-21 | 5.3 |
| RNF-22 | 5.3 |
| RNF-23 | 5.3 |
| RNF-24 | 3.9, 5.3 |
| RNF-25 | 3.9, 5.3 |
| RNF-26 | 3.9, 5.3 |
| RNF-27 | 1.3, 4.3, 5.3 |
| RNF-28 | 4.0, 5.3 |
| RNF-29 | 4.0, 5.3 |

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Decisiones (ADR):** [[ADR-04 - Libro contable de doble asiento]] · [[ADR-06 - Fuentes de tasas de cambio]] · [[ADR-14 - Interés de deudas como foto]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]] · [[Spec 3.10 Límites por usuario]] · [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.2 Compatibilidad y accesibilidad]] · [[Spec 3.3 Concurrencia]] · [[Spec 3.4 Idempotencia]] · [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.6 Exactitud monetaria]] · [[Spec 3.7 Tiempo]] · [[Spec 3.8 Disponibilidad y tolerancia a fallos]] · [[Spec 3.9 Auditoría y retención]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - SignupTicket]]

