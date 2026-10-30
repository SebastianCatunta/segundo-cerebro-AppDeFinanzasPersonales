---
tipo: "devops"
fuente: "docs/latencia-despliegue.md § Cómo medirlos"
documento: "[[Latencia del despliegue]]"
tags:
  - "devops/latencia"
actualizado: "2026-10-30"
---

↑ [[Latencia del despliegue]] · ← [[Latencia - Tiempos medidos]] · → [[Latencia - Mantener despiertos los servicios]]

## Cómo medirlos

Cada respuesta lleva la cabecera `Server-Timing` con `total`, `db` y `queries` (plan §4.0).

1. Abrir la web en producción con las herramientas del navegador (pestaña Network).
2. Ir a `https://<WEB_URL>/api/health/ready`.
3. Anotar el valor `db` de la cabecera `Server-Timing`, tres veces. Se descarta la primera si el servicio estaba dormido.
4. Interpretarlo: en la misma región debería ser de unos pocos milisegundos, y la meta es **menos de 10 ms**. Decenas de milisegundos o más indican regiones distintas o una conexión mal configurada.

Para comparar, repetir la medición con el servicio anterior y anotar ambos resultados en esta página.

---
## 🔗 Relacionado

- **Spec / Plan / Constitución:** [[Plan 4.0 Elementos transversales]]

