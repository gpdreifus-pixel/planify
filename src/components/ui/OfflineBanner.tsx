import { useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

/**
 * Pill fijo arriba que avisa cuando no hay conexión. La PWA sigue funcionando
 * con los datos cacheados — esto solo hace explícito que lo que se ve puede
 * estar desactualizado.
 */
export default function OfflineBanner() {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  )

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="fixed top-[calc(env(safe-area-inset-top)+12px)] left-4 right-4 z-50 max-w-md mx-auto flex justify-center"
        >
          <div
            className="glass-panel rounded-full px-4 py-2 flex items-center gap-2"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            <span
              className="material-symbols-outlined flex-shrink-0"
              style={{ fontSize: 18, color: 'rgba(255,255,255,0.70)' }}
              aria-hidden="true"
            >
              cloud_off
            </span>
            <p className="t-label" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Sin conexión — mostrando datos guardados
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
