// ── User & Auth ──────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: string
  tripsCount: number
  reviewsCount: number
  bio?: string
  badges: string[]
}

// ── Chat / Search ─────────────────────────────────────────────────────────
export interface TripSearchCriteria {
  destination?: string
  vibe?: TripVibe
  departureDate?: string
  returnDate?: string
  travelers?: number
  ageGroup?: string
  budget?: BudgetLevel
  budgetAmount?: number
  accommodationType?: AccommodationType
  activities?: string[]
  flightPreference?: FlightPreference
  extras?: string[]
}

export type TripVibe =
  | 'beach'
  | 'city'
  | 'mountains'
  | 'adventure'
  | 'cultural'
  | 'romantic'
  | 'family'

export type BudgetLevel = 'economy' | 'standard' | 'comfort' | 'luxury'

export type AccommodationType =
  | 'hotel'
  | 'hostel'
  | 'apartment'
  | 'resort'
  | 'boutique'

export type FlightPreference = 'direct' | 'any' | 'cheapest'

export interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

export interface ChatStep {
  step: number
  question: string
  hint: string
  chips?: string[]
  placeholder: string
  field: keyof TripSearchCriteria
}

// ── Properties / Results ──────────────────────────────────────────────────
export interface Property {
  id: string
  name: string
  location: string
  country: string
  images: string[]
  rating: number
  reviewCount: number
  pricePerNight: number
  currency: string
  type: AccommodationType
  tags: string[]
  amenities: Amenity[]
  description: string
  coordinates: { lat: number; lng: number }
  platform: BookingPlatform
  externalUrl: string
}

export interface Amenity {
  icon: string
  label: string
}

export interface BookingPlatform {
  name: string
  logo?: string
  price: number
  currency: string
  url: string
}

// ── Trips ─────────────────────────────────────────────────────────────────
export interface Trip {
  id: string
  property: Property
  criteria: TripSearchCriteria
  status: TripStatus
  bookedAt?: string
  checkIn: string
  checkOut: string
  totalPrice: number
  currency: string
  travelers: number
  confirmationCode?: string
  notes?: string
}

export type TripStatus =
  | 'planning'
  | 'confirmed'
  | 'upcoming'
  | 'active'
  | 'completed'
  | 'cancelled'

// ── Community ─────────────────────────────────────────────────────────────
export interface CommunityExperience {
  type: 'Hospedaje' | 'Vuelo' | 'Transporte' | 'Actividades'
  rating: number // 1-5
  comment: string
}

export interface CommunityPost {
  id: string
  author: User
  destination: string
  images: string[]
  caption: string
  likes: number
  comments: number
  likedByUser: boolean
  createdAt: string
  tags: string[]
  experiences?: CommunityExperience[]
  tripCriteria?: TripSearchCriteria
}

// ── Filters ───────────────────────────────────────────────────────────────
export interface FilterState {
  priceMin: number
  priceMax: number
  rating: number
  types: AccommodationType[]
  amenities: string[]
  sortBy: SortOption
}

export type SortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'distance'

// ── UI State ──────────────────────────────────────────────────────────────
export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

// ── User Preferences ──────────────────────────────────────────────────────
export interface UserPreferences {
  currency: 'USD' | 'EUR' | 'ARS'
  notifications: boolean
}

// ── Recent Searches ───────────────────────────────────────────────────────
export interface RecentSearch {
  id: string
  criteria: TripSearchCriteria
  timestamp: string
  resultsCount: number
}
