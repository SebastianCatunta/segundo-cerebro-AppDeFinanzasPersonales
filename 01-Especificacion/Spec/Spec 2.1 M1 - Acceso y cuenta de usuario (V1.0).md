---
tipo: "spec"
fuente: "001-appFinanzas-mvp/spec.md § 2.1 M1 - Acceso y cuenta de usuario (V1.0)"
documento: "[[Spec - Especificación funcional]]"
tags:
  - "sdd/spec"
  - "modulo/M1"
modulo: "M1"
actualizado: "2026-10-30"
---

↑ [[Spec 2. Desglose por módulos]] · → [[Spec 2.2 M2 - Navegación y estructura (V1.0)]]

### 2.1 M1 — Acceso y cuenta de usuario (V1.0)

#### 2.1.1 Flujos de usuario
**Registro**
1. El visitante abre "Crear cuenta" e ingresa su nombre (1-60 caracteres), su correo y una contraseña (de 8 a 128 caracteres).
2. Marca la casilla obligatoria "Acepto los términos y la política de privacidad".
3. Al enviar, ve siempre el mismo mensaje: "Si el correo es válido, te enviamos un enlace para confirmar tu cuenta".
4. Si el correo es nuevo, recibe un enlace de confirmación válido por 24 h. Si el correo tenía un registro Sin confirmar, se reemplazan el nombre y la contraseña, se invalida el enlace anterior y se envía uno nuevo. Si el correo ya tenía una cuenta Activa, el dueño recibe un aviso: "Alguien intentó registrarse con tu correo. ¿Querías iniciar sesión?".
5. Registrarse NUNCA abre sesión. En todos los casos ve "Revisa tu correo", con la opción de reenviar.
6. Al abrir el enlace, la cuenta queda Activa. El enlace solo confirma la cuenta: no abre sesión. La app donde el usuario se registró, si sigue abierta en "Revisa tu correo", detecta la confirmación, inicia la sesión y comienza sola el Onboarding (M10), aunque el enlace se haya abierto en otro dispositivo. Si en ese navegador había una sesión de otro usuario, esa se cierra y su borrador se descarta. Si ya no hay una app esperando, el usuario inicia sesión con su correo y su contraseña.

**Inicio de sesión**
1. El visitante ingresa su correo y su contraseña.
2. Si son correctos y el correo está confirmado, entra al Inicio, o al Onboarding si no lo terminó.
3. Si son correctos pero el correo no está confirmado, ve "Revisa tu correo", sin que se abra la sesión.
4. Si son incorrectos, ve "Correo o contraseña incorrectos", sin indicar cuál de los dos falló.

**Recuperación de contraseña**
1. El visitante toca "Olvidé mi contraseña" e ingresa su correo. Ve el mensaje neutro.
2. Si el correo existe, recibe un enlace válido por 1 h y de un solo uso.
3. Al abrirlo, define una contraseña nueva. Se cierran todas sus sesiones, queda iniciada la sesión en el dispositivo actual y recibe un correo de confirmación del cambio. Si la cuenta estaba Sin confirmar, queda Activa: abrir el enlace prueba que el correo es suyo.

**Perfil**
1. El usuario edita su nombre, su zona horaria y su idioma. El idioma tiene en la V1 una sola opción: "Español (Bolivia)".
2. Para cambiar la contraseña, ingresa la actual y la nueva. Al guardar, se cierran sus demás sesiones y recibe un correo de aviso.
3. El correo se muestra pero no se edita. Junto a él se explica cómo cambiarlo: exportar los datos, eliminar la cuenta y registrarse de nuevo.
4. "Cerrar sesión" cierra el dispositivo actual. "Cerrar sesión en todos los dispositivos" cierra todos.

**Exportar mis datos**
1. El usuario toca "Exportar mis datos".
2. Descarga un archivo comprimido, generado en el momento, con un archivo CSV por tipo de dato: perfil y ajustes, monedas e historial de tasas manuales, cuentas, categorías, movimientos, apartados y retiros, presupuestos y sus períodos, metas, deudas y pagos, recurrentes y pendientes, atajos y avisos. Incluye los elementos archivados. No incluye CSV de módulos de entregas no liberadas. Si tarda, se muestra el progreso.

**Eliminar mi cuenta**
1. El usuario toca "Eliminar cuenta". Una pantalla explica qué se borra y ofrece exportar antes.
2. Para confirmar, ingresa su contraseña y escribe la palabra ELIMINAR.
3. Todos sus datos se borran al instante, se cierran todas sus sesiones y recibe un correo de confirmación. No se puede deshacer.

#### 2.1.2 Ciclo de vida y estados

**Cuenta de usuario**

| Desde | Hacia | Disparador |
|---|---|---|
| — | Sin confirmar | Registro |
| Sin confirmar | Sin confirmar | Nuevo registro con el mismo correo: reemplaza nombre y contraseña, y envía un enlace nuevo |
| Sin confirmar | Activa | Abre un enlace de confirmación vigente, o recupera su contraseña |
| Sin confirmar | Descartada | Pasan 7 días desde el último registro sin confirmar. El correo queda libre |
| Activa | Eliminada | Eliminación confirmada |

