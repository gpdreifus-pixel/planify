import { describe, it, expect, vi, beforeAll } from 'vitest'
import type { TripSearchCriteria } from '../types'

// El store persiste en localStorage y sincroniza con Supabase — para testear
// el scoring alcanza con neutralizar ambos.
vi.mock('../utils/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  },
  isSupabaseConfigured: false,
}))
vi.mock('../services/db', () => ({
  fetchSavedPropertyIds: async () => [],
  saveProperty: async () => {},
  unsaveProperty: async () => {},
}))

beforeAll(() => {
  const store = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
    configurable: true,
  })
})

describe('searchStore — smart scoring', () => {
  it('una búsqueda de playa devuelve resultados rankeados (no vacío)', async () => {
    const { useSearchStore } = await import('./searchStore')
    // Los chips del chat guardan strings con emoji — el tipo es más estricto
    // que el runtime, igual que travelers
    const criteria = { destination: 'Playa 🏖️', budget: 'Económico 💸' } as unknown as TripSearchCriteria
    await useSearchStore.getState().search(criteria)
    const { filteredResults, hasSearched, isLoading } = useSearchStore.getState()
    expect(hasSearched).toBe(true)
    expect(isLoading).toBe(false)
    expect(filteredResults.length).toBeGreaterThan(0)
  }, 10000)

  it('criterios sin match caen al fallback de top 3 genéricos', async () => {
    const { useSearchStore } = await import('./searchStore')
    await useSearchStore.getState().search({ destination: 'xyzzy-destino-inexistente' })
    expect(useSearchStore.getState().filteredResults.length).toBe(3)
  }, 10000)

  it('resetFilters restaura los defaults y re-aplica sobre los resultados', async () => {
    const { useSearchStore } = await import('./searchStore')
    const s = useSearchStore.getState()
    s.setFilters({ priceMax: 50, rating: 4.5 })
    expect(useSearchStore.getState().filters.priceMax).toBe(50)

    s.resetFilters()
    const { filters } = useSearchStore.getState()
    expect(filters.priceMax).toBe(500)
    expect(filters.rating).toBe(0)
    expect(filters.types).toEqual([])
    expect(filters.sortBy).toBe('recommended')
  })
})
