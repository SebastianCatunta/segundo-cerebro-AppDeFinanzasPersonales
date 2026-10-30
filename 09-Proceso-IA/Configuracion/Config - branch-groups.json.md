---
tipo: "configuracion"
fuente: "tools/sdd/branch-groups.json"
tags:
  - "config"
actualizado: "2026-10-30"
---

# `tools/sdd/branch-groups.json`

Ramas de grupo que juntan tareas de varias fases (protocolo §5.1). Una tarea listada se hace en la rama de su grupo, no en la de su fase.

## Contenido

```json
{
  "description": "Ramas que agrupan tareas de varias fases (protocolo §5.1). Una tarea listada aquí se hace en la rama de su grupo y no en la de su fase. Los rangos (\"TASK-068..TASK-076\") incluyen los dos extremos.",
  "groups": [
    {
      "branch": "feature/07-12-a-web-y-monedas",
      "summary": "Fases 7 y 8 completas y la web de las Fases 9 a 12",
      "tasks": [
        "TASK-068..TASK-076",
        "TASK-077..TASK-095",
        "TASK-106..TASK-108",
        "TASK-116..TASK-117",
        "TASK-129..TASK-133",
        "TASK-137..TASK-142"
      ]
    },
    {
      "branch": "feature/07-12-b-backend-nucleo",
      "summary": "Backend de cuentas, categorías, movimientos y Registrar (Fases 9 a 12)",
      "tasks": [
        "TASK-096..TASK-105",
        "TASK-109..TASK-115",
        "TASK-118..TASK-128",
        "TASK-134..TASK-136"
      ]
    },
    {
      "branch": "feature/20-m11-presupuestos",
      "summary": "Fase 20: M11 Presupuestos",
      "tasks": ["TASK-193..TASK-207"]
    },
    {
      "branch": "feature/21-m13-deudas-y-prestamos",
      "summary": "Fase 21: M13 Deudas y préstamos",
      "tasks": ["TASK-208..TASK-218"]
    },
    {
      "branch": "feature/22-cierre-de-v1-1",
      "summary": "Fase 22: cierre de V1.1",
      "tasks": ["TASK-219..TASK-222"]
    },
    {
      "branch": "feature/23-m14-recurrentes",
      "summary": "Fase 23: M14 Recurrentes, backend (Alejandro) y web (Sebastián)",
      "tasks": ["TASK-223..TASK-236"]
    },
    {
      "branch": "feature/24-m15-recordatorios-y-avisos",
      "summary": "Fase 24: M15 Recordatorios y avisos completos",
      "tasks": ["TASK-237..TASK-242"]
    },
    {
      "branch": "feature/25-final-integracion-e2e",
      "summary": "Fase 25: final",
      "tasks": ["TASK-243..TASK-247"]
    }
  ]
}
```

---
## 🔗 Relacionado

- **Módulos:** [[M11 - Presupuestos]] · [[M13 - Deudas y préstamos]] · [[M14 - Recurrentes]] · [[M15 - Recordatorios y avisos]]
- **Fases de tareas:** [[Tareas Fase 10 - M5 Categorías (V1.0)]] · [[Tareas Fase 11 - M6 Transacciones (V1.0)]] · [[Tareas Fase 12 - M7 Registrar (V1.0)]] · [[Tareas Fase 20 - M11 Presupuestos (V1.1)]] · [[Tareas Fase 21 - M13 Deudas y préstamos (V1.1)]] · [[Tareas Fase 22 - Cierre de V1.1 Inicio, exportación y regresión]] · [[Tareas Fase 23 - M14 Recurrentes (V1.2)]] · [[Tareas Fase 24 - M15 Recordatorios y avisos completos (V1.2)]] · [[Tareas Fase 25 - Final integración E2E y validación de RNF]] · [[Tareas Fase 7 - M2 Navegación y estructura, perfil y ajustes base (V1.0)]] · [[Tareas Fase 8 - M3 Monedas y tipo de cambio (V1.0)]] · [[Tareas Fase 9 - M4 Cuentas (V1.0)]]

