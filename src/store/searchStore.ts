import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Property, FilterState, RecentSearch, TripSearchCriteria } from '../types'
import { MOCK_PROPERTIES } from '../data/mockData'

interface SearchState {
  results: Property[]
  filteredResults: Property[]
  selectedProperty: Property | null
  filters: FilterState
  isLoading: boolean
  hasSearched: boolean
  recentSearches: RecentSearch[]
  savedPropertyIds: string[]
  viewedPropertyIds: string[]
  // Actions
  search: (criteria?: TripSearchCriteria) => Promise<void>
  setFilters: (filters: Partial<FilterState>) => void
  applyFilters: () => void
  selectProperty: (id: string) => void
  clearSelection: () => void
  reset: () => void
  addRecentSearch: (criteria: TripSearchCriteria, resultsCount: number) => void
  toggleSavedProperty: (id: string) => void
  isPropertySaved: (id: string) => boolean
  markPropertyViewed: (id: string) => void
}

const DEFAULT_FILTERS: FilterState = {
  priceMin: 0,
  priceMax: 500,
  rating: 0,
  types: [],
  amenities: [],
  sortBy: 'recommended',
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      results: [],
      filteredResults: [],
      selectedProperty: null,
      filters: DEFAULT_FILTERS,
      isLoading: false,
      hasSearched: false,
      recentSearches: [],
      savedPropertyIds: [],
      viewedPropertyIds: [],

      search: async (criteria) => {
        set({ isLoading: true })
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1200))
        set({
          results: MOCK_PROPERTIES,
          filteredResults: MOCK_PROPERTIES,
          isLoading: false,
          hasSearched: true,
        })
        // Record the search in recent history if criteria provided
        if (criteria && Object.keys(criteria).length > 0) {
          get().addRecentSearch(criteria, MOCK_PROPERTIES.length)
        }
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
        // Track as viewed
        if (id) get().markPropertyViewed(id)
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

      // ── Persistence-specific actions ─────────────────────────────────────

      addRecentSearch: (criteria, resultsCount) => {
        const newSearch: RecentSearch = {
          id: `search-${Date.now()}`,
          criteria,
          timestamp: new Date().toISOString(),
          resultsCount,
        }
        set((state) => ({
          recentSearches: [
            newSearch,
            // Deduplicate by destination and keep last 5
            ...state.recentSearches
              .filter((s) => s.criteria.destination !== criteria.destination)
              .slice(0, 4),
          ],
        }))
      },

      toggleSavedProperty: (id) => {
        set((state) => ({
          savedPropertyIds: state.savedPropertyIds.includes(id)
            ? state.savedPropertyIds.filter((sid) => sid !== id)
            : [...state.savedPropertyIds, id],
        }))
      },

      isPropertySaved: (id) => get().savedPropertyIds.includes(id),

      markPropertyViewed: (id) => {
        set((state) => ({
          viewedPropertyIds: [
            id,
            // Deduplicate and cap at 20 most recent
            ...state.viewedPropertyIds.filter((vid) => vid !== id).slice(0, 19),
          ],
        }))
      },
    }),
    {
      name: 'planify-search',
      partialize: (state) => ({
        filters: state.filters,
        hasSearched: state.hasSearched,
        results: state.results,
        filteredResults: state.filteredResults,
        recentSearches: state.recentSearches,
        savedPropertyIds: state.savedPropertyIds,
        viewedPropertyIds: state.viewedPropertyIds,
        // selectedProperty and isLoading are session-only — not persisted
      }),
    }
  )
)
