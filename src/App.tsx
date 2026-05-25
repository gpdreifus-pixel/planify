import { RouterProvider } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { router } from './routes'
import PwaUpdatePrompt from './components/ui/PwaUpdatePrompt'

export default function App() {
  return (
    <>
      <AnimatePresence mode="wait">
        <RouterProvider router={router} />
      </AnimatePresence>
      <PwaUpdatePrompt />
    </>
  )
}
