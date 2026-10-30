---
tipo: "configuracion"
fuente: "docker/postgres/init.sql"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `docker/postgres/init.sql`

Script de arranque del contenedor de Postgres: crea las bases `finanzas_dev` (desarrollo) y `finanzas_test` (pruebas de integración).

## Contenido

```sql
CREATE DATABASE finanzas_dev;
CREATE DATABASE finanzas_test;
```
