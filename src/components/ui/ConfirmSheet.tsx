import { motion } from 'framer-motion'

interface ConfirmSheetProps {
  /** Material Symbol del círculo superior */
  icon?: string
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  /** true → estilo rojo de acción destructiva */
  destructive?: boolean
  /** Deshabilita botones mientras la acción corre */
  busy?: boolean
  busyLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/** Bottom sheet de confirmación unificado (borrar viaje, cerrar sesión, etc.).
 *  Renderizar condicionalmente dentro de <AnimatePresence> en el caller. */
export default function ConfirmSheet({
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  destructive = false,
  busy = false,
  busyLabel,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const accent = destructive ? '#ffb4ab' : '#ff8c42'

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !busy && onCancel()}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: 9998 }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="fixed bottom-0 left-0 right-0 bg-sheet-dark rounded-t-[32px] flex flex-col pt-4 px-6 max-w-md mx-auto shadow-2xl"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          zIndex: 9999,
          paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        {icon && (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: `${accent}33`, color: accent }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>{icon}</span>
          </div>
        )}

        <h3 className="t-headline-sm text-white mb-2 text-center">{title}</h3>
        <p className="t-body-sm text-white/70 text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="t-label flex-1 py-3.5 rounded-full border border-white/20 text-white/85 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="t-label flex-1 py-3.5 rounded-full transition-colors disabled:opacity-70"
            style={
              destructive
                ? { background: '#ffb4ab', color: '#1b1c1c' }
                : {
                    background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
                    color: 'white',
                    boxShadow: '0 6px 20px rgba(255,107,31,0.35)',
                  }
            }
          >
            {busy ? (busyLabel ?? confirmLabel) : confirmLabel}
          </button>
        </div>
      </motion.div>
    </>
  )
}
