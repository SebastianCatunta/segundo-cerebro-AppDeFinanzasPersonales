---
tipo: "adr"
adr: "ADR-02"
fuente: "001-appFinanzas-mvp/plan.md § 1.3"
tags:
  - "arquitectura/adr"
actualizado: "2026-10-30"
---

↑ [[Plan 1.3 Registro de decisiones (ADR)]]

# ADR-02 · Sesión entre dominios (proxy de Vercel)

## Decisión
Sesión entre dominios: Vercel hace de proxy de `/api/*`. Cookie propia `HttpOnly; Secure; SameSite=Lax` + verificación de `Origin`.

## Motivo
Safari bloquea las cookies de terceros. Sin dominio propio ni CORS.

## Alternativas descartadas
Subdominios con dominio propio, `SameSite=None`.
