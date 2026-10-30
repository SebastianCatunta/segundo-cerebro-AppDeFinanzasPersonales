---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.7 M7 - Registrar (pestaña) (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M7"
modulo: "M7"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.6 M6 - Transacciones (V1.0)]] · → [[Spec 2.8 M8 - Inicio (dashboard) (V1.0)]]

### 2.7 M7 — Registrar (pestaña) (V1.0)

#### 2.7.1 Flujos de usuario
**Registrar un gasto (flujo de menos de 10 segundos)**
1. El usuario toca la pestaña Registrar. Viene seleccionado Gasto y el cursor está en el monto, con teclado numérico.
2. Escribe el monto. La cuenta y la fecha ("Hoy") ya están preseleccionadas.
3. Toca una de las 8 categorías de la grilla.
4. Toca "Guardar".
5. Aparece "Gasto de Bs 35,00 guardado · Deshacer" durante 10 segundos. El formulario se limpia, la app se queda en Registrar lista para el siguiente, y debajo se ven los últimos 3 movimientos creados hoy, sea cual sea su fecha.

**Usar un atajo**
1. El usuario toca la ficha de un atajo (por ejemplo, "Almuerzo") y el formulario se rellena.
2. Revisa (si el atajo no tiene monto, el cursor queda en el monto) y toca "Guardar".

**Segundo nivel:** desde el mismo formulario, el usuario agrega una nota, elige otra fecha u otra cuenta, agrega una comisión (en transferencias) o toca "Guardar como atajo".

**Transferencia**
1. El usuario cambia el selector a Transferencia y elige el origen y el destino (viene el último par usado).
2. Ingresa el monto. Si las monedas difieren, ajusta el tipo de cambio usado o el monto que llega (M3).

#### 2.7.2 Ciclo de vida y estados

**Formulario**

| Estado | Qué significa |
|---|---|
| Vacío | Recién abierto o limpio |
| Con borrador | Hay datos escritos. Se conservan al cambiar de pestaña, al vencer la sesión o al quedar bloqueado sin conexión |
| Listo | Cumple los requisitos para guardar |
| Guardado | Se limpia y vuelve a Vacío |

- El borrador se descarta con "Limpiar", al cerrar la app o la sesión, o si entra otro usuario.

**Atajo:** Visible ↔ Oculto (su cuenta o categoría está archivada) → Eliminado (por el usuario, o al eliminarse su cuenta).

#### 2.7.3 Requerimientos funcionales
- **RF-M7-01:** Registrar DEBE ser una pestaña normal: centro de la barra inferior en celular, entrada de la barra lateral en escritorio.
- **RF-M7-02:** Al entrar con el formulario vacío, el tipo DEBE ser Gasto y el foco DEBE estar en el monto. Si hay un borrador, se restaura tal cual, con su tipo. El monto acepta solo números y un separador decimal: un punto o una coma seguidos de 1 o 2 dígitos al final se toman como decimal, sea cual sea el formato elegido. No acepta separador de miles ni operaciones.
- **RF-M7-03:** La cuenta preseleccionada DEBE ser la cuenta por defecto de Ajustes (una sola, para gastos e ingresos), si existe. Si no, la última usada para ese tipo que siga activa; si no hay, la primera cuenta activa según el orden del usuario. En transferencias, el último par origen-destino, si ambas siguen activas. La cuenta por defecto puede ser una cuenta dedicada a una meta (RF-M7-14).
- **RF-M7-04:** La grilla DEBE mostrar 8 categorías del tipo actual:
  - primero, las favoritas fijadas en Ajustes (como máximo 8), en su orden;
  - después, las más usadas de los últimos 60 días, mezclando padres y subcategorías. Usar una subcategoría no suma uso a su padre. Los empates se resuelven por el uso más reciente;
  - si faltan, se completa con las precargadas en su orden (un usuario nuevo ve las primeras precargadas);
  - nunca aparecen categorías archivadas.

  "Ver todas" abre la lista completa con los padres desplegables.
