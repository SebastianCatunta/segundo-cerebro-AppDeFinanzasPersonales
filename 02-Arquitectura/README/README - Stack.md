---
tipo: "readme"
fuente: "README.md § Stack"
documento: "[[README - App de Finanzas Personales]]"
tags:
  - "readme"
actualizado: "2026-10-30"
---

↑ [[README - App de Finanzas Personales]] · ← [[README - Equipo]] · → [[README - Estructura]]

## Stack

| Capa          | Tecnología                                                           |
| ------------- | -------------------------------------------------------------------- |
| Lenguaje      | TypeScript en un monorepo pnpm                                       |
| Frontend      | React + Vite, Tailwind CSS + shadcn/ui, TanStack Query, React Router |
| Backend       | Node.js + Express, Prisma, Zod, Better Auth                          |
| Base de datos | PostgreSQL 16 (Neon en producción, Docker en local)                  |
| Dinero        | decimal.js: nunca punto flotante                                     |
| Pruebas       | Vitest (unitarias, integración y contratos HTTP) y Playwright (E2E)  |
| Despliegue    | Vercel (web), Render (API), Neon (BD) y GitHub Actions               |

El backend está en cuatro capas (presentación → aplicación → dominio, más infraestructura), y dependency-cruiser verifica las reglas entre ellas en CI. Detalle en el [[Plan - Plan de diseño técnico|plan §1.4]].

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]]

