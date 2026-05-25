/**
 * db.ts — Supabase data-access layer.
 *
 * All functions are fire-and-forget friendly: they log warnings on failure but
 * never throw. The Zustand stores treat Supabase as an async mirror — local
 * state is always the source of truth for the UI.
 */
import { supabase } from '../utils/supabase'
import type { Trip, TripStatus, UserPreferences } from '../types'

// ─── Trips ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTrip(row: any): Trip {
  return {
    id: row.id,
    property: row.property,
    criteria: row.criteria,
    status: row.status as TripStatus,
    bookedAt: row.booked_at ?? undefined,
    checkIn: row.check_in,
    checkOut: row.check_out,
    totalPrice: Number(row.total_price),
    currency: row.currency,
    travelers: row.travelers,
    confirmationCode: row.confirmation_code ?? undefined,
    notes: row.notes ?? undefined,
  }
}

export async function fetchUserTrips(userId: string): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('[db] fetchUserTrips:', error.message)
    return []
  }

  return (data ?? []).map(rowToTrip)
}

export async function upsertTrip(userId: string, trip: Trip): Promise<void> {
  const { error } = await supabase.from('trips').upsert({
    id: trip.id,
    user_id: userId,
    property: trip.property,
    criteria: trip.criteria,
    status: trip.status,
    booked_at: trip.bookedAt ?? null,
    check_in: trip.checkIn,
    check_out: trip.checkOut,
    total_price: trip.totalPrice,
    currency: trip.currency,
    travelers: trip.travelers,
    confirmation_code: trip.confirmationCode ?? null,
    notes: trip.notes ?? null,
  })
  if (error) console.warn('[db] upsertTrip:', error.message)
}

export async function updateTripStatus(
  tripId: string,
  status: TripStatus
): Promise<void> {
  const { error } = await supabase
    .from('trips')
    .update({ status })
    .eq('id', tripId)
  if (error) console.warn('[db] updateTripStatus:', error.message)
}

// ─── Saved Properties ─────────────────────────────────────────────────────────

export async function fetchSavedPropertyIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('saved_properties')
    .select('property_id')
    .eq('user_id', userId)

  if (error) {
    console.warn('[db] fetchSavedPropertyIds:', error.message)
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => row.property_id as string)
}

export async function saveProperty(
  userId: string,
  propertyId: string
): Promise<void> {
  const { error } = await supabase
    .from('saved_properties')
    .insert({ user_id: userId, property_id: propertyId })
  // 23505 = unique_violation (already saved) — silently ignore
  if (error && !error.message.includes('duplicate') && error.code !== '23505') {
    console.warn('[db] saveProperty:', error.message)
  }
}

export async function unsaveProperty(
  userId: string,
  propertyId: string
): Promise<void> {
  const { error } = await supabase
    .from('saved_properties')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId)
  if (error) console.warn('[db] unsaveProperty:', error.message)
}

// ─── User Preferences ─────────────────────────────────────────────────────────

export async function fetchUserPreferences(
  userId: string
): Promise<Partial<UserPreferences>> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.warn('[db] fetchUserPreferences:', error.message)
    return {}
  }

  if (!data) return {}

  return {
    currency: data.currency as UserPreferences['currency'],
    language: data.language as UserPreferences['language'],
    notifications: data.notifications as boolean,
  }
}

export async function upsertUserPreferences(
  userId: string,
  prefs: UserPreferences
): Promise<void> {
  const { error } = await supabase.from('user_preferences').upsert({
    user_id: userId,
    currency: prefs.currency,
    language: prefs.language,
    notifications: prefs.notifications,
    updated_at: new Date().toISOString(),
  })
  if (error) console.warn('[db] upsertUserPreferences:', error.message)
}
