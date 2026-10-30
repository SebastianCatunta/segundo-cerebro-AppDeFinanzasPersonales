---
tipo: "configuracion"
fuente: "docker-compose.yml"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `docker-compose.yml`

Postgres 16 local (`finanzas-db`) en el puerto 5432, con volumen persistente, healthcheck y el script `docker/postgres/init.sql` que crea las bases `finanzas_dev` y `finanzas_test`.

## Contenido

```yaml
services:
  db:
    image: postgres:16
    container_name: finanzas-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres} -d finanzas_dev"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  db-data:
```
