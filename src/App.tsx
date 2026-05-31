import { RouterProvider } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { router } from './routes'
import PwaUpdatePrompt from './components/ui/PwaUpdatePrompt'
import ErrorBoundary from './components/ui/ErrorBoundary'
import ToastContainer from './components/ui/ToastContainer'

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          <RouterProvider router={router} />
        </AnimatePresence>
      </MotionConfig>
      <ToastContainer />
      <PwaUpdatePrompt />
    </ErrorBoundary>
  )
}
