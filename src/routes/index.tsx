import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../components/ui/RootLayout'
import HomeScreen from '../screens/HomeScreen'
import AuthScreen from '../screens/AuthScreen'
import VerifyEmailScreen from '../screens/VerifyEmailScreen'
import OnboardingScreen from '../screens/OnboardingScreen'
import ChatScreen from '../screens/ChatScreen'
import ChatSummaryScreen from '../screens/ChatSummaryScreen'
import ResultsScreen from '../screens/ResultsScreen'
import FiltersScreen from '../screens/FiltersScreen'
import MapScreen from '../screens/MapScreen'
import TripDetailScreen from '../screens/TripDetailScreen'
import BookingScreen from '../screens/BookingScreen'
import MyTripsScreen from '../screens/MyTripsScreen'
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen'
import CommunityScreen from '../screens/CommunityScreen'
import CreatePostScreen from '../screens/CreatePostScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ProtectedRoute from '../components/ui/ProtectedRoute'

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