- Prohibido: cualquier transición desde Descartada o Eliminada. Una cuenta Sin confirmar no tiene sesión ni accede a ningún dato.

**Sesión**

| Desde | Hacia | Disparador |
|---|---|---|
| — | Activa | Inicio de sesión con el correo confirmado, confirmación o recuperación |
| Activa | Activa (renovada) | Cada acción del usuario renueva el plazo de 30 días. Las peticiones en segundo plano no lo renuevan |
| Activa | Vencida | 30 días sin acciones del usuario |
| Activa | Cerrada | Cerrar sesión en ese dispositivo |
| Activa | Revocada | Cerrar sesión en todos, cambio de contraseña (salvo el dispositivo actual) o eliminación de la cuenta |

**Enlace de confirmación o recuperación:** Vigente → Usado | Vencido | Invalidado (al pedir uno nuevo).

#### 2.1.3 Requerimientos funcionales
- **RF-M1-01:** El sistema DEBE exigir nombre (1-60 caracteres), correo con formato válido, contraseña de 8 a 128 caracteres y la aceptación de los términos.
- **RF-M1-02:** El sistema DEBE tratar el correo sin espacios al inicio ni al final y sin distinguir mayúsculas.
- **RF-M1-03:** El sistema DEBE responder con el mismo mensaje neutro al registrarse o pedir la recuperación, exista o no el correo.
- **RF-M1-04:** El sistema DEBE impedir todo acceso a los datos hasta que el correo esté confirmado. Registrarse o iniciar sesión sin haber confirmado NO abre sesión.
- **RF-M1-05:** El sistema DEBE permitir reenviar la confirmación una vez cada 60 segundos y como máximo 5 veces por hora. Cada reenvío invalida el enlace anterior.
- **RF-M1-06:** El sistema DEBE descartar los registros sin confirmar a los 7 días del último registro con ese correo. Un nuevo registro reinicia el plazo.
- **RF-M1-07:** El sistema DEBE mantener la sesión durante 30 días desde la última acción del usuario (las peticiones en segundo plano no cuentan) y permitir sesiones simultáneas en varios dispositivos.
- **RF-M1-08:** El sistema DEBE contar los intentos fallidos por correo, exista o no una cuenta con ese correo. Tras 5 fallos seguidos exige 1 minuto de espera; tras 10, 15 minutos, y desde ahí cada nuevo fallo vuelve a exigir 15 minutos. El contador se reinicia con un inicio de sesión exitoso o tras 1 hora sin intentos. Debe mostrar el tiempo restante. No envía ningún correo por los intentos fallidos. El sistema NUNCA bloquea la cuenta de forma permanente.
- **RF-M1-09:** El enlace de recuperación DEBE vencer en 1 hora y servir una sola vez. Pedir uno nuevo invalida el anterior.
- **RF-M1-10:** Al cambiar o recuperar la contraseña, el sistema DEBE revocar todas las demás sesiones y enviar un correo de confirmación.
- **RF-M1-11:** El sistema DEBE detectar la zona horaria del dispositivo al registrarse (Bolivia, si no puede detectarla) y permitir cambiarla en el perfil.
- **RF-M1-12:** Cambiar la zona horaria NO DEBE alterar la fecha de los movimientos ya registrados.
- **RF-M1-13:** El sistema NO DEBE permitir cambiar el correo de la cuenta.
- **RF-M1-14:** La exportación DEBE incluir todos los datos del usuario, archivados incluidos, y generarse en el momento, sin pasar por el correo. Los CSV DEBEN estar en UTF-8, con coma como separador y números con punto decimal y sin separador de miles (1234.56). Toda celda que empiece con `=`, `+`, `-` o `@` DEBE neutralizarse para que no se ejecute como fórmula.
- **RF-M1-15:** La eliminación de la cuenta DEBE exigir la contraseña y la palabra ELIMINAR. Debe borrar todos los datos del usuario de inmediato, revocar todas las sesiones y enviar un correo de confirmación. Si hay un proceso automático del usuario en curso (recurrente, cierre de período), se cancela y nada se crea después de la eliminación.
- **RF-M1-16:** Los únicos correos que envía el sistema son: confirmación, intento de registro con un correo existente, recuperación, cambio de contraseña y eliminación de la cuenta.
- **RF-M1-17:** El aviso de intento de registro con un correo existente DEBE enviarse como máximo una vez por hora por cuenta.
- **RF-M1-18:** El enlace de confirmación DEBE servir solo para confirmar la cuenta: no abre sesión ni lleva al Onboarding. La app donde el usuario se registró, mientras siga abierta en "Revisa tu correo" (en la misma pestaña, en otra del navegador o tras recuperar el foco), DEBE detectar la confirmación, abrir la sesión y continuar sola al Onboarding, aunque el enlace se haya abierto en otro dispositivo u otro navegador. Si ya no hay una app esperando, la página del enlace DEBE indicar que la cuenta quedó confirmada y ofrecer iniciar sesión.

