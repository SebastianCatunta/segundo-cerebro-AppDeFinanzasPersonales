---
tipo: "constitucion"
fuente: "docs/constitution.md § 2. Stack tecnológico"
documento: "[[Constitución]]"
tags:
  - "sdd/constitucion"
actualizado: "2026-10-30"
---

↑ [[Constitución]] · ← [[Constitución 1. Producto]] · → [[Constitución 3. Datos y dinero]]

## 2. Stack tecnológico
- **Lenguaje:** TypeScript en todo el proyecto, organizado como monorepo.
- **Frontend:** React + Vite, Tailwind CSS + shadcn/ui, TanStack Query.
- **Backend:** Node.js + Express, Prisma, Zod.
- **Base de datos:** PostgreSQL.
- **Autenticación:** Better Auth.
- **Dinero:** decimal.js.
- **Correo (solo de cuenta):** Resend.
- **Tests:** Vitest y Playwright.
- **Despliegue:** Railway o Render (backend), Neon (base de datos), Vercel o Netlify (frontend).

Agregar una tecnología que reemplace o duplique alguna de estas requiere el acuerdo de todo el equipo.
