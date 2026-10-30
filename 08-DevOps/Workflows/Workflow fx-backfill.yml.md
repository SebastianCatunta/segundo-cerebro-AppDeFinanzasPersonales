---
tipo: "devops"
fuente: ".github/workflows/fx-backfill.yml"
tags:
  - "devops/ci"
actualizado: "2026-10-30"
---

# Workflow `fx-backfill.yml`

Manual. Ejecuta una sola vez `packages/db/scripts/fx-backfill.ts` contra producción para cargar el historial del tipo de cambio. Es idempotente.

Ver también [[Flujo - Despliegue a producción]] y [[Plan 1.5 Integración y despliegue continuos (ADR-20)]].

## Pasos

1. Checkout
1. Setup pnpm
1. Setup Node
1. Install dependencies
1. Generate the Prisma client
1. Load the rate history

> [!example]- Archivo completo .github/workflows/fx-backfill.yml
> ```yaml
> # One-time load of the exchange rate history into production (plan §1.5, ADR-06).
> # It only runs by hand (Actions → fx-backfill → Run workflow) and uses the secrets of the
> # `production` environment. The script is idempotent: running it again does not duplicate rows.
> name: fx-backfill
> 
> on:
>   workflow_dispatch:
> 
> permissions:
>   contents: read
> 
> concurrency:
>   group: production
>   cancel-in-progress: false
> 
> jobs:
>   fx-backfill:
>     name: fx-backfill
>     runs-on: ubuntu-latest
>     timeout-minutes: 60
>     environment: production
>     steps:
>       - name: Checkout
>         uses: actions/checkout@v4
> 
>       - name: Setup pnpm
>         uses: pnpm/action-setup@v4
> 
>       - name: Setup Node
>         uses: actions/setup-node@v4
>         with:
>           node-version-file: .nvmrc
>           cache: pnpm
> 
>       - name: Install dependencies
>         run: pnpm install --frozen-lockfile
> 
>       - name: Generate the Prisma client
>         run: pnpm --filter @finanzas/db generate
> 
>       # Prisma requires the `url` variable even though it also reads `directUrl`, so both point at
>       # the direct Neon connection. The parts of the URL are masked before anything can print them.
>       # The script waits one second between days, so the run takes about 15 minutes.
>       - name: Load the rate history
>         env:
>           DATABASE_URL: ${{ secrets.DATABASE_URL_DIRECT }}
>           DATABASE_URL_DIRECT: ${{ secrets.DATABASE_URL_DIRECT }}
>         run: |
>           node --input-type=module -e '
>             const url = new URL(process.env.DATABASE_URL_DIRECT);
>             const parts = [url.hostname, url.username, url.password, decodeURIComponent(url.password)];
>             for (const part of new Set(parts.filter(Boolean))) console.log(`::add-mask::${part}`);
>           '
>           pnpm --filter @finanzas/db fx-backfill
> ```

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-06 - Fuentes de tasas de cambio]] · [[ADR-20 - CI-CD con GitHub Actions]]

