# Cuentas de estudiante (Supabase) y racha diaria (cerrado)

Rama `feat/cuentas-supabase`, cerrada el 2026-10-17. Guía operativa: [docs/supabase.md](../../../docs/supabase.md).
Decisiones tomadas sin indicación explícita: [choices.md](choices.md).

## Qué existe y por qué

El estudiante puede crear una cuenta con correo y contraseña y recuperar su progreso (XP,
medallas, lecciones, módulos y racha) en cualquier computadora, como las de los
laboratorios de la UCV. La gamificación suma una sola mecánica, acotada al MVP: la **racha
diaria**, con medallas a los 3 y 7 días.

Shonny eligió: Supabase (frente a Firebase), correo y contraseña (frente a enlace mágico o
GitHub OAuth), solo la racha como mecánica nueva (ranking, panel docente e historial
quedaron fuera) y desarrollo con Supabase local antes de la nube.

## Invariantes

- **Modo invitado intacto.** Sin `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`, la
  app no muestra la cuenta, no descarga el cliente y no hace llamadas de red.
- **La seguridad la da RLS**, no el cliente: cada usuario solo lee y escribe sus filas; el
  progreso tiene un tope de tamaño; borrar la cuenta borra perfil y progreso (cascada).
- **Nada se pierde al entrar:** progreso local y de la cuenta se fusionan (unión, nunca
  reemplazo). Si la lectura de la cuenta falla, no se fusiona ni se guarda.
- **Nada queda al salir:** cerrar sesión limpia el equipo, pero solo después de guardar lo
  pendiente; si no se puede guardar, pregunta.
- **Un dueño por concepto:** `learnerStore` posee el estado, la racha (`computeStreak`) y la
  fusión (`mergeLearnerStates`); `useAccount` es el único que habla con Supabase;
  `supabaseClient` es el único que crea el cliente.
- **El reducer es puro:** la fecha del día entra en las acciones (`useLearner` la inyecta).

## Dónde está

`supabase/migrations/`, `src/services/supabaseClient.js`, `src/services/authErrors.js`,
`src/state/useAccount.js`, `src/state/learnerStore.js`, `src/components/AccountDialog.jsx`.
Pruebas: `src/state/learnerStore.test.js` (racha, fusión, hidratación),
`scripts/rls_check.mjs` (11 comprobaciones de aislamiento), `tests/account_flow.py`
(9 casos contra Supabase local), `scripts/a11y.py` (incluye el diálogo).

## Callejones y hallazgos

- El servicio de correo por defecto de Supabase solo envía al equipo del proyecto y 2
  correos/hora: en la nube hace falta SMTP propio o desactivar la confirmación.
- Un objeto de acciones recreado en cada render reiniciaba el foco del diálogo con cada
  tecla: las acciones son estables (`useMemo`/`useCallback`).
- Las etiquetas que envolvían botón y ayuda daban al campo de contraseña un nombre
  accesible incorrecto: etiquetas explícitas con `htmlFor`.
- El cliente completo sumaba 60 kB comprimidos para todos: se carga de forma diferida.
- Postgres comprime el JSON: la prueba del tope de tamaño usa contenido aleatorio.
