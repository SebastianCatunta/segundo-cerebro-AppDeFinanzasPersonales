---
tipo: "plan"
fuente: "001-appFinanzas-mvp/plan.md § 3.9 Seguridad a nivel de datos"
documento: "[[Plan - Plan de diseño técnico]]"
tags:
  - "sdd/plan"
actualizado: "2026-10-30"
---

↑ [[Plan 3. Esquema de Datos y Persistencia Global]] · ← [[Plan 3.8 Integridad y cascadas]]

### 3.9 Seguridad a nivel de datos
- **Aislamiento (ADR-05, RN-09, RNF-14):**
  - La extensión de Prisma agrega `where: { userId }` a todo `find*`, `update*`, `delete*` y `count`, y valida `data.userId === ctx.userId` en todo `create`.
  - Las claves foráneas compuestas impiden apuntar a un recurso de otro usuario.
  - Un recurso ajeno responde `NOT_FOUND 404`, igual que uno inexistente.
- **Secretos:** el hash de la contraseña lo calcula Better Auth (scrypt). Los tokens de los enlaces se guardan solo como SHA-256. Los correos del contador de intentos de inicio de sesión se guardan como HMAC-SHA256. Los secretos (`AUTH_SECRET`, `HMAC_SECRET`, `JOBS_SECRET`, `RESEND_API_KEY`, `DATABASE_URL`) viven en variables de entorno validadas con Zod.
- **En tránsito y en reposo:** TLS en Vercel, Render y Neon. Neon cifra en reposo.
- **Logs:** se registra `traceId`, la ruta, el código y la duración. Nunca se registran cuerpos con contraseñas ni tokens, ni montos asociados a correos (constitución §4).
- **CSRF:** cookie `SameSite=Lax` + `requireJson` + verificación de `Origin` contra la URL de Vercel.
- **Auditoría:** no hay historial de ediciones por movimiento (RNF-24). Los eventos de seguridad se notifican por correo (RNF-25).
- **Retención (RNF-26):** avisos a 90 días, excepto los que esperan una decisión; registros sin confirmar a 7 días; `email_send_log` y `signup_ticket` a 24 h; `login_throttle` sin actividad a 1 h; la cuenta eliminada se borra de inmediato.

---

---
## 🔗 Relacionado

- **Decisiones (ADR):** [[ADR-05 - Aislamiento por usuario]]
- **Requerimientos no funcionales:** [[Spec 3.5 Privacidad y seguridad]] · [[Spec 3.9 Auditoría y retención]]
- **Spec / Plan / Constitución:** [[Constitución 4. Seguridad]] · [[Spec 1.6 Reglas de negocio transversales (RN)]]
- **Entidades:** [[Entidad - EmailSendLog]] · [[Entidad - LoginThrottle]] · [[Entidad - SignupTicket]]

