/** Traduce errores de Supabase Auth a mensajes en español con una acción clara. */
const BY_CODE = {
  invalid_credentials: 'Correo o contraseña incorrectos.',
  email_not_confirmed: 'Aún no confirmas tu correo. Revisa tu bandeja de entrada (y la de spam).',
  user_already_exists: 'Ya existe una cuenta con ese correo. Prueba a iniciar sesión.',
  weak_password: 'La contraseña es muy débil: usa al menos 8 caracteres, combinando letras y números.',
  same_password: 'La nueva contraseña debe ser distinta de la anterior.',
  over_email_send_rate_limit: 'Se enviaron demasiados correos. Espera unos minutos e inténtalo de nuevo.',
  over_request_rate_limit: 'Demasiados intentos seguidos. Espera unos segundos e inténtalo de nuevo.',
  email_address_invalid: 'Ese correo no parece válido. Revísalo.',
  signup_disabled: 'El registro de cuentas está deshabilitado en este momento.',
};

export function authErrorMessage(error) {
  if (!error) return '';
  if (error.code && BY_CODE[error.code]) return BY_CODE[error.code];
  const msg = String(error.message || '');
  if (/fetch|network|Failed to fetch/i.test(msg) || error.name === 'AuthRetryableFetchError') {
    return 'No hay conexión con el servidor. Tu progreso sigue guardado en este navegador; inténtalo más tarde.';
  }
  if (/Invalid login credentials/i.test(msg)) return BY_CODE.invalid_credentials;
  if (/Email not confirmed/i.test(msg)) return BY_CODE.email_not_confirmed;
  return 'Ocurrió un problema inesperado. Inténtalo de nuevo en unos segundos.';
}
