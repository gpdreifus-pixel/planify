import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

/**
 * Wraps routes that require authentication.
 * - While Supabase is still restoring the session → shows a loading indicator.
 * - If not authenticated → redirects to /auth.
 * - Otherwise → renders children normally.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuthStore()

  // Wait for the first onAuthStateChange callback (session restore)
  if (isInitializing) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #8178a8 0%, #c49ba2 35%, #ff8c42 70%, #ff6b1f 100%)',
        }}
      >
        <span
          className="material-symbols-outlined animate-spin text-white/60"
          style={{ fontSize: 32 }}
        >
          progress_activity
        </span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}
