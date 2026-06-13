import { describe, it, expect, vi } from 'vitest'

// El hook usePriceFormatter depende del authStore (que arrastra Supabase) —
// para testear la conversión pura alcanza con mockear el módulo del store.
vi.mock('../store/authStore', () => ({
  useAuthStore: () => 'USD',
}))

import { formatPrice } from './currency'

describe('formatPrice', () => {
  it('USD sin conversión', () => {
    expect(formatPrice(120, 'USD')).toBe('US$120')
  })

  it('convierte a EUR con tasa fija', () => {
    expect(formatPrice(100, 'EUR')).toBe('€92')
  })

  it('convierte a ARS con separador de miles es-AR', () => {
    expect(formatPrice(120, 'ARS')).toBe('AR$177.600')
  })

  it('redondea montos no enteros', () => {
    expect(formatPrice(99.6, 'USD')).toBe('US$100')
  })
})
