import { RouterProvider } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import { router } from './routes'
import PwaUpdatePrompt from './components/ui/PwaUpdatePrompt'
import ErrorBoundary from './components/ui/ErrorBoundary'
import ToastContainer from './components/ui/ToastContainer'
import OfflineBanner from './components/ui/OfflineBanner'

const SPLASH_SEEN_KEY = 'planify-splash-seen'

export default function App() {
  // El splash animado se muestra una sola vez por sesión: en refreshes y
  // deep links el usuario va directo al contenido sin esperar la animación.
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem(SPLASH_SEEN_KEY) === null
    } catch {
      return true
    }
  })

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
    } catch {
      // modo privado sin storage — el splash simplemente se repetirá
    }
    setShowSplash(false)
  }

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen key="splash" onComplete={handleSplashComplete} />
          ) : (
            <RouterProvider key="router" router={router} />
          )}
        </AnimatePresence>
      </MotionConfig>
      <ToastContainer />
      <PwaUpdatePrompt />
      <OfflineBanner />
    </ErrorBoundary>
  )
}
