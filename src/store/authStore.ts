import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User, UserPreferences } from '../types'
import { supabase } from '../utils/supabase'

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
  logout: () => void
  clearError: () => void
  setOnboardingComplete: () => void
  setPreferences: (partial: Partial<UserPreferences>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      // Subscribe to Supabase auth state changes.
      // Fires immediately with INITIAL_SESSION (restoring a stored session on
      // page reload) and then on every change: SIGNED_IN, SIGNED_OUT,
      // TOKEN_REFRESHED, etc. This is the single source of truth for auth state.
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          set({
            user: mapSupabaseUser(session.user),
            isAuthenticated: true,
            isInitializing: false,
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
          // onAuthStateChange handles user + isAuthenticated
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

        logout: () => {
          // Optimistically clear local state for instant UX — the user sees
          // the guest screen immediately without waiting for the network call.
          set({ user: null, isAuthenticated: false })
          supabase.auth.signOut() // fire-and-forget; onAuthStateChange confirms
        },

        clearError: () => set({ error: null }),

        setOnboardingComplete: () => set({ onboardingComplete: true }),

        setPreferences: (partial) =>
          set((state) => ({
            userPreferences: { ...state.userPreferences, ...partial },
          })),
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
