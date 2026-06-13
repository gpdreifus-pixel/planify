import { describe, it, expect } from 'vitest'
import { getCheckInDate, getNights, getTravelers, getPriceBreakdown } from './booking'
import type { TripSearchCriteria } from '../types'

// El tipo declara travelers: number, pero los chips del chat guardan strings
// ("En pareja 💑") — getTravelers maneja ambos. El cast refleja esa realidad.
const withTravelers = (travelers: string | number): TripSearchCriteria =>
  ({ travelers } as unknown as TripSearchCriteria)

describe('getNights', () => {
  it('parsea las respuestas de chips con días explícitos', () => {
    expect(getNights({ returnDate: 'Un finde 2d' })).toBe(2)
    expect(getNights({ returnDate: 'Una semana 7d' })).toBe(7)
    expect(getNights({ returnDate: 'Dos semanas 14d' })).toBe(14)
    expect(getNights({ returnDate: '10d' })).toBe(10)
  })

  it('entiende texto libre sin números', () => {
    expect(getNights({ returnDate: 'un finde' })).toBe(2)
    expect(getNights({ returnDate: 'una semana' })).toBe(7)
    expect(getNights({ returnDate: 'dos semanas' })).toBe(14)
  })

  it('usa 7 noches por defecto', () => {
    expect(getNights({})).toBe(7)
    expect(getNights({ returnDate: 'no sé todavía' })).toBe(7)
  })
})

describe('getTravelers', () => {
  it('mapea las respuestas de chips', () => {
    expect(getTravelers(withTravelers('Solo 🧳'))).toBe(1)
    expect(getTravelers(withTravelers('En pareja 💑'))).toBe(2)
    expect(getTravelers(withTravelers('Con amigos 👯'))).toBe(4)
    expect(getTravelers(withTravelers('En familia 👨‍👩‍👧'))).toBe(4)
  })

  it('acepta números directos (texto o number)', () => {
    expect(getTravelers(withTravelers('3'))).toBe(3)
    expect(getTravelers(withTravelers(5))).toBe(5)
  })

  it('default 1 viajero', () => {
    expect(getTravelers({})).toBe(1)
  })
})

describe('getCheckInDate', () => {
  it('respeta una fecha ISO explícita', () => {
    expect(getCheckInDate({ departureDate: '2026-07-15' })).toBe('2026-07-15')
  })

  it('devuelve una fecha futura válida cuando no hay ISO', () => {
    const result = getCheckInDate({ departureDate: 'el mes que viene' })
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(new Date(result).getTime()).toBeGreaterThan(Date.now())
  })
})

describe('getPriceBreakdown', () => {
  it('calcula base + 8% de impuestos', () => {
    const b = getPriceBreakdown(120, 7)
    expect(b.base).toBe(840)
    expect(b.taxes).toBe(67)
    expect(b.service).toBe(0)
    expect(b.total).toBe(907)
  })

  it('escala con el precio de la propiedad (no es estático)', () => {
    const b = getPriceBreakdown(300, 2)
    expect(b.base).toBe(600)
    expect(b.total).toBe(648)
  })
})
