---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.9 M9 - Ajustes y personalización (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M9"
modulo: "M9"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · ← [[Spec 2.8 M8 - Inicio (dashboard) (V1.0)]] · → [[Spec 2.10 M10 - Onboarding (V1.0)]]

### 2.9 M9 — Ajustes y personalización (V1.0)

#### 2.9.1 Flujos de usuario
1. El usuario abre Ajustes y elige una sección:
   - **General:**
     - formato de números: "Bs 1.234,56" (por defecto) o "Bs 1,234.56";
     - formato de fecha: DD/MM/AAAA (por defecto), AAAA-MM-DD o "15 oct 2026";
     - primer día de la semana: lunes (por defecto) o domingo;
     - tema: sistema (por defecto), claro u oscuro.
   - **Monedas y tipo de cambio:** monedas activas, moneda base, referencia y valor manual (M3).
   - **Registrar:** cuenta por defecto, categorías favoritas (hasta 8), atajos y "Mostrar la nota siempre" (M7).
   - **Inicio:** orden y visibilidad de los bloques 3 a 8 (M8).
   - **Recordatorios** (V1.2): M15.
2. Cada cambio se guarda al instante, sin botón "Guardar".
3. "Restablecer valores por defecto" (por sección, con confirmación) devuelve los ajustes de esa sección a sus valores iniciales.

#### 2.9.2 Ciclo de vida y estados
Cada ajuste está en su valor por defecto o en un valor personalizado. "Restablecer" lo devuelve al valor por defecto. No hay otros estados.

#### 2.9.3 Requerimientos funcionales
- **RF-M9-01:** TODOS los ajustes, incluidos el tema y la barra lateral contraída, DEBEN guardarse en la cuenta y verse iguales en todos los dispositivos.
- **RF-M9-02:** El símbolo de la moneda DEBE ir antes del monto, separado por un espacio ("Bs 35,00", "$ 97,09"). Al escribir montos se aplica RF-M7-02.
- **RF-M9-03:** Todas las fechas y montos de la app DEBEN respetar los formatos elegidos. Las listas usan expresiones relativas ("Hoy", "Ayer", "Lun 13").
- **RF-M9-04:** El primer día de la semana DEBE aplicarse al calendario.
- **RF-M9-05:** "Restablecer" NO DEBE tocar datos: cuentas, movimientos, categorías, atajos, monedas ni moneda base. En "Monedas y tipo de cambio" solo devuelve la referencia a la mediana del paralelo y desactiva el valor manual.
- **RF-M9-06:** NO existen valores globales de presupuestos. Cada presupuesto se configura por separado (M11).

#### 2.9.4 Casos borde y excepciones
- **EC-M9-01:** Se cambia un ajuste en dos dispositivos a la vez. Gana el último guardado, y el otro dispositivo lo refleja al actualizar.
- **EC-M9-02:** Se elige como cuenta por defecto una cuenta que luego se archiva. Se aplica EC-M7-05.

#### 2.9.5 Criterios de aceptación
```gherkin
Escenario: Ajustes sincronizados
  Dado que el usuario cambia el tema a oscuro en su celular
  Cuando abre la app en su computadora
  Entonces la ve en tema oscuro

Escenario: Formato de números
  Dado el formato "Bs 1,234.56"
  Cuando el usuario escribe "35.50" en Registrar
  Entonces el monto registrado es treinta y cinco con cincuenta

Escenario: Punto decimal con el formato por defecto
  Dado el formato "Bs 1.234,56"
  Cuando el usuario escribe "35.50" en Registrar
  Entonces el monto registrado es treinta y cinco con cincuenta
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M10 - Onboarding]] · [[M11 - Presupuestos]] · [[M15 - Recordatorios y avisos]] · [[M3 - Monedas y tipo de cambio]] · [[M7 - Registrar]] · [[M8 - Inicio (dashboard)]] · [[M9 - Ajustes y personalización]]

