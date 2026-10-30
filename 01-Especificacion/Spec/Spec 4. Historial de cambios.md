---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 4. Historial de cambios"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec - Especificación funcional]] · ← [[Spec 3. Requerimientos no funcionales globales (RNF)]]

## 4. Historial de cambios

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-10-15 | Versión inicial. |
| 1.1 | 2026-10-16 | Resuelve la revisión QA de 127 hallazgos: historial diario de tasas por moneda, tasa guardada al guardar y con 2 decimales, prioridad del valor manual, moneda base libre y "otra moneda" definida; alcance de comparativos y proyecciones; cambios que pueden alterar la historia (RN-11); borradores en todos los formularios; arrastre que se reemplaza en cada cierre y movimientos tardíos según la decisión; interés desde la fecha de inicio que nunca se recalcula, con eliminación solo del último pago; recurrentes que empiezan hoy, que cuentan toda ocurrencia y con monto variable; protección de apartados ampliada; sin sesión hasta confirmar el correo; exportación completa; formato "Bs 1.234,56"; límites por usuario; saldo inicial fijo (se corrige con un ajuste); tasa guardada que solo cambia a mano; tarjetas con saldo inicial a favor; cuentas dedicadas en "Apartado para metas". |
| 1.2 | 2026-10-16 | Ajustes por las fuentes reales de tasas (revisión técnica del plan): el oficial del BCB es un solo valor (TCO); en el paralelo, "venta" es el mayor de los dos valores publicados y "compra" el menor; los días sin compra o venta usan la mediana de ese día; la tasa mínima de una moneda agregada es Bs 0,01. |
| 1.3 | 2026-10-16 | Un nuevo registro con un correo Sin confirmar reinicia el plazo de 7 días para descartarlo. Un movimiento con fecha pasada guarda la tasa de la referencia y del valor manual que el usuario tenía en uso ese día (el historial guarda también los cambios de referencia). El día de una tasa de mercado es el día calendario de Bolivia. El aviso del valor manual se muestra en el panel de Tipo de cambio y como distintivo en la ficha del dólar. Una transferencia con fecha pasada precarga los valores de ese día. Cuentas: el gráfico de saldo usa el filtro de fechas del detalle; el saldo inicial tiene los límites de RF-M6-01; un saldo a favor de tarjeta reduce la deuda en tarjetas; reglas para cambiar el tipo de una cuenta. Una categoría usada por un presupuesto o una regla no se elimina (se archiva). Nombre de atajo de 1 a 30 caracteres. Eliminar el último pago de una deuda restablece también su interés. Las reglas recurrentes tienen nombre (1 a 40). |
| 1.4 | 2026-10-16 | El aviso que acompaña a una regla recurrente pausada automáticamente (al archivar o eliminar su cuenta, o al archivar su categoría) es del tipo "Pendiente de recurrente", y respeta su configuración. |
| 1.5 | 2026-10-28 | Se elimina el correo de aviso por intentos fallidos (RF-M1-08, RF-M1-16, RNF-25); la espera progresiva se mantiene. El enlace del correo solo confirma la cuenta y la app que espera continúa sola al Onboarding, también si el enlace se abre en otro dispositivo (RF-M1-18, EC-M1-11, EC-M1-13, EC-M1-14). Botón "Volver" en la cabecera de las pantallas internas (RF-M2-13, EC-M2-04) y logo de la app (RF-M2-14). Rendimiento de cada pestaña (RNF-29). 3 escenarios Gherkin nuevos (56 en total). |

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M2 - Navegación y estructura]] · [[M6 - Transacciones]]
- **Requerimientos no funcionales:** [[Spec 3.11 Rendimiento de cada pestaña]] · [[Spec 3.9 Auditoría y retención]]
- **Spec / Plan / Constitución:** [[Spec 1.6 Reglas de negocio transversales (RN)]]

