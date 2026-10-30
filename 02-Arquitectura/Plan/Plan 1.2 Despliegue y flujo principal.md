---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 1.2 Despliegue y flujo principal"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 1. Visión Arquitectónica y Flujo del Sistema]] · ← [[Plan 1.1 Capas]] · → [[Plan 1.3 Registro de decisiones (ADR)]]

### 1.2 Despliegue y flujo principal

```mermaid
flowchart LR
  subgraph Navegador
    WEB[SPA React<br/>TanStack Query<br/>sessionStorage: borradores]
  end
  subgraph Vercel["Vercel (Hobby)"]
    STATIC[Archivos estáticos]
    PROXY[Rewrite /api/* → Render]
  end
  subgraph Render["Render (gratis)"]
    API[Express API<br/>Better Auth<br/>servicios + jobs]
  end
  DB[(Neon PostgreSQL)]
  CRON[cron-job.org<br/>cada minuto]
  PBO[paralelo.bo<br/>JSON-RPC]
  BCB[BCB<br/>widget TCO]
  RESEND[Resend]

  WEB -->|HTML/JS| STATIC
  WEB -->|/api/* cookie propia| PROXY --> API
  CRON -->|POST /internal/jobs/tick + secreto| API
  API --> DB
  API -->|cada hora / al abrir| PBO
  API -->|diario, respaldo| BCB
  API -->|bandeja de salida| RESEND
```

**Guardar un gasto (camino crítico, RNF-01 y RNF-02):**

```mermaid
sequenceDiagram
  participant U as Usuario
  participant W as Web (/registrar)
  participant A as API
  participant D as Postgres
  U->>W: monto + categoría + Guardar
  W->>A: POST /api/transactions {id: uuidv7, ...}
  A->>A: requireSession · Zod · fecha ≤ hoy (zona del usuario)
  A->>D: BEGIN · SELECT account FOR UPDATE
  A->>D: saldo vigente → BalanceGuard (negativos, apartados)
  A->>D: INSERT ledger_transaction ON CONFLICT (id) DO NOTHING · INSERT ledger_entry
  A->>D: hooks: presupuestos (umbrales, tardíos) · avisos
  A->>D: COMMIT
  A-->>W: 201 {transaction, undoToken, todayRecent}
  W->>W: limpia formulario · toast "Deshacer" 10 s · invalida ['dashboard'] y ['accounts']
```

**Cómo se conectan las tres partes.** La web, el API y la base de datos son tres despliegues separados, cada uno en su servicio. Cada despliegue verifica los tres enlaces con pruebas de humo (1.5):

| Enlace | Cómo se conecta | Dónde se configura | Prueba de humo |
|---|---|---|---|
| Web (Vercel) → API (Render) | Rewrite de `/api/*` hacia la URL pública del API. El navegador solo ve el dominio de la web: no hace falta CORS y la cookie funciona también en Safari (ADR-02). | `vercel.json` | `GET $WEB_URL/api/health/ready` = 204 |
| API (Render) → BD (Neon) | `DATABASE_URL`, con el pooler de Neon, en tiempo de ejecución. Las migraciones usan `DATABASE_URL_DIRECT`, sin pooler. | Variables de Render y secreto del Environment `production` | `GET $API_URL/api/health/ready` = 204 |
| API ← Web (origen permitido) | `checkOrigin` rechaza las mutaciones cuyo `Origin` no sea la web. | `WEB_ORIGIN` en Render | — |

`GET /api/health` solo dice que el API está vivo. `GET /api/health/ready` hace además una consulta a la base de datos (4.2.2). Si esa consulta responde 204 llamando por el dominio de la web, quedan probadas la web, el API y la base de datos, de punta a punta.

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-02 - Sesión entre dominios (proxy de Vercel)]]
- **Requerimientos no funcionales:** [[Spec 3.1 Tiempos límite]]