#### 2.1.4 Casos borde y excepciones
- **EC-M1-01:** Se abre un enlace de confirmación vencido o invalidado. El sistema muestra "Este enlace ya no es válido" y ofrece reenviar.
- **EC-M1-02:** Se abre un enlace de confirmación ya usado con la cuenta activa. El sistema lleva al inicio de sesión.
- **EC-M1-03:** Alguien se registra con un correo cuyo registro sin confirmar fue descartado. Se trata como un registro nuevo.
- **EC-M1-04:** Se intenta iniciar sesión durante el tiempo de espera, aunque sea con la contraseña correcta. Se rechaza y se muestra el tiempo restante.
- **EC-M1-05:** Se cambia la contraseña en el dispositivo A mientras B está abierto. B pierde la sesión en su siguiente acción y ve el inicio de sesión.
- **EC-M1-06:** Se elimina la cuenta en A mientras B está abierto. B pierde la sesión en su siguiente acción.
- **EC-M1-07:** El servicio de correo falla. El registro o la recuperación muestran el mismo mensaje neutro, y el usuario puede reenviar respetando los límites.
- **EC-M1-08:** La contraseña de la eliminación es incorrecta, o la palabra no es exactamente ELIMINAR. No se elimina nada y se explica el motivo.
- **EC-M1-09:** Alguien se registra con un correo que tiene un registro Sin confirmar (aún no descartado). Se reemplazan el nombre y la contraseña, se invalida el enlace anterior, se envía uno nuevo y el plazo de 7 días vuelve a empezar.
- **EC-M1-10:** Se recupera la contraseña de una cuenta Sin confirmar. Al definir la contraseña nueva, la cuenta queda Activa.
- **EC-M1-11:** Se confirma el correo de A mientras la app que lo espera está en un navegador con la sesión de B abierta. Se cierra la sesión de B, su borrador se descarta y se inicia la de A.
- **EC-M1-12:** Hay intentos fallidos con un correo sin cuenta. Se aplica la misma espera que a uno con cuenta, para no revelar si existe.
- **EC-M1-13:** El usuario cierra la app donde se registró antes de confirmar. Al abrir el enlace, nada continúa solo: la página del enlace dice que la cuenta quedó confirmada y el usuario inicia sesión con su correo y su contraseña.
- **EC-M1-14:** Una cuenta Sin confirmar recupera su contraseña (EC-M1-10), o alguien se registra de nuevo con su correo (EC-M1-09). La app que esperaba desde el registro anterior deja de continuar sola: solo el enlace de ese mismo registro puede abrirle la sesión.

#### 2.1.5 Criterios de aceptación
```gherkin
Escenario: Registro con correo ya existente no revela la cuenta
  Dado que existe una cuenta con "ana@mail.com"
  Cuando un visitante se registra con "ANA@mail.com "
  Entonces ve "Si el correo es válido, te enviamos un enlace"
  Y el dueño de la cuenta recibe un aviso de intento de registro
  Y no se crea una segunda cuenta

Escenario: Usuario sin confirmar no accede
  Dado un usuario registrado sin confirmar su correo
  Cuando inicia sesión con datos correctos
  Entonces ve "Revisa tu correo" con la opción de reenviar
  Y no se abre ninguna sesión
  Y no ve ningún dato financiero

Escenario: Espera progresiva tras intentos fallidos
  Dado que hubo 5 intentos fallidos seguidos para "ana@mail.com"
  Cuando se intenta de nuevo antes de 1 minuto
  Entonces el intento se rechaza mostrando el tiempo restante
  Y no se envía ningún correo de aviso

Escenario: La pestaña de registro continúa sola al confirmar el correo
  Dado que Ana se registró y espera en "Revisa tu correo"
  Cuando abre el enlace de confirmación desde su correo, en otra pestaña o en otro dispositivo
  Entonces la página del enlace solo le dice que la cuenta quedó confirmada
  Y la pestaña donde se registró continúa sola al Onboarding con la sesión iniciada

Escenario: Recuperar la contraseña cierra las demás sesiones
  Dado que Ana tiene sesión en su celular y en su computadora
  Cuando recupera su contraseña desde la computadora
  Entonces la sesión del celular queda revocada
  Y la computadora queda con la sesión iniciada

Escenario: Eliminar la cuenta
  Dado que Ana está en "Eliminar cuenta"
  Cuando ingresa su contraseña correcta y escribe "ELIMINAR"
  Entonces todos sus datos se borran
  Y todas sus sesiones se cierran
  Y recibe un correo de confirmación
```

---

---
## 🔗 Relacionado

- **Módulos:** [[M1 - Acceso y cuenta]] · [[M10 - Onboarding]] · [[M2 - Navegación y estructura]]

