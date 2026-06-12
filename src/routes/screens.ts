import { lazy } from 'react'

// Code splitting por ruta — cada pantalla va a su propio chunk y el bundle
// inicial no arrastra Leaflet (Map) ni html2pdf (Booking/MyTrips).
// HomeScreen NO está acá: es el entry point y se importa eager en routes.

export const AuthScreen = lazy(() => import('../screens/AuthScreen'))
export const VerifyEmailScreen = lazy(() => import('../screens/VerifyEmailScreen'))
export const OnboardingScreen = lazy(() => import('../screens/OnboardingScreen'))
export const ChatScreen = lazy(() => import('../screens/ChatScreen'))
export const ChatSummaryScreen = lazy(() => import('../screens/ChatSummaryScreen'))
export const ResultsScreen = lazy(() => import('../screens/ResultsScreen'))
export const FiltersScreen = lazy(() => import('../screens/FiltersScreen'))
export const MapScreen = lazy(() => import('../screens/MapScreen'))
export const TripDetailScreen = lazy(() => import('../screens/TripDetailScreen'))
export const BookingScreen = lazy(() => import('../screens/BookingScreen'))
export const MyTripsScreen = lazy(() => import('../screens/MyTripsScreen'))
export const BookingConfirmationScreen = lazy(() => import('../screens/BookingConfirmationScreen'))
export const CommunityScreen = lazy(() => import('../screens/CommunityScreen'))
export const CreatePostScreen = lazy(() => import('../screens/CreatePostScreen'))
export const ProfileScreen = lazy(() => import('../screens/ProfileScreen'))
