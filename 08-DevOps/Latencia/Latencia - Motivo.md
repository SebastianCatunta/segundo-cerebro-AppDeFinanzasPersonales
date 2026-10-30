---
tipo: "devops"
fuente: "docs/latencia-despliegue.md § Motivo"
documento: "[[Latencia del despliegue]]"
tags:
  - "devops/latencia"
actualizado: "2026-10-30"
---

↑ [[Latencia del despliegue]] · ← [[Latencia - Regiones]] · → [[Latencia - Servicio nuevo]]

## Motivo

El tiempo de una lectura es, sobre todo, el número de viajes secuenciales a la base multiplicado por la latencia entre el API y Neon. Con regiones distintas, cada una de las decenas de consultas de una petición paga entre 50 y 150 ms; en la misma región, el viaje es de pocos milisegundos. Era la causa que más pesaba en la lentitud de las pestañas.

Se movió Render y no Neon porque el API no guarda datos: mover Neon exige crear un proyecto nuevo y restaurar la base.
