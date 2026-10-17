# Cuentas de estudiante con Supabase

GitPlayground funciona en dos modos:

- **Invitado** (siempre disponible): el progreso vive solo en el navegador.
- **Con cuenta** (si se configura Supabase): el estudiante se registra con correo y
  contraseña y recupera su progreso (XP, medallas, lecciones, módulos y racha) en cualquier
  computadora.

Sin las variables de Supabase, la app no muestra opciones de cuenta ni descarga el cliente:
desplegar el código no cambia nada hasta que el proyecto esté configurado.

## Principios

- **La seguridad la da la base de datos, no el navegador.** Las tablas tienen RLS: cada
  estudiante solo lee y modifica sus propias filas. La clave publicable es pública por
  diseño. La clave secreta (`sb_secret_…` o `service_role`) **nunca** va al frontend ni a
  Netlify.
- **Mínimos datos.** Se guardan el correo (en Supabase Auth), un nombre visible y el
  progreso. El registro explica qué se guarda y exige aceptarlo. Borrar un usuario en
  *Authentication → Users* borra también su perfil y su progreso (en cascada).
- **Nada se pierde al entrar; nada queda al salir.** Al iniciar sesión, el progreso del
  invitado se fusiona con el de la cuenta. Al cerrar sesión se borra el progreso local,
  porque los laboratorios usan computadoras compartidas.

## Puesta en marcha en la nube (una sola vez)

1. **Crear el proyecto** en <https://supabase.com> (plan gratuito) y elegir la región más
   cercana (por ejemplo, *East US*).
2. **Crear las tablas.** En *SQL Editor*, ejecutar el contenido de
   `supabase/migrations/20261017000000_cuentas_y_progreso.sql`. Con la CLI, otra opción es
   `npx supabase link` seguido de `npx supabase db push`.
3. **Configurar la autenticación** en *Authentication → URL Configuration*:
   - *Site URL*: `https://git-playground-ucv.netlify.app`
   - *Redirect URLs*: `https://git-playground-ucv.netlify.app/**`
   - En *Authentication → Sign In / Providers → Email*: longitud mínima de contraseña 8.
4. **Correo: decisión obligatoria.** El servicio de correo que trae Supabase **solo envía a
   los miembros del equipo del proyecto y como máximo 2 correos por hora**
   ([documentación](https://supabase.com/docs/guides/auth/auth-smtp)). Con él, los
   estudiantes no reciben ni la confirmación ni la recuperación de contraseña. Hay dos
   opciones:
   - **Recomendada:** configurar un SMTP propio en *Authentication → Emails → SMTP
     Settings*, con un proveedor de plan gratuito (Brevo, Resend o una cuenta de Gmail con
     contraseña de aplicación). La confirmación de correo queda activa y la recuperación
     de contraseña funciona.
   - **Piloto rápido:** desactivar *Confirm email*. El registro inicia sesión de inmediato
     (la app ya lo maneja), pero la recuperación de contraseña sigue dependiendo del
     correo.
5. **Conectar Netlify.** En *Site configuration → Environment variables*, crear las dos
   variables y volver a desplegar:
   - `VITE_SUPABASE_URL`: *Project Settings → API → Project URL*
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: *Project Settings → API Keys → Publishable key*

## Desarrollo local

```bash
npx supabase start
```

Levanta Supabase en Docker y aplica las migraciones. Los correos no salen a internet: se ven
en Mailpit (<http://127.0.0.1:54324>). Copia la *API URL* y la *Publishable key* de
`npx supabase status` a `.env.local` (git lo ignora; la plantilla está en `.env.example`) y
ejecuta `npm run dev`.

Verificación:

- `node scripts/rls_check.mjs`: aislamiento entre estudiantes (RLS).
- `uv run --with playwright==1.57.0 python tests/account_flow.py`: registro, confirmación,
  fusión, guardado, salida, ingreso en otro dispositivo y recuperación de contraseña.
  Requiere `npm run dev`.

## Dónde está en el código

- `supabase/migrations/`: esquema, políticas RLS y disparadores.
- `src/services/supabaseClient.js`: único lugar que crea el cliente (carga diferida).
- `src/state/useAccount.js`: sesión y sincronización. Es el único que habla con Supabase.
- `src/state/learnerStore.js`: fusión (`mergeLearnerStates`) y racha (`computeStreak`),
  ambas funciones puras con tests.
- `src/components/AccountDialog.jsx`: ingreso, registro, recuperación y nueva contraseña.
