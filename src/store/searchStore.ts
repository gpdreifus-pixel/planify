import { create } from 'zustand'
import type { Property, FilterState } from '../types'
import { MOCK_PROPERTIES } from '../data/mockData'

interface SearchState {
  results: Property[]
  filteredResults: Property[]
  selectedProperty: Property | null
  filters: FilterState
  isLoading: boolean
  hasSearched: boolean
  // Actions
  search: () => Promise<void>
  setFilters: (filters: Partial<FilterState>) => void
  applyFilters: () => void
  selectProperty: (id: string) => void
  clearSelection: () => void
  reset: () => void
}

const DEFAULT_FILTERS: FilterState = {
  priceMin: 0,
  priceMax: 500,
  rating: 0,
  types: [],
  amenities: [],
  sortBy: 'recommended',
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  results: [],
  filteredResults: [],
  selectedProperty: null,
  filters: DEFAULT_FILTERS,
  isLoading: false,
  hasSearched: false,

  search: async () => {
    set({ isLoading: true })
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200))
    set({
      results: MOCK_PROPERTIES,
      filteredResults: MOCK_PROPERTIES,
      isLoading: false,
      hasSearched: true,
    })
  },

  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),

  applyFilters: () => {
    const { results, filters } = get()
    let filtered = [...results]

    if (filters.types.length > 0) {
      filtered = filtered.filter((p) => filters.types.includes(p.type))
    }

    filtered = filtered.filter(
      (p) => p.pricePerNight >= filters.priceMin && p.pricePerNight <= filters.priceMax
    )

    if (filters.rating > 0) {
      filtered = filtered.filter((p) => p.rating >= filters.rating)
    }

    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.pricePerNight - b.pricePerNight)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.pricePerNight - a.pricePerNight)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
    }

    set({ filteredResults: filtered })
  },

  selectProperty: (id) => {
    const property = get().results.find((p) => p.id === id) ?? null
    set({ selectedProperty: property })
  },

  clearSelection: () => set({ selectedProperty: null }),

  reset: () =>
    set({
      results: [],
      filteredResults: [],
      selectedProperty: null,
      filters: DEFAULT_FILTERS,
      isLoading: false,
      hasSearched: false,
    }),
}))
