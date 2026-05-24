import { create } from 'zustand'
import type { ToastMessage } from '../types'

interface UIState {
  toasts: ToastMessage[]
  isFiltersOpen: boolean
  activeTab: 'login' | 'register'
  // Actions
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void
  dismissToast: (id: string) => void
  openFilters: () => void
  closeFilters: () => void
  setActiveTab: (tab: 'login' | 'register') => void
}

export const useUIStore = create<UIState>()((set, get) => ({
  toasts: [],
  isFiltersOpen: false,
  activeTab: 'login',

  showToast: (message, type = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}`
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }))
    // Auto-dismiss
    setTimeout(() => get().dismissToast(id), duration)
  },

  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  openFilters: () => set({ isFiltersOpen: true }),
  closeFilters: () => set({ isFiltersOpen: false }),

  setActiveTab: (tab) => set({ activeTab: tab }),
}))
