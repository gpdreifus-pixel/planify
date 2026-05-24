import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Trip, Property, TripSearchCriteria } from '../types'
import { MOCK_TRIPS } from '../data/mockData'

interface TripsState {
  trips: Trip[]
  activeTrip: Trip | null
  // Actions
  loadTrips: () => void
  bookTrip: (property: Property, criteria: TripSearchCriteria, checkIn: string, checkOut: string, travelers: number) => Trip
  setActiveTrip: (tripId: string) => void
  cancelTrip: (tripId: string) => void
  addNote: (tripId: string, note: string) => void
}

export const useTripsStore = create<TripsState>()(
  persist(
    (set, get) => ({
      trips: MOCK_TRIPS,
      activeTrip: null,

      loadTrips: () => {
        if (get().trips.length === 0) {
          set({ trips: MOCK_TRIPS })
        }
      },

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
    }
  )
)
