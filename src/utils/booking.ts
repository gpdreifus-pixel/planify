import type { TripSearchCriteria } from '../types'

/** Lógica compartida para derivar fechas/noches/viajeros desde las respuestas
 *  del chat. Antes vivía duplicada (y desincronizada) en BookingScreen,
 *  mientras TripDetail mostraba un desglose estático que contradecía la
 *  propiedad en pantalla. */

export function getCheckInDate(criteria: TripSearchCriteria): string {
  const raw = criteria.departureDate ?? ''
  // Primero intenta una fecha ISO explícita
  const parsed = new Date(raw)
  if (!isNaN(parsed.getTime()) && raw.match(/\d{4}-\d{2}-\d{2}/)) {
    return raw
  }
  // Default: el próximo sábado
  const today = new Date()
  const daysUntilSat = (6 - today.getDay() + 7) % 7 || 7
  const nextSat = new Date(today)
  nextSat.setDate(today.getDate() + daysUntilSat)
  return nextSat.toISOString().split('T')[0]
}

export function getNights(criteria: TripSearchCriteria): number {
  const raw = (criteria.returnDate ?? '').toLowerCase()
  // Respuestas de chips tipo "Un finde 2d", "Una semana 7d", "Dos semanas 14d"
  const match = raw.match(/(\d+)\s*d/)
  if (match) return parseInt(match[1], 10)
  if (raw.includes('finde') || raw.includes('weekend')) return 2
  if (raw.includes('semana') && raw.includes('dos')) return 14
  if (raw.includes('semana')) return 7
  return 7 // default
}

export function getTravelers(criteria: TripSearchCriteria): number {
  if (typeof criteria.travelers === 'number') return criteria.travelers
  const raw = String(criteria.travelers ?? '').toLowerCase()
  if (raw.includes('solo') || raw.includes('🧳')) return 1
  if (raw.includes('pareja') || raw.includes('💑')) return 2
  if (raw.includes('amigos') || raw.includes('👯')) return 4
  if (raw.includes('familia') || raw.includes('👨')) return 4
  const num = parseInt(raw, 10)
  if (!isNaN(num) && num > 0) return num
  return 1
}

/** Desglose de precio de una estadía: base + impuestos estimados (8%). */
export function getPriceBreakdown(pricePerNight: number, nights: number) {
  const base = pricePerNight * nights
  const taxes = Math.round(base * 0.08)
  return { base, taxes, service: 0, total: base + taxes }
}
