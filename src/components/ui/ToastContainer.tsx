import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'

const ICON_MAP: Record<string, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
}

const COLOR_MAP: Record<string, { bg: string; border: string; icon: string }> = {
  success: {
    bg: 'rgba(34,197,94,0.18)',
    border: 'rgba(34,197,94,0.35)',
    icon: '#4ade80',
  },
  error: {
    bg: 'rgba(239,68,68,0.18)',
    border: 'rgba(239,68,68,0.35)',
    icon: '#f87171',
  },
  info: {
    bg: 'rgba(255,140,66,0.18)',
    border: 'rgba(255,140,66,0.35)',
    icon: '#ff8c42',
  },
}

/**
 * Renders toast notifications from the global UI store.
 * Positioned fixed at the top of the viewport.
 */
export default function ToastContainer() {
  const { toasts, dismissToast } = useUIStore()

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] flex flex-col items-center pointer-events-none pt-[calc(env(safe-area-inset-top)+1rem)] px-4 gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const colors = COLOR_MAP[toast.type] ?? COLOR_MAP.info
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onClick={() => dismissToast(toast.id)}
              className="pointer-events-auto cursor-pointer max-w-md w-full rounded-2xl px-4 py-3.5 flex items-center gap-3"
              style={{
                background: colors.bg,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${colors.border}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
              }}
            >
              <span
                className="material-symbols-outlined flex-shrink-0"
                style={{
                  fontSize: 22,
                  color: colors.icon,
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                {ICON_MAP[toast.type] ?? 'info'}
              </span>
              <p
                className="flex-1 text-white"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                {toast.message}
              </p>
              <span
                className="material-symbols-outlined flex-shrink-0 text-white/40 hover:text-white/70 transition-colors"
                style={{ fontSize: 18 }}
              >
                close
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
