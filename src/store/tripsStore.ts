import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Trip, Property, TripSearchCriteria } from '../types'
import { supabase } from '../utils/supabase'
import { fetchUserTrips, upsertTrip, updateTripStatus } from '../services/db'

interface TripsState {
  trips: Trip[]
  activeTrip: Trip | null
  // Actions
  bookTrip: (
    property: Property,
    criteria: TripSearchCriteria,
    checkIn: string,
    checkOut: string,
    travelers: number
  ) => Trip
  setActiveTrip: (tripId: string) => void
  cancelTrip: (tripId: string) => void
  addNote: (tripId: string, note: string) => void
}

export const useTripsStore = create<TripsState>()(
  persist(
    (set, get) => {
      // ── Cloud sync ─────────────────────────────────────────────────────────
      // INITIAL_SESSION: restore session from localStorage on page reload.
      // SIGNED_IN: user just authenticated.
      // Both events fetch the user's trips from Supabase and merge with any
      // trips created locally while the user was a guest.
      // SIGNED_OUT: clear trips so the next session starts clean.
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (
          (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') &&
          session?.user
        ) {
          const userId = session.user.id
          const cloudTrips = await fetchUserTrips(userId)
          const localTrips = get().trips
          const cloudIds = new Set(cloudTrips.map((t) => t.id))
          // Guest-created trips not yet in the cloud — sync them up
          const guestOnly = localTrips.filter((t) => !cloudIds.has(t.id))
          for (const trip of guestOnly) {
            upsertTrip(userId, trip) // fire-and-forget
          }
          // Merged: cloud trips (canonical) + any local-only guest trips
          set({ trips: [...cloudTrips, ...guestOnly] })
        } else if (event === 'SIGNED_OUT') {
          set({ trips: [], activeTrip: null })
        }
      })

      return {
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
          // Cloud write — fire-and-forget; Zustand is the source of truth
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) upsertTrip(session.user.id, newTrip)
          })
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
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) updateTripStatus(tripId, 'cancelled')
          })
        },

        addNote: (tripId, note) => {
          set((state) => ({
            trips: state.trips.map((t) =>
              t.id === tripId ? { ...t, notes: note } : t
            ),
          }))
          // get() reflects the updated state after set()
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              const trip = get().trips.find((t) => t.id === tripId)
              if (trip) upsertTrip(session.user.id, trip)
            }
          })
        },
      }
    },
    {
      name: 'planify-trips',
      // v1: strips legacy mock trip IDs ('trip-1', 'trip-2') from localStorage.
      // User-created trips (IDs like 'trip-<timestamp>') are preserved.
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
      partialize: (state) => ({ trips: state.trips }),
    }
  )
)
