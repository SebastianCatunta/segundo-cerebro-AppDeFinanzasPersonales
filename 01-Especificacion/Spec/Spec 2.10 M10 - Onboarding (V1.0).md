---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.10 M10 - Onboarding (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M10"
modulo: "M10"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.9 M9 - Ajustes y personalización (V1.0)]] · → [[Spec 2.11 M11 - Presupuestos (V1.1)]]

### 2.10 M10 — Onboarding (V1.0)

#### 2.10.1 Flujos de usuario
1. Tras confirmar su correo, el usuario entra al Onboarding: 3 pasos con el indicador "Paso N de 3", "Saltar paso" y "Saltar todo".
2. **Paso 1, moneda base:**
   - elige su moneda base (BOB por defecto). La app informa que siempre trabajará con BOB y USD;
   - la app informa "Usaremos el dólar paralelo: Bs 10,25 (puedes cambiarlo en Ajustes)". Si no hay ninguna tasa, informa "Aún no pudimos obtener el dólar; te lo pediremos al registrar algo en dólares".
3. **Paso 2, cuentas:**
   - fichas marcables: "Efectivo (Bs)" ✓, "Banco (Bs)" ✓ y "Dólares en efectivo ($)" sin marcar;
   - cada una tiene un nombre editable y el campo "saldo de hoy" (0 por defecto);
   - "+ Otra cuenta" abre un formulario corto.
4. **Paso 3, categorías:**
   - la lista precargada con casillas, todas marcadas;
   - desmarcar una categoría la quita, y desmarcar un padre quita sus subcategorías;
   - "+ Agregar" crea una categoría nueva.
5. Al terminar, el usuario llega al Inicio del mes actual.

#### 2.10.2 Ciclo de vida y estados

| Desde | Hacia | Disparador |
|---|---|---|
| — | En paso 1 | Primer acceso tras la confirmación |
| En paso N | En paso N+1 | Continuar o saltar el paso |
| En paso N | Terminado | Completar el paso 3 o "Saltar todo" |

- Prohibido: volver a mostrar el Onboarding una vez Terminado.

#### 2.10.3 Requerimientos funcionales
- **RF-M10-01:** El progreso DEBE guardarse en la cuenta en cada paso. Si se interrumpe, retoma en el paso pendiente, en cualquier dispositivo, sin repreguntar lo ya confirmado.
- **RF-M10-02:** Saltar el paso 1 DEBE dejar BOB como moneda base.
- **RF-M10-03:** Saltar el paso 2 NO DEBE crear ninguna cuenta.
- **RF-M10-04:** Los saldos del paso 2 DEBEN cumplir las reglas de saldo inicial (RF-M4-02), con fecha de hoy.
- **RF-M10-05:** En el paso 3, la categoría del sistema "Deudas y préstamos" NO DEBE poder desmarcarse.
- **RF-M10-06:** Saltar el paso 3 DEBE conservar todas las categorías precargadas.

#### 2.10.4 Casos borde y excepciones
- **EC-M10-01:** Se ingresa un saldo negativo para el efectivo. Se rechaza con la explicación.
- **EC-M10-02:** Se renombran dos cuentas con el mismo nombre. Se rechaza por duplicado (RF-M4-01).
- **EC-M10-03:** Se desmarcan todas las categorías de gasto, o todas las de ingreso. Se permite. Registrar mostrará "Ver todas" vacío para ese tipo, con la acción "Crear categoría" (EC-M7-07).

#### 2.10.5 Criterios de aceptación
```gherkin
Escenario: Saltar todo
  Dado un usuario recién confirmado
  Cuando toca "Saltar todo"
  Entonces su moneda base es BOB
  Y no tiene cuentas
  Y conserva todas las categorías precargadas
  Y el Inicio lo invita a crear su primera cuenta

Escenario: Retomar en otro dispositivo
  Dado que el usuario completó el paso 1 en su celular y cerró la app
  Cuando inicia sesión en su computadora
  Entonces el Onboarding continúa en el paso 2
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M4 - Cuentas]] · [[M7 - Registrar]] · [[M9 - Ajustes y personalización]]

