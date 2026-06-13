import { useCallback } from 'react'
import { useAuthStore } from '../store/authStore'
import type { UserPreferences } from '../types'

export type Currency = UserPreferences['currency']

/** Tasas fijas de demo respecto al USD (los precios mock están en USD).
 *  En producción vendrían de una API de cambio. */
const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  ARS: 1480,
}

const SYMBOLS: Record<Currency, string> = {
  USD: 'US$',
  EUR: '€',
  ARS: 'AR$',
}

/** Convierte un monto en USD a la moneda elegida y lo formatea con símbolo. */
export function formatPrice(usdAmount: number, currency: Currency = 'USD'): string {
  const value = usdAmount * RATES[currency]
  // ARS sin decimales y con separador de miles; USD/EUR redondeado simple
  const rounded = Math.round(value)
  return `${SYMBOLS[currency]}${rounded.toLocaleString('es-AR')}`
}

/** Hook: formateador atado a la moneda elegida en preferencias.
 *  Se suscribe al store, así toda la UI de precios reacciona al cambio.
 *  `fmt` es estable por moneda (useCallback) — apto como dep de effects. */
export function usePriceFormatter() {
  const currency = useAuthStore((s) => s.userPreferences.currency)
  const fmt = useCallback((usdAmount: number) => formatPrice(usdAmount, currency), [currency])
  return { currency, fmt }
}
