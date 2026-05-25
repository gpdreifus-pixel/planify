import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User, UserPreferences } from '../types'
import { supabase } from '../utils/supabase'
import { fetchUserPreferences, upsertUserPreferences } from '../services/db'

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  language: 'es',
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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Subscribe to Supabase auth state changes.
      // Fires immediately with INITIAL_SESSION (restoring a stored session on
      // page reload) and then on every change: SIGNED_IN, SIGNED_OUT,
      // TOKEN_REFRESHED, etc. This is the single source of truth for auth state.
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const userId = session.user.id
          set({
            user: mapSupabaseUser(session.user),
            isAuthenticated: true,
            isInitializing: false,
          })
          // Fetch and merge cloud preferences — fire-and-forget.
          // If the user has saved preferences in the cloud, apply them over
          // local defaults. If not, bootstrap them from the current local prefs.
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
          // Clear local state immediately for instant UX feedback.
          set({ user: null, isAuthenticated: false })
          // Await signOut so the Supabase session is actually invalidated before
          // the caller navigates away. Without this, a quick F5 can restore the
          // session because the sb-* localStorage token is still valid.
          await supabase.auth.signOut()
          // onAuthStateChange fires SIGNED_OUT and confirms the cleared state.
        },

        clearError: () => set({ error: null }),

        setOnboardingComplete: () => set({ onboardingComplete: true }),

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
