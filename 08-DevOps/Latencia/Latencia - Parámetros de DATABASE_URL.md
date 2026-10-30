---
tipo: "devops"
fuente: "docs/latencia-despliegue.md § Parámetros de DATABASE_URL"
documento: "[[Latencia del despliegue]]"
tags:
  - "devops/latencia"
actualizado: "2026-10-30"
---

↑ [[Latencia del despliegue]] · ← [[Latencia - Servicio nuevo]] · → [[Latencia - Tiempos medidos]]

## Parámetros de `DATABASE_URL`

La variable `DATABASE_URL` de Render (se carga en el panel, no en el repositorio) debe cumplir:

- **Host con `-pooler`:** el pooler de Neon (PgBouncer en modo transacción).
- **`sslmode=require`:** la conexión va cifrada.
- **`pgbouncer=true`:** Prisma deja de usar sentencias preparadas, que PgBouncer en modo transacción no admite.
- **`connection_limit=5`:** conexiones suficientes para las lecturas que corren en paralelo, sin agotar el límite del plan gratis.

Forma esperada: el host de Neon con `-pooler` después del nombre del endpoint (el texto que ve Neon como _Pooled connection_) y, al final, `?sslmode=require&pgbouncer=true&connection_limit=5`. No se copia aquí un ejemplo completo para no guardar nunca una URL con contraseña en el repositorio.

Si falta algo, se corrige en Render y se reinicia el servicio. Las migraciones no pasan por aquí: usan la conexión directa (`DATABASE_URL_DIRECT`).
