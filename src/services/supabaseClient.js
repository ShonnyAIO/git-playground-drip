/**
 * Único lugar que crea el cliente de Supabase. Sin las variables de entorno la app funciona
 * en modo invitado (progreso solo en el navegador) y no muestra opciones de cuenta.
 * La clave publicable es pública por diseño: la seguridad la dan las políticas RLS.
 * El cliente se carga de forma diferida (archivo aparte): no retrasa la primera pantalla.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const accountsConfigured = Boolean(url && key);

let clientPromise = null;

export function getSupabase() {
  if (!accountsConfigured) return Promise.resolve(null);
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  }));
  return clientPromise;
}
