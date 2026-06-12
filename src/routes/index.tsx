import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../components/ui/RootLayout'
import ProtectedRoute from '../components/ui/ProtectedRoute'
// HomeScreen queda eager: es el entry point y debe pintar al instante.
import HomeScreen from '../screens/HomeScreen'
import {
  AuthScreen,
  VerifyEmailScreen,
  OnboardingScreen,
  ChatScreen,
  ChatSummaryScreen,
  ResultsScreen,
  FiltersScreen,
  MapScreen,
  TripDetailScreen,
  BookingScreen,
  MyTripsScreen,
  BookingConfirmationScreen,
  CommunityScreen,
  CreatePostScreen,
  ProfileScreen,
} from './screens'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomeScreen /> },
      { path: '/onboarding', element: <OnboardingScreen /> },
      { path: '/auth', element: <AuthScreen /> },
      { path: '/auth/verify', element: <VerifyEmailScreen /> },
      { path: '/chat/summary', element: <ChatSummaryScreen /> },
      { path: '/chat/:step', element: <ChatScreen /> },
      { path: '/results', element: <ResultsScreen /> },
      { path: '/results/filters', element: <FiltersScreen /> },
      { path: '/results/map', element: <MapScreen /> },
      { path: '/results/:id', element: <TripDetailScreen /> },
      { path: '/booking/:id', element: <BookingScreen /> },
      { path: '/booking-confirmation', element: <ProtectedRoute><BookingConfirmationScreen /></ProtectedRoute> },
      { path: '/trips', element: <ProtectedRoute><MyTripsScreen /></ProtectedRoute> },
      { path: '/community', element: <CommunityScreen /> },
      { path: '/community/new', element: <ProtectedRoute><CreatePostScreen /></ProtectedRoute> },
      { path: '/profile', element: <ProtectedRoute><ProfileScreen /></ProtectedRoute> },
      // Catch-all
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