- **RF-M7-05:** La fecha DEBE ofrecer las fichas "Hoy" (marcada), "Ayer" y "Calendario", sin fechas futuras.
- **RF-M7-06:** "Guardar" DEBE habilitarse con monto mayor que 0 y categoría (gasto o ingreso), o con origen y destino distintos (transferencia).
- **RF-M7-07:** Al guardar, el sistema DEBE limpiar el formulario y permanecer en Registrar. Debe mostrar "Deshacer" durante 10 segundos, que elimina el movimiento recién creado con las mismas validaciones que una eliminación y sigue disponible al cambiar de pestaña hasta cumplir los 10 segundos. Debe mostrar también los últimos 3 movimientos creados hoy, sea cual sea su fecha.
- **RF-M7-08:** El borrador DEBE conservarse según RF-M2-10, también tras volver a iniciar sesión el mismo usuario.
- **RF-M7-09:** Los atajos DEBEN guardar nombre (de 1 a 30 caracteres), tipo (gasto, ingreso o transferencia), monto (opcional), cuenta (o par origen-destino en una transferencia), categoría (salvo en una transferencia) y nota. Son como máximo 12 en total, contando los ocultos, y aparecen como fichas del tipo correspondiente. Al tocarlos rellenan el formulario y no guardan directamente.
- **RF-M7-10:** Los atajos se crean con "Guardar como atajo" y se editan, reordenan y eliminan en Ajustes › Registrar.
- **RF-M7-11:** La ficha de cuenta DEBE mostrar el saldo libre de la cuenta. En una tarjeta, muestra el crédito disponible (si tiene límite) o la deuda.
- **RF-M7-12:** En escritorio, el formulario DEBE poder usarse completo con Tab y Enter. No hay atajos de teclado propios.
- **RF-M7-13:** El ajuste "Mostrar la nota siempre" DEBE poner la nota en el primer nivel.
- **RF-M7-14:** Al registrar una salida de una cuenta dedicada a una meta, DEBE mostrarse el aviso no bloqueante "Esto resta a tu meta X" (M12).

#### 2.7.4 Casos borde y excepciones
- **EC-M7-01:** No hay cuentas. Registrar muestra "Crea tu primera cuenta" con un formulario mínimo (nombre, tipo, moneda, saldo) en la misma pantalla.
- **EC-M7-02:** El gasto dejaría el efectivo en negativo. Se muestra el error en la pantalla y el formulario no se limpia.
- **EC-M7-03:** El gasto usa dinero apartado para metas. Aparece la confirmación de M12. Si se cancela, el formulario queda intacto.
- **EC-M7-04:** No hay ninguna tasa y la cuenta está en dólares. Se pide el valor en ese momento (EC-M3-02).
- **EC-M7-05:** La cuenta por defecto se archiva. El ajuste se limpia y se aplica RF-M7-03.
- **EC-M7-06:** Ya existen 12 atajos. "Guardar como atajo" informa el límite y ofrece gestionar los atajos.
- **EC-M7-07:** No hay categorías del tipo elegido (gasto o ingreso). "Ver todas" aparece vacío con la acción "Crear categoría".
- **EC-M7-08:** El borrador apunta a una cuenta archivada desde otro dispositivo. El campo de cuenta se vacía y se marca para elegir otra (RF-M2-11).

#### 2.7.5 Criterios de aceptación
```gherkin
Escenario: Registro rápido en menos de 10 segundos
  Dado un usuario con la cuenta Efectivo como última usada
  Cuando toca Registrar, escribe "35", toca "Supermercado" y toca "Guardar"
  Entonces el gasto queda registrado en Efectivo con fecha de hoy
  Y el formulario queda vacío en la pestaña Registrar
  Y el Inicio refleja el gasto

Escenario: Borrador al cambiar de pestaña
  Dado que el usuario escribió "120" en Registrar
  Cuando va a Cuentas y vuelve a Registrar
  Entonces encuentra "120" en el monto

Escenario: Atajo rellena sin guardar
  Dado el atajo "Almuerzo, Bs 35, Efectivo, Restaurantes"
  Cuando el usuario lo toca
  Entonces el formulario queda completo
  Y el movimiento no se guarda hasta tocar "Guardar"

Escenario: El borrador conserva su tipo
  Dado que el usuario dejó un ingreso de "500" a medio escribir en Registrar
  Cuando va a Cuentas y vuelve a Registrar
  Entonces encuentra el ingreso de "500", no un gasto vacío

Escenario: Deshacer después de guardar
  Dado que el usuario guardó un gasto de Bs 35,00
  Cuando toca "Deshacer" dentro de los 10 segundos
  Entonces el gasto se elimina y el saldo se restablece
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M12 - Metas de ahorro]] · [[M2 - Navegación y estructura]] · [[M3 - Monedas y tipo de cambio]] · [[M6 - Transacciones]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]]

