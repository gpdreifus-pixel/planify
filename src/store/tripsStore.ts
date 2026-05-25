import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Trip, Property, TripSearchCriteria } from '../types'

interface TripsState {
  trips: Trip[]
  activeTrip: Trip | null
  // Actions
  bookTrip: (property: Property, criteria: TripSearchCriteria, checkIn: string, checkOut: string, travelers: number) => Trip
  setActiveTrip: (tripId: string) => void
  cancelTrip: (tripId: string) => void
  addNote: (tripId: string, note: string) => void
}

export const useTripsStore = create<TripsState>()(
  persist(
    (set, get) => ({
      // Fresh users start with no trips — continuity is built through real actions.
      trips: [],
      activeTrip: null,

      bookTrip: (property, criteria, checkIn, checkOut, travelers) => {
        const nights =
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
        const newTrip: Trip = {
          id: `trip-${Date.now()}`,
          property,
          criteria,
          status: 'confirmed',
          bookedAt: new Date().toISOString(),
          checkIn,
          checkOut,
          totalPrice: property.pricePerNight * nights * travelers,
          currency: property.currency,
          travelers,
          confirmationCode: `PLF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        }
        set((state) => ({ trips: [newTrip, ...state.trips] }))
        return newTrip
      },

      setActiveTrip: (tripId) => {
        const trip = get().trips.find((t) => t.id === tripId) ?? null
        set({ activeTrip: trip })
      },

      cancelTrip: (tripId) => {
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId ? { ...t, status: 'cancelled' } : t
          ),
        }))
      },

      addNote: (tripId, note) => {
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId ? { ...t, notes: note } : t
          ),
        }))
      },
    }),
    {
      name: 'planify-trips',
      // v1: initial state no longer seeds MOCK_TRIPS. Migration strips the
      // two hardcoded demo trips ('trip-1', 'trip-2') from any existing
      // localStorage so returning sessions also start clean. User-created
      // trips (IDs like 'trip-<timestamp>') are preserved untouched.
      version: 1,
      migrate: (persisted) => {
        const state = persisted as { trips?: Trip[] }
        return {
          trips: (state.trips ?? []).filter(
            (t) => t.id !== 'trip-1' && t.id !== 'trip-2'
          ),
        }
      },
      // activeTrip is a session-level pointer — do not persist it.
      // Restoring a stale activeTrip reference after a reload would
      // show the wrong trip detail, so we derive it on demand instead.
      partialize: (state) => ({ trips: state.trips }),
    }
  )
)
