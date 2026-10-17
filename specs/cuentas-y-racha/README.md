# Cuentas de estudiante (Supabase) y racha diaria

## Next Agent Prompt

> Última actualización: 2026-10-17. Estado: **plan aprobado; implementación en curso.**
>
> Trabajas en la rama `feat/cuentas-supabase` (nunca en `main`). Supabase corre en local
> con `npx supabase start` (Docker). No crees cuentas ni proyectos en la nube y no manejes
> credenciales de Shonny: el proyecto en supabase.com y las variables de Netlify las
> configura él siguiendo `docs/supabase.md`.
>
> Toma el primer slice sin marcar, cúmplelo, verifica, haz commit y actualiza esta sección.

### TODO global

- [x] 01 — Racha diaria (pura, también para invitados) y medallas de racha
- [x] 02 — Fusión de progresos (pura)
- [ ] 03 — Esquema Supabase: perfiles, progreso, RLS y prueba de aislamiento
- [ ] 04 — Cliente opcional y sesión (la app sigue funcionando sin Supabase)
- [ ] 05 — Interfaz de cuenta: registro, ingreso, salida, recuperación, aviso de privacidad
- [ ] 06 — Sincronización del progreso con la cuenta
- [ ] 07 — Cierre: E2E, documentación (`docs/supabase.md`, README, TUC), revisión

## Objetivo

Que el estudiante pueda **crear una cuenta con correo y contraseña** y encontrar su
progreso (XP, medallas, lecciones, módulos y racha) en cualquier computadora, por ejemplo
en los laboratorios de la UCV. Se suma una mecánica de gamificación acotada al MVP: la
**racha diaria** (días seguidos practicando), con medallas a los 3 y 7 días.

## Decisiones (Shonny, 2026-10-17)

| Decisión | Alternativas descartadas |
|---|---|
| Supabase como backend | Firebase |
| Acceso con correo + contraseña | Enlace mágico (límite de correos), GitHub OAuth (configuración extra) |
| Gamificación: solo racha diaria | Ranking por sección, panel docente, historial de logros (quedan para después) |
| Desarrollo con Supabase local (Docker); la nube la crea Shonny al final | Trabajar directo contra un proyecto en la nube |

## Decisiones por defecto (reversibles, anotadas en choices.md)

- **Modo invitado se mantiene**: sin cuenta todo funciona como hoy (progreso en el navegador).
  Sin variables de Supabase configuradas, la app ni siquiera muestra el botón de cuenta.
- **Al ingresar se fusiona** el progreso del invitado con el de la cuenta (se conserva lo
  mejor de ambos: unión de medallas, lecciones, módulos y días de actividad).
- **Al cerrar sesión se borra el progreso local** (computadoras compartidas de laboratorio):
  el siguiente estudiante empieza de cero y el progreso queda a salvo en la cuenta.
- **La racha se calcula en el cliente** a partir de los días con actividad guardados en el
  propio estado del estudiante; no hay tabla aparte. Cuenta como actividad: completar un
  módulo, desbloquear una medalla o completar una lección. La racha sigue viva si el último
  día activo es hoy o ayer.
- **Sin migraciones del estado local**: el campo nuevo `activeDays` se agrega con valor
  vacío al leer datos viejos (`sanitize`), sin subir la versión.
- **Privacidad**: se guarda solo correo (en Supabase Auth), nombre visible y progreso. El
  registro muestra qué se guarda y para qué, y exige aceptarlo.

## Dueños únicos (invariantes)

- `src/state/learnerStore.js` sigue siendo el único dueño del estado del estudiante; la
  racha (`computeStreak`) y la fusión (`mergeLearnerStates`) son funciones puras suyas.
- `src/services/supabaseClient.js` es el único lugar que crea el cliente; devuelve `null`
  si faltan las variables `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
- `src/state/useAccount.js` es el único dueño de la sesión y de la sincronización; los
  componentes no llaman a Supabase directamente.
- El esquema vive en `supabase/migrations/`; la seguridad la garantiza RLS (cada usuario
  solo lee y escribe sus filas), no el cliente.

## Puertas de verificación

- `npm test`, `npm run lint` (0 errores), `npm run build`.
- Prueba de aislamiento RLS contra Supabase local: un usuario no puede leer ni escribir el
  progreso de otro.
- Suite E2E (`tests/playwright_ux_suite.py`) en verde, más el flujo registro → progreso →
  salir → entrar desde otro navegador → progreso restaurado.
- `scripts/a11y.py` sin bloqueantes, incluido el diálogo de cuenta abierto.
