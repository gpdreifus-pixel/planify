import { useRegisterSW } from 'virtual:pwa-register/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div
            className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            <span
              className="material-symbols-outlined flex-shrink-0"
              style={{ fontSize: 20, color: 'rgba(255,255,255,0.70)' }}
            >
              system_update
            </span>
            <p
              className="flex-1"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.4,
              }}
            >
              Nueva versión disponible
            </p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => updateServiceWorker(true)}
              className="glass-raised rounded-full px-3 py-1 flex-shrink-0"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.8125rem',
                color: '#ff8c42',
                fontWeight: 600,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Actualizar
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
