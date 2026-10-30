---
tipo: "adr"
adr: "ADR-03"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-03 · Dinero como decimal

## Decisión
Dinero: `NUMERIC` en Postgres, `Prisma.Decimal` (decimal.js) en el servidor, texto `"1234.56"` en el JSON, decimal.js en la web. Solo los gráficos convierten a `number`, para dibujar. `ROUND(numeric, 2)` de Postgres = mitad alejándose del cero = RN-06.

## Motivo
Constitución §3: nunca punto flotante.

## Alternativas descartadas
`number` en el JSON.

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Constitución 3. Datos y dinero]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]

