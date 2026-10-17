# Registro de decisiones (consolidado)

De menos a más seguras. **Revisa primero:** N1 (correo en la nube) y N2 (salir borra el equipo).

## Necesitan tu decisión (con valor provisional)

- **N1. Correo en producción — confianza baja.** El correo por defecto de Supabase no llega
  a los estudiantes. Provisional: documentar dos salidas en `docs/supabase.md` (SMTP propio,
  recomendado; o desactivar la confirmación para un piloto). El código funciona con ambas.
- **N2. Cerrar sesión borra el progreso del equipo — confianza media.** Pensado para las
  computadoras compartidas de laboratorio. En un equipo personal, el estudiante vuelve a
  entrar y lo recupera de la cuenta. Alternativa: conservarlo como invitado.
- **N3. Qué cuenta como "practicar" para la racha — confianza media.** Completar un módulo,
  una lección o ganar una medalla, y solo si cambia algo. Abrir la app o ver una lección sin
  terminarla no cuenta.

## Sólidas

- **Fusión por unión al entrar** (nunca reemplazo): no se pierde lo hecho como invitado.
- **La racha vive en el estado del estudiante** (`activeDays`, últimos 60 días), no en una
  tabla aparte: funciona igual para invitados y se sincroniza con el resto del progreso.
- **Racha válida si el último día activo es hoy o ayer**; fecha local del estudiante.
- **Medallas de racha otorgadas por el store** y anunciadas por Nova; las que llegan de la
  cuenta al entrar no se re-anuncian.
- **XP**: las dos medallas nuevas suman 100 XP cada una, con la fórmula existente.
- **Pestaña y tema no se sincronizan** (son del dispositivo).
- **Guardado agrupado cada ~1,2 s**, más guardado al ocultar la pestaña y antes de salir.
- **Si falla la lectura al entrar**, no se fusiona ni se guarda; se reintenta en el próximo
  evento de sesión.
- **Reiniciar progreso con sesión iniciada también reinicia la cuenta**, y el aviso lo dice.
- **Registro con aceptación explícita** de qué datos se guardan; nombre visible de 1 a 40
  caracteres; contraseña de 8 o más.
- **Cliente de Supabase con carga diferida** (archivo aparte de 55 kB comprimidos).
- **Mensajes de error traducidos por código** (`authErrors.js`), con un mensaje genérico de
  respaldo; el registro no revela si un correo ya existe cuando la confirmación está activa.
- **Desarrollo y pruebas solo contra Supabase local**; sin cuentas en la nube ni manejo de
  credenciales de Shonny.
