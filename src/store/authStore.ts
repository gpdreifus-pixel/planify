import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User, UserPreferences } from '../types'
import { supabase } from '../utils/supabase'
import { fetchUserPreferences, upsertUserPreferences } from '../services/db'
import { useSearchStore } from './searchStore'
import { useTripsStore } from './tripsStore'

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  notifications: true,
}

/** Map a Supabase auth user onto our app's User shape. */
function mapSupabaseUser(sbUser: SupabaseUser): User {
  const meta = sbUser.user_metadata ?? {}
  return {
    id: sbUser.id,
    // Prefer full_name (set on signUp / Google OAuth), fall back to first part of email
    name: meta.full_name ?? meta.name ?? sbUser.email?.split('@')[0] ?? 'Viajero',
    email: sbUser.email ?? '',
    avatar: meta.avatar_url,
    joinDate: sbUser.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0],
    tripsCount: 0,
    reviewsCount: 0,
    bio: meta.bio,
    badges: [],
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  /** True until the first Supabase onAuthStateChange callback fires on startup. */
  isInitializing: boolean
  isLoading: boolean
  error: string | null
  onboardingComplete: boolean
  userPreferences: UserPreferences
  // Actions
  login: (email: string, password: string) => Promise<void>
  loginWithSocial: (provider: 'google' | 'apple') => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  setOnboardingComplete: () => void
  setPreferences: (partial: Partial<UserPreferences>) => void
  updateProfile: (name: string, bio: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Subscribe to Supabase auth state changes.
      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const userId = session.user.id
          const isOnboarded = session.user.user_metadata?.onboarding_complete === true
          set({
            user: mapSupabaseUser(session.user),
            isAuthenticated: true,
            isInitializing: false,
            onboardingComplete: isOnboarded,
          })
          
          // Trigger sync on other stores
          if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            useSearchStore.getState().syncSavedProperties(userId)
            useTripsStore.getState().syncTrips(userId)
          }

          // Fetch and merge cloud preferences
          fetchUserPreferences(userId).then((cloudPrefs) => {
            if (Object.keys(cloudPrefs).length > 0) {
              set((state) => ({
                userPreferences: { ...state.userPreferences, ...cloudPrefs },
              }))
            } else {
              upsertUserPreferences(userId, get().userPreferences)
            }
          })
        } else {
          set({ user: null, isAuthenticated: false, isInitializing: false })
          if (event === 'SIGNED_OUT') {
            useSearchStore.getState().clearSavedProperties()
            useTripsStore.getState().clearTrips()
          }
        }
      })

      return {
        user: null,
        isAuthenticated: false,
        isInitializing: true,
        isLoading: false,
        error: null,
        onboardingComplete: false,
        userPreferences: DEFAULT_PREFERENCES,

        login: async (email, password) => {
          set({ isLoading: true, error: null })
          const { error } = await supabase.auth.signInWithPassword({ email, password })
          set({ isLoading: false })
          if (error) {
            set({ error: error.message })
            throw error
          }
          // onAuthStateChange handles user + isAuthenticated + prefs sync
        },

        loginWithSocial: async (provider) => {
          set({ isLoading: true, error: null })
          const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin },
          })
          set({ isLoading: false })
          if (error) {
            set({ error: error.message })
            throw error
          }
          // Browser redirects to OAuth provider — session resolved on return
          // via onAuthStateChange. The navigate() in AuthScreen won't fire
          // because the page has already navigated to the provider.
        },

        register: async (name, email, password) => {
          set({ isLoading: true, error: null })
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
          })
          set({ isLoading: false })
          if (error) {
            set({ error: error.message })
            throw error
          }
          // onAuthStateChange fires when email is confirmed (or immediately if
          // email confirmation is disabled). AuthScreen navigates to /auth/verify.
        },

        logout: async () => {
          // planify-auth only stores onboardingComplete + userPreferences —
          // no auth tokens. Save it so preferences survive the logout.
          const savedAuth = localStorage.getItem('planify-auth')

          // Nuclear clear: wipes every Supabase session key regardless of its
          // exact name (avoids relying on the 'sb-*' prefix pattern which varies
          // across Supabase JS versions).
          localStorage.clear()
          try { sessionStorage.clear() } catch { /* sandboxed iframe */ }

          // Restore non-sensitive preferences / onboarding flag.
          if (savedAuth) localStorage.setItem('planify-auth', savedAuth)

          // Best-effort server-side token revocation.
          // Wrapped in try/catch: if offline or the server rejects the call,
          // storage is already gone so the session won't survive a page reload.
          try { await supabase.auth.signOut({ scope: 'global' }) } catch { /* ignore */ }

          // Hard reload — destroys the in-memory Supabase client and JS runtime.
          // SPA navigate() leaves the client alive, which can re-serve the old session.
          window.location.href = '/'
        },

        clearError: () => set({ error: null }),

        setOnboardingComplete: () => {
          set({ onboardingComplete: true })
          // Persist in Supabase user metadata so the flag is per-user and
          // device-independent — not just a localStorage boolean.
          supabase.auth.updateUser({ data: { onboarding_complete: true } })
        },

        setPreferences: (partial) => {
          set((state) => ({
            userPreferences: { ...state.userPreferences, ...partial },
          }))
          // Cloud write — fire-and-forget; get() reflects the merged state
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              upsertUserPreferences(session.user.id, get().userPreferences)
            }
          })
        },

        updateProfile: async (name, bio) => {
          set({ isLoading: true, error: null })
          const { data, error } = await supabase.auth.updateUser({
            data: { full_name: name, bio },
          })
          set({ isLoading: false })
          if (error) {
            set({ error: error.message })
            throw error
          }
          // Update local state immediately for a snappy feel
          if (data.user) {
            set({ user: mapSupabaseUser(data.user) })
          }
        },

        resetPassword: async (email) => {
          set({ isLoading: true, error: null })
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/auth',
          })
          set({ isLoading: false })
          if (error) {
            set({ error: error.message })
            throw error
          }
        },
      }
    },
    {
      name: 'planify-auth',
      // v2: strip user + isAuthenticated from persisted state.
      // Supabase manages its own session under 'sb-*' localStorage keys.
      // Zustand only needs to persist app-level prefs that aren't auth state.
      version: 2,
      migrate: () => ({
        // Discard any previously persisted mock user/auth state.
        // onAuthStateChange will repopulate from the real Supabase session.
        onboardingComplete: false,
        userPreferences: DEFAULT_PREFERENCES,
      }),
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        userPreferences: state.userPreferences,
      }),
    }
  )
)
