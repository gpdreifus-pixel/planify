import { RouterProvider } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { router } from './routes'
import PwaUpdatePrompt from './components/ui/PwaUpdatePrompt'
import ErrorBoundary from './components/ui/ErrorBoundary'
import ToastContainer from './components/ui/ToastContainer'

export default function App() {
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <RouterProvider router={router} />
      </AnimatePresence>
      <ToastContainer />
      <PwaUpdatePrompt />
    </ErrorBoundary>
  )
}
