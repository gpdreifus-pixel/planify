import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserPreferences } from '../types'

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  language: 'es',
  notifications: true,
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
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

// Mock user for prototype
const MOCK_USER: User = {
  id: 'user-1',
  name: 'Bautista',
  email: 'bautista@example.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrsWtM8p6_I5pCt6dtNtzQ3l6-g9mkCpKL2f7TfJfEDIc6gM7gfUn8674ZkryLsk4fjQCpkadIixdwKSwx20LtKhYQZ-cqpEyp_LTRvWpkccKXL6meYhfgSUKpd42D2AxlnbwM6E500QtI54yPZYLIJd0TBeGo4tVQq13vIlWF7clr9rKYhXPPpA7jOBTSkQMymVhmB3JepVMA0bP5GDR5c6ErHW54Jcwod67PtZg2i0Pwmj6IZaxu9S_6fUymkmU0i4LAUBJZ4X2h',
  joinDate: '2025-01-01',
  tripsCount: 3,
  reviewsCount: 12,
  bio: '🌍 Travel addict | 🏖️ Beach lover | ✈️ Always planning the next adventure',
  badges: ['Explorer', 'Beach Bum', 'City Hopper'],
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      onboardingComplete: false,
      userPreferences: DEFAULT_PREFERENCES,

      login: async (_email, _password) => {
        set({ isLoading: true, error: null })
        // Simulate API call
        await new Promise((r) => setTimeout(r, 800))
        set({ user: MOCK_USER, isAuthenticated: true, isLoading: false })
      },

      loginWithSocial: async (_provider) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 600))
        set({ user: MOCK_USER, isAuthenticated: true, isLoading: false })
      },

      register: async (name, email, _password) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 1000))
        set({
          user: { ...MOCK_USER, name, email },
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      clearError: () => set({ error: null }),

      setOnboardingComplete: () => set({ onboardingComplete: true }),

      setPreferences: (partial) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...partial },
        })),
    }),
    {
      name: 'planify-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        onboardingComplete: state.onboardingComplete,
        userPreferences: state.userPreferences,
      }),
    }
  )
)
