import { create } from 'zustand'
import type { TripSearchCriteria, ChatMessage } from '../types'

interface ChatState {
  currentStep: number
  totalSteps: number
  messages: ChatMessage[]
  criteria: TripSearchCriteria
  userInput: string
  isTyping: boolean
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setCriteria: (partial: Partial<TripSearchCriteria>) => void
  setUserInput: (input: string) => void
  setTyping: (typing: boolean) => void
  reset: () => void
}

const INITIAL_STATE = {
  currentStep: 1,
  totalSteps: 10,
  messages: [],
  criteria: {},
  userInput: '',
  isTyping: false,
}

export const useChatStore = create<ChatState>()((set, get) => ({
  ...INITIAL_STATE,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, totalSteps } = get()
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1, userInput: '' })
    }
  },

  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 })
    }
  },

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    }
    set((state) => ({ messages: [...state.messages, newMessage] }))
  },

  setCriteria: (partial) =>
    set((state) => ({ criteria: { ...state.criteria, ...partial } })),

  setUserInput: (input) => set({ userInput: input }),

  setTyping: (typing) => set({ isTyping: typing }),

  reset: () => set(INITIAL_STATE),
}))
