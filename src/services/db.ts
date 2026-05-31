/**
 * db.ts — Supabase data-access layer.
 *
 * All functions are fire-and-forget friendly: they log warnings on failure but
 * never throw. The Zustand stores treat Supabase as an async mirror — local
 * state is always the source of truth for the UI.
 */
import { supabase } from '../utils/supabase'
import type { Trip, TripStatus, UserPreferences, CommunityPost } from '../types'

// ─── Trips ────────────────────────────────────────────────────────────────────

interface TripRow {
  id: string
  property: Trip['property']
  criteria: Trip['criteria']
  status: string
  booked_at?: string
  check_in: string
  check_out: string
  total_price: string | number
  currency: string
  travelers: number
  confirmation_code?: string
  notes?: string
}

function rowToTrip(row: TripRow): Trip {
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

  return (data ?? []).map((row: { property_id: string }) => row.property_id)
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
    notifications: prefs.notifications,
    updated_at: new Date().toISOString(),
  })
  if (error) console.warn('[db] upsertUserPreferences:', error.message)
}

// ─── Community Posts ──────────────────────────────────────────────────────────

interface PostRow {
  id: string
  user_id: string
  author_name: string
  author_avatar_url?: string
  created_at: string
  destination: string
  image_url: string
  caption: string
  likes_count?: number
}

function rowToPost(row: PostRow): CommunityPost {
  return {
    id: row.id,
    author: {
      id: row.user_id,
      name: row.author_name,
      email: '',
      avatar: row.author_avatar_url ?? undefined,
      joinDate: row.created_at?.split('T')[0] ?? '',
      tripsCount: 0,
      reviewsCount: 0,
      badges: [],
    },
    destination: row.destination,
    images: [row.image_url],
    caption: row.caption,
    likes: row.likes_count ?? 0,
    comments: 0,
    likedByUser: false, // store overrides this after fetching liked IDs
    createdAt: row.created_at,
    tags: [],
  }
}

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.warn('[db] fetchCommunityPosts:', error.message)
    return []
  }

  return (data ?? []).map(rowToPost)
}

export async function fetchUserLikedPostIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('user_id', userId)

  if (error) {
    console.warn('[db] fetchUserLikedPostIds:', error.message)
    return []
  }

  return (data ?? []).map((row: { post_id: string }) => row.post_id)
}

export async function createCommunityPost(
  userId: string,
  authorName: string,
  authorAvatarUrl: string | undefined,
  destination: string,
  caption: string,
  imageUrl: string
): Promise<CommunityPost | null> {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: userId,
      author_name: authorName,
      author_avatar_url: authorAvatarUrl ?? null,
      destination,
      caption,
      image_url: imageUrl,
      likes_count: 0,
    })
    .select()
    .single()

  if (error) {
    console.warn('[db] createCommunityPost:', error.message)
    return null
  }

  return rowToPost(data)
}

export async function likePost(userId: string, postId: string): Promise<void> {
  const { error } = await supabase
    .from('post_likes')
    .insert({ user_id: userId, post_id: postId })

  // 23505 = unique_violation (already liked) — silently ignore
  if (error && error.code !== '23505') {
    console.warn('[db] likePost:', error.message)
    return
  }

  // Atomic increment via RPC (defined in 002_community.sql)
  await supabase.rpc('increment_post_likes', { p_post_id: postId })
}

export async function unlikePost(userId: string, postId: string): Promise<void> {
  await supabase
    .from('post_likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId)

  await supabase.rpc('decrement_post_likes', { p_post_id: postId })
}
