import { RouterProvider } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import { router } from './routes'
import PwaUpdatePrompt from './components/ui/PwaUpdatePrompt'
import ErrorBoundary from './components/ui/ErrorBoundary'
import ToastContainer from './components/ui/ToastContainer'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
          ) : (
            <RouterProvider key="router" router={router} />
          )}
        </AnimatePresence>
      </MotionConfig>
      <ToastContainer />
      <PwaUpdatePrompt />
    </ErrorBoundary>
  )
}
