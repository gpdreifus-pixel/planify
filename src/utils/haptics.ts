/** Vibración háptica sutil para confirmar acciones (like, guardar, reservar).
 *  navigator.vibrate solo existe en Android/Chrome — en iOS Safari degrada
 *  en silencio, que es exactamente lo que queremos. */
export function haptic(ms = 10) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(ms)
  }
}
