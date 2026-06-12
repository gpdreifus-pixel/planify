import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Spinner from './Spinner'

/**
 * Wraps routes that require authentication.
 * - While Supabase is still restoring the session → shows a loading indicator.
 * - If not authenticated → redirects to /auth.
 * - Otherwise → renders children normally.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuthStore()
  const location = useLocation()

  // Wait for the first onAuthStateChange callback (session restore).
  // El fondo lo aporta html (gradiente fijo en index.css) — sin duplicarlo acá.
  if (isInitializing) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Spinner size={32} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}
