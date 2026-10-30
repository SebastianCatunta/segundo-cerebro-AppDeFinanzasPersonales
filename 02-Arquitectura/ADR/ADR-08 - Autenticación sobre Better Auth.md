---
tipo: "adr"
adr: "ADR-08"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-08 · Autenticación sobre Better Auth

## Decisión
Autenticación: endpoints propios `/api/auth/*` sobre la API de servidor de Better Auth (usuario, hash scrypt, sesiones, cookie). Enlaces, bloqueos y correos son propios. El manejador HTTP genérico de Better Auth no se expone.

## Motivo
Better Auth no permite invalidar el enlace anterior, ni dar mensajes neutros, ni bloquear correos sin cuenta.

## Alternativas descartadas
Solo hooks y plugins.
