---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 3.4 Idempotencia"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
actualizado: "2026-10-30"
---

↑ [[Spec 3. Requerimientos no funcionales globales (RNF)]] · ← [[Spec 3.3 Concurrencia]] · → [[Spec 3.5 Privacidad y seguridad]]

### 3.4 Idempotencia
- **RNF-11:** Un doble toque, un reintento o una reconexión NUNCA DEBEN duplicar movimientos, pagos, apartados ni decisiones.
- **RNF-12:** Un recurrente genera como máximo una ocurrencia por regla y fecha. Un cierre de presupuesto se decide una sola vez por presupuesto y período. Un aviso se genera una sola vez por evento.
- **RNF-13:** Los procesos automáticos que se interrumpan DEBEN retomarse sin duplicar ni omitir lo pendiente.
