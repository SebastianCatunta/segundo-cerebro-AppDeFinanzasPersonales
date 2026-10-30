---
tipo: "adr"
adr: "ADR-20"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-20 · CI-CD con GitHub Actions

## Decisión
CI/CD con GitHub Actions. CI en cada push y PR. QA efímero en CI para la rama `qa` (Postgres, API y web dentro del runner, con E2E completo). Despliegue automático solo desde `main`, después de que CI pase: migraciones → Deploy Hook de Render → Vercel CLI → pruebas de humo. Render y Vercel no despliegan solos desde Git (1.5).

## Motivo
Ningún cambio llega a producción sin pasar CI; el orden migración → API → web es seguro; costo USD 0 sin arriesgar las horas gratis de Render.

## Alternativas descartadas
Auto-deploy nativo en cada push (despliega aunque CI falle); entorno QA desplegado (consume horas gratis de Render).
