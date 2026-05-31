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

        if (!criteria || Object.keys(criteria).length === 0) {
          set({
            results: [...MOCK_PROPERTIES],
            filteredResults: [...MOCK_PROPERTIES],
            isLoading: false,
            hasSearched: true,
          })
          return
        }

        // ── Smart Scoring System ─────────────────────────────────────────────
        // Instead of strict filtering which can result in 0 matches and a fallback,
        // we score each property based on how well it matches the criteria.
        
        const scoredProperties = MOCK_PROPERTIES.map(p => {
          let score = 0;
          const searchable = `${p.name} ${p.location} ${p.country} ${p.tags.join(' ')} ${p.description}`.toLowerCase()

          // 1. Destination / Vibe (Highest weight: +50)
          if (criteria.destination) {
            const dest = criteria.destination.toLowerCase()
            const vibeMap: Record<string, string[]> = {
              'beach': ['playa', 'beach', 'cancún', 'punta cana', 'florianópolis', 'surf', 'mar', 'costa'],
              'city': ['city', 'ciudad', 'buenos aires', 'montevideo', 'lima', 'méxico', 'urban', 'centro', 'urbano'],
              'mountains': ['montaña', 'mountain', 'andes', 'bariloche', 'chaltén', 'patagonia', 'trekking', 'lodge', 'nieve'],
            }
            
            let vibeMatched = false;
            for (const [, keywords] of Object.entries(vibeMap)) {
              if (keywords.some((k) => dest.includes(k))) {
                if (keywords.some((k) => searchable.includes(k))) {
                  score += 50
                  vibeMatched = true;
                }
                break;
              }
            }
            
            if (!vibeMatched && searchable.includes(dest)) {
              score += 50
            }
          }

          // 2. Budget (Medium weight: +30)
          if (criteria.budget) {
            const budgetStr = String(criteria.budget).toLowerCase()
            let maxPrice = Infinity
            let minPrice = 0
            if (budgetStr.includes('econom') || budgetStr.includes('económico') || budgetStr.includes('barato') || budgetStr.includes('💸')) {
              maxPrice = 60
            } else if (budgetStr.includes('estándar') || budgetStr.includes('standard') || budgetStr.includes('💳')) {
              minPrice = 40; maxPrice = 130
            } else if (budgetStr.includes('confort') || budgetStr.includes('comfort') || budgetStr.includes('✨')) {
              minPrice = 90; maxPrice = 220
            } else if (budgetStr.includes('lujo') || budgetStr.includes('luxury') || budgetStr.includes('👑')) {
              minPrice = 180
            }
            
            if (p.pricePerNight >= minPrice && p.pricePerNight <= maxPrice) {
              score += 30
            } else if (p.pricePerNight < minPrice) {
              // If it's cheaper than expected, that's still pretty good
              score += 15
            }
          }

          // 3. Accommodation Type (Medium weight: +20)
          if (criteria.accommodationType) {
            const typeStr = String(criteria.accommodationType).toLowerCase()
            const typeMap: Record<string, string[]> = {
              'hotel': ['hotel', '🏨'],
              'hostel': ['hostel', '🛏️'],
              'apartment': ['apartamento', 'apartment', 'loft', 'cabaña', '🏠'],
              'resort': ['resort', '🌴'],
              'boutique': ['boutique'],
            }
            
            let typeMatched = false;
            for (const [type, keywords] of Object.entries(typeMap)) {
              if (keywords.some((k) => typeStr.includes(k))) {
                if (p.type === type) {
                  score += 20
                  typeMatched = true;
                }
                break;
              }
            }
            // If the user's strict type didn't match the property type, but they asked for a generic term that matches the description
            if (!typeMatched && searchable.includes(typeStr)) {
               score += 10
            }
          }

          return { property: p, score }
        })

        // Sort by score descending
        scoredProperties.sort((a, b) => b.score - a.score)
        
        // Take top matches (score > 0, or at least the top 3 if everything failed)
        let matched = scoredProperties.filter(sp => sp.score > 0).map(sp => sp.property)
        if (matched.length === 0) {
           matched = scoredProperties.slice(0, 3).map(sp => sp.property) // fallback to best generic options
        }

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
