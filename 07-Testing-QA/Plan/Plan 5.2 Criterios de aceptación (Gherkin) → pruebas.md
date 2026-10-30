---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 5.2 Criterios de aceptación (Gherkin) → pruebas"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 5. Matriz de Verificación y Estrategia de Testing]] · ← [[Plan 5.1 Estrategia]] · → [[Plan 5.3 Requerimientos no funcionales → verificación]]

### 5.2 Criterios de aceptación (Gherkin) → pruebas

| Módulo | Escenario de la spec | Tipo | Verificación clave |
|---|---|---|---|
| M1 | Registro con correo ya existente no revela la cuenta | Integración + E2E | `202` idéntico; `register_attempt` en la bandeja de salida; sigue habiendo 1 `auth_user`; correo normalizado con espacios y mayúsculas |
| M1 | Usuario sin confirmar no accede | Integración | `EMAIL_NOT_CONFIRMED 403`; ninguna fila en `auth_session` |
| M1 | Espera progresiva tras intentos fallidos | Integración (reloj) | 5 fallos → `LOGIN_LOCKED` con `retryAfterSeconds` ≈ 60; contraseña correcta rechazada durante la espera (EC-M1-04); ningún correo de aviso en la bandeja de salida |
| M1 | La pestaña de registro continúa sola al confirmar el correo | Integración + E2E (dos contextos de navegador) | `confirm` no crea sesión; `confirmation/status` pasa de `pending` a `confirmed` con la sesión; la pestaña de `/revisa-tu-correo` llega sola a `/bienvenida` aunque el enlace se abra en otro contexto, que queda sin sesión |
| M1 | Recuperar la contraseña cierra las demás sesiones | Integración | Quedan 1 sesión nueva y 0 anteriores; `password_changed` en la bandeja de salida |
| M1 | Eliminar la cuenta | Integración | 0 filas del usuario en todas las tablas; `account_deleted` enviado; las sesiones de B dan `SESSION_EXPIRED` |
| M2 | Registrar en el centro de la barra en el celular | E2E 360 px | Orden de las 5 pestañas, la tercera es Registrar |
| M2 | Sin "Más" en escritorio | E2E 1280 px | Barra lateral visible, sin el enlace "Más" |
| M2 | Bloqueo sin conexión conserva el borrador | E2E (`context.setOffline`) | Overlay visible; al reconectar, "35" sigue en el monto |
| M2 | Volver desde una pantalla interna | E2E 360 px y 1280 px | "Volver" en el detalle de una cuenta lleva a Cuentas con su posición; con enlace directo lleva a la pantalla padre (EC-M2-04); no aparece en las raíces |
| M2 | El logo acompaña a la app | E2E + axe | El `<link rel="icon">` apunta a un archivo que responde 200; el logo con texto alternativo está en las pantallas de acceso y en la cabecera |
| M3 | La historia no se reescribe al cambiar la base | Integración + dominio | El gasto vale Bs 100,00 antes y después de pasar a USD y volver |
| M3 | Tasa precargada según la dirección | Dominio + E2E | Precarga 10,30 (venta); llega $ 97,09 |
| M3 | Valor manual con prioridad | Integración | Totales con 10,00 aunque el paralelo esté en 10,40; el panel muestra el aviso |
| M3 | Sin ninguna tasa disponible | Integración + E2E | `RATE_REQUIRED` → se reenvía con `manualUsdRate` → tasa del gasto + manual activo |
| M4 | Movimiento anterior al saldo inicial no altera el saldo | Integración | Saldo 500,00; `beforeInitialBalance: true`; cuenta en el gasto del mes (RN-12) |
| M4 | Bloqueo de negativo en efectivo | Integración + concurrencia | `NEGATIVE_BALANCE {resultingBalance: "-5.00"}`; nada guardado; dos gastos simultáneos de 20 sobre 30 → uno falla |
| M4 | Ajuste de saldo | Integración | Ajuste +50,00; ingresos del mes sin cambios |
| M4 | Pago de tarjeta no es gasto | Integración | La tarjeta muestra "Debes 0,00"; gastos del mes sin cambios |
| M5 | Archivar una categoría con presupuesto y recurrente | Integración | Presupuesto `finalizing` → `finalized` al cierre; regla `paused` + aviso |
| M5 | Fusionar duplicados | Integración | 52 movimientos en B; A eliminada; repetir → `CATEGORY_NOT_FOUND` |
| M5 | Categoría del sistema protegida | Integración + trigger | `SYSTEM_CATEGORY`; un UPDATE directo por SQL también falla |
| M6 | Eliminar y deshacer | Integración + E2E | Saldo +35 al instante; `undo` en menos de 10 s lo restaura; `undo` a los 13 s → `UNDO_EXPIRED` |
| M6 | Transferencia con comisión | Integración | Banco −505, Efectivo +500, gasto de 5 en Comisiones; no cuenta como ingreso ni gasto |
| M6 | Doble toque no duplica | Integración + E2E | Dos POST con el mismo id → 1 fila; respuestas 201 y 200 |
| M6 | Vinculado solo se edita en su origen | Integración + E2E | `LINKED_FIELD_LOCKED`; la UI muestra "Ir a la deuda" |
| M7 | Registro rápido en menos de 10 segundos | E2E + rendimiento | Flujo completo < 10 s con 4G simulado; el Inicio refleja el gasto |
| M7 | Borrador al cambiar de pestaña | E2E | "120" sigue después de ir a Cuentas y volver |
| M7 | Atajo rellena sin guardar | E2E | Formulario completo; 0 POST hasta tocar Guardar |
| M7 | El borrador conserva su tipo | E2E | Se restaura el ingreso de "500" |
| M7 | Deshacer después de guardar | Integración + E2E | El `undo` de una creación deja la transacción eliminada |
| M8 | Préstamos no inflan los ingresos | Integración | Ingresos sin los 5.000; el saldo de la cuenta los incluye |
| M8 | Comparación por el mismo tramo | Dominio + integración (reloj 15/10) | "+20 %" en rojo |
| M8 | Tasa de ahorro oculta | Dominio | `savingsRatePct: null` |
| M9 | Ajustes sincronizados | E2E (dos contextos) | Tema oscuro en el segundo navegador |
| M9 | Formato de números | Dominio | `parseAmountInput("35.50")` = 35,50 con los dos formatos |
| M9 | Punto decimal con el formato por defecto | Dominio + E2E | 35,50 |
| M10 | Saltar todo | Integración + E2E | Base BOB, 0 cuentas, categorías completas, invitación a crear una cuenta |
| M10 | Retomar en otro dispositivo | Integración + E2E | Paso 1 en A → B abre en el paso 2 |
| M11 | Repartir un sobrante | Integración | Noviembre con disponible 850,00; apartado de 100,00 en el Banco |
| M11 | Exceso arrastrado | Integración | Disponible del siguiente = 200,00 |
| M11 | Decisión por defecto | Integración (reloj +7 d) | `defaulted`; sin arrastre |
| M11 | Umbral avisa una sola vez | Integración | Un solo aviso del 80 % aunque se cruce de nuevo |
| M12 | Progreso combinado | Dominio + integración | 1.200,00 |
| M12 | Gasto que toca dinero apartado | Integración + E2E | `EARMARK_CONFIRMATION_REQUIRED {shortfall: 100}` → confirmar → apartados del Banco = 200,00 |
| M12 | Usar y cerrar | Integración | Apartados en 0; meta archivada con su historia |
| M12 | Salida de la cuenta dedicada sin confirmación | Integración + E2E | Se guarda sin 409; aviso visible; el progreso baja |
| M13 | Interés sobre el capital pendiente | Dominio + integración (reloj) | El acumulado antes del pago no cambia; después se acumula sobre 1.000,00 |
| M13 | Desglose precargado | Dominio + integración | 42,30 / 457,70; 42,30 en "Intereses" como gasto |
| M13 | Condonar | Integración | `forgiven`; 0 transacciones nuevas |
| M14 | Automático bloqueado pasa a pendiente | Integración (job) | Sin transacción; ocurrencia `pending` |
| M14 | Pendiente vence | Integración (reloj +30 d) | `omitted` + aviso |
| M14 | Reanudar con ocurrencias saltadas | Dominio + integración | `skipped` devuelve 3 fechas |
| M15 | Aviso de vencimiento de deuda | Integración (reloj 17/10 08:00) | "Vence en 3 días: debes Bs 1.200,00 a Juan" |
| M15 | Decisión visible con el aviso desactivado | Integración | Ninguna fila en `notification`; el pendiente aparece en `/api/recurring` |
| M15 | Sin duplicados | Integración | El hito del 50 % no se repite al oscilar el tipo de cambio |

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M12 - Metas de ahorro]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M4 - Cuentas]] · [[M5 - Categorías]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - AuthSession]] · [[Entidad - AuthUser]] · [[Entidad - Notification]]

