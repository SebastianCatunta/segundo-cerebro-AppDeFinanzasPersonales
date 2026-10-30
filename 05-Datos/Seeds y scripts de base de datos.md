---
tipo: "datos"
fuente: "packages/db"
tags:
  - "datos/seed"
actualizado: "2026-10-30"
---

# Seeds y scripts de `packages/db`

| Archivo | Descripción (comentario del código) |
|---|---|
| `src/client.ts` | Global models without `user_id` (ADR-12, plan §3.3 and §3.7). A user-scoped client passes their queries through untouched. |
| `src/index.ts` |  |
| `seed/e2e.ts` | Seed of the end-to-end and performance suites (plan §1.5, §5.1; RNF-03). It creates known test users, fixed market rates for 13 months and, for the performance user, 5.000 movements spread over 12 months. Every id derives from a stable name and every row is inserted with `ON CONFLICT DO NOTHING`, so running it again changes nothing. The months are anchored to the current day in La Paz. |
| `seed/preset-categories.ts` |  |
| `scripts/fx-backfill.ts` |  |

- `seed:e2e` lo usa [[Workflow qa-e2e.yml]] (usuarios de prueba, 5.000 movimientos y tasas fijas).
- `fx-backfill` lo usa [[Workflow fx-backfill.yml]].
- `preset-categories` son las categorías precargadas del [[M10 - Onboarding]].

## Scripts del paquete

```json
{
  "generate": "prisma generate",
  "migrate:dev": "prisma migrate dev",
  "migrate:deploy": "prisma migrate deploy",
  "test:integration": "vitest run --config vitest.config.ts",
  "fx-backfill": "tsx scripts/fx-backfill.ts",
  "seed:e2e": "tsx --env-file-if-exists=../../.env seed/e2e.ts",
  "typecheck": "tsc -p tsconfig.json"
}
```

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-12 - Datos de mercado globales]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]]
- **Spec / Plan / Constitución:** [[Plan 1.5 Integración y despliegue continuos (ADR-20)]] · [[Plan 3.3 Cuenta de usuario y seguridad (M1)]]

