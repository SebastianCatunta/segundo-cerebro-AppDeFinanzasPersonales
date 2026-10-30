---
tipo: "frontend"
fuente: "apps/web/src/components"
tags:
  - "frontend/ui"
actualizado: "2026-10-30"
---

# Componentes compartidos

Componentes reutilizados fuera de `ui/`, como la marca (`BrandMark`).

| Archivo | Exporta | Descripción (comentario del código) |
|---|---|---|
| `brand-mark.tsx` | `BrandMark` | Pixel size of the mark: 24 px in the header and 48 px over the access screens (RF-M2-14). |
| `page-skeleton.tsx` | `PageSkeleton` | What a screen shows while its data arrives, instead of a blank page: neutral blocks announced once as "Cargando". It rests when the user prefers reduced motion (RNF-06). |
| `resource-not-found.tsx` | `ResourceNotFound` | What a detail screen shows when its resource no longer exists, e.g. the target of a notification that was deleted (RF-M15-11, plan §4.15.3): "Esto ya no existe" and a way back to Inicio. |

---
## 🔗 Relacionado

- **Módulos:** [[M15 - Recordatorios y avisos]] · [[M2 - Navegación y estructura]]
- **Requerimientos no funcionales:** [[Spec 3.2 Compatibilidad y accesibilidad]]
- **Spec / Plan / Constitución:** [[Plan 4.15 M15 - Recordatorios y avisos (bandeja V1.1, completo V1.2)]]

