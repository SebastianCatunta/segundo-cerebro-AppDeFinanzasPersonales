---
tipo: "ejecucion"
fuente: ".claude/run/TASK-274/audit.md"
tags:
  - "ia/ejecucion"
actualizado: "2026-10-30"
---

> [!abstract] Estado local del pipeline para TASK-274 (`.claude/run/TASK-274/audit.md`, no versionado). Etapa: **Auditoría**. Ver [[Protocolo 2. Skill implement-task TASK-XXX]].

## Ronda 1 — APPROVED

VERDICT: APPROVED

El cambio de TASK-274 cumple la tarea. Solo toca los dos archivos de prueba que están en su alcance; no hay archivos de implementación ni archivos nuevos.

- **Cita unitaria de RNF-19** (`<proyecto>\packages\domain\test\fx-convert.test.ts`): la prueba de RN-05 ahora cita RNF-19 en su nombre. Lo que comprueba no cambió: 10 EUR a 7.50, base USD a 10.30, da 7.28.
- **Cita de integración de RNF-19** (`<proyecto>\apps\api\test\integration\dashboard-cards.test.ts`): la prueba de RF-M8-02 sobre la tasa guardada ahora cita RNF-19 sin cambiar lo que comprueba. El caso nuevo `RNF-19 RN-11` cubre lo que pide la especificación y el plan §5.3:
  - Crea movimientos en USD en mayo de 2090, un mes ya pasado respecto de `NOW` (2090-06-15), con tasas distintas guardadas (6.96 y 9.00).
  - Comprueba los totales antes de cualquier cambio. Gasto 159.60 (10 × 6.96 + 10 × 9), ingreso 270.00 y resultado 110.40; los números son correctos.
  - Registra después una tasa personalizada de 12.34 (`user_fx_event` más `user_settings.manual_usd_*`) y comprueba que las tarjetas son idénticas.
  - Con la zona America/New_York las tarjetas también son idénticas.
  - Con moneda base USD, cada movimiento se expresa con su propia tasa guardada (20.00 de gasto y 30.00 de ingreso). Al volver a BOB, el resultado es el mismo de antes.
  - Por último verifica que las tasas guardadas en `ledger_transaction` siguen siendo 6.96 y 9.
  - Esto cubre los dos criterios de verificación: la cita en una prueba unitaria y en una de integración, y que cambiar la tasa de referencia no altera el monto convertido ni el total del período.

No hay reglas de negocio inventadas, ni cambios de producción, ni textos de interfaz. No hay secretos y el código sigue en inglés.

Observaciones menores, que no requieren cambios:
1. `dashboard-cards.test.ts`, al final del caso nuevo: compara las tasas guardadas con `Number(r.cur)` y `Number(r.usd)`. Es solo la aserción de una prueba sobre valores exactos, así que no afecta a la constitución §3. Aun así, comparar el texto decimal sería más coherente con ADR-03.
2. El cambio de zona horaria se prueba pasando `timezone` en el contexto del servicio, no actualizando `user_settings`. Es válido, porque el servicio toma la zona del contexto.

---
## 🔗 Relacionado

- **Módulos:** [[M8 - Inicio (dashboard)]]
- **Decisiones (ADR):** [[ADR-03 - Dinero como decimal]]
- **Requerimientos no funcionales:** [[Spec 3.6 Exactitud monetaria]]
- **Fases de tareas:** [[Tareas Fase 27 - Pulido transversal rendimiento, correos, navegación y marca]]
- **Spec / Plan / Constitución:** [[Constitución 3. Datos y dinero]] · [[Plan 5.3 Requerimientos no funcionales → verificación]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - LedgerTransaction]] · [[Entidad - UserFxEvent]] · [[Entidad - UserSettings]]

