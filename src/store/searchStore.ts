import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Property, FilterState, RecentSearch, TripSearchCriteria } from '../types'
import { MOCK_PROPERTIES } from '../data/mockData'
import { supabase } from '../utils/supabase'
import { fetchSavedPropertyIds, saveProperty, unsaveProperty } from '../services/db'

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
  syncSavedProperties: (userId: string) => Promise<void>
  clearSavedProperties: () => void
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
    (set, get) => {
      // ── Cloud sync (called by authStore) ───────────────────────────────────

      return {
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

        let matched = [...MOCK_PROPERTIES]

        if (criteria && Object.keys(criteria).length > 0) {
          // ── Filter by destination / vibe ──────────────────────────────────
          if (criteria.destination) {
            const dest = criteria.destination.toLowerCase()
            // Map chip vibes to keywords
            const vibeMap: Record<string, string[]> = {
              'beach': ['playa', 'beach', 'cancún', 'punta cana', 'florianópolis', 'surf', 'mar', 'costa'],
              'city': ['city', 'ciudad', 'buenos aires', 'montevideo', 'lima', 'méxico', 'urban', 'centro'],
              'mountains': ['montaña', 'mountain', 'andes', 'bariloche', 'chaltén', 'patagonia', 'trekking', 'lodge'],
            }

            // Check if the destination matches a vibe keyword
            let vibeKeywords: string[] = []
            for (const [, keywords] of Object.entries(vibeMap)) {
              if (keywords.some((k) => dest.includes(k))) {
                vibeKeywords = keywords
                break
              }
            }

            if (vibeKeywords.length > 0) {
              const vibeMatched = matched.filter((p) => {
                const searchable = `${p.name} ${p.location} ${p.country} ${p.tags.join(' ')} ${p.description}`.toLowerCase()
                return vibeKeywords.some((k) => searchable.includes(k))
              })
              if (vibeMatched.length > 0) matched = vibeMatched
            } else {
              // Direct text match on name, location, country
              const textMatched = matched.filter((p) => {
                const searchable = `${p.name} ${p.location} ${p.country}`.toLowerCase()
                return searchable.includes(dest)
              })
              if (textMatched.length > 0) matched = textMatched
            }
          }

          // ── Filter by budget ─────────────────────────────────────────────
          if (criteria.budget) {
            const budgetStr = (typeof criteria.budget === 'string' ? criteria.budget : '').toLowerCase()
            let maxPrice = Infinity
            let minPrice = 0
            if (budgetStr.includes('econom') || budgetStr.includes('económico') || budgetStr.includes('barato')) {
              maxPrice = 50
            } else if (budgetStr.includes('estándar') || budgetStr.includes('standard')) {
              minPrice = 40; maxPrice = 120
            } else if (budgetStr.includes('confort') || budgetStr.includes('comfort')) {
              minPrice = 80; maxPrice = 200
            } else if (budgetStr.includes('lujo') || budgetStr.includes('luxury') || budgetStr.includes('👑')) {
              minPrice = 150
            }
            if (maxPrice < Infinity || minPrice > 0) {
              const budgetMatched = matched.filter(
                (p) => p.pricePerNight >= minPrice && p.pricePerNight <= maxPrice
              )
              if (budgetMatched.length > 0) matched = budgetMatched
            }
          }

          // ── Filter by accommodation type ─────────────────────────────────
          if (criteria.accommodationType) {
            const typeStr = (typeof criteria.accommodationType === 'string' ? criteria.accommodationType : '').toLowerCase()
            const typeMap: Record<string, string[]> = {
              'hotel': ['hotel'],
              'hostel': ['hostel'],
              'apartment': ['apartamento', 'apartment', 'loft', 'cabaña'],
              'resort': ['resort'],
              'boutique': ['boutique'],
            }
            const matchTypes: string[] = []
            for (const [type, keywords] of Object.entries(typeMap)) {
              if (keywords.some((k) => typeStr.includes(k))) {
                matchTypes.push(type)
                break
              }
            }
            if (matchTypes.length > 0) {
              const typeMatched = matched.filter((p) => matchTypes.includes(p.type))
              if (typeMatched.length > 0) matched = typeMatched
            }
          }
        }

        // If filters were too restrictive and nothing matched, fall back to all
        if (matched.length === 0) matched = [...MOCK_PROPERTIES]

        set({
          results: matched,
          filteredResults: matched,
          isLoading: false,
          hasSearched: true,
        })
        // Record the search in recent history if criteria provided
        if (criteria && Object.keys(criteria).length > 0) {
          get().addRecentSearch(criteria, matched.length)
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
        const wasSaved = get().savedPropertyIds.includes(id)
        set((state) => ({
          savedPropertyIds: wasSaved
            ? state.savedPropertyIds.filter((sid) => sid !== id)
            : [...state.savedPropertyIds, id],
        }))
        // Cloud write — fire-and-forget
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            if (wasSaved) unsaveProperty(session.user.id, id)
            else saveProperty(session.user.id, id)
          }
        })
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

      syncSavedProperties: async (userId) => {
        const cloudIds = await fetchSavedPropertyIds(userId)
        const localIds = get().savedPropertyIds
        const localOnly = localIds.filter((id) => !cloudIds.includes(id))
        for (const id of localOnly) {
          saveProperty(userId, id)
        }
        const merged = Array.from(new Set([...localIds, ...cloudIds]))
        set({ savedPropertyIds: merged })
      },

      clearSavedProperties: () => set({ savedPropertyIds: [] }),
    }
    },
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
