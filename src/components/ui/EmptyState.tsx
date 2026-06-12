import { motion } from 'framer-motion'

interface EmptyStateProps {
  /** Nombre de Material Symbol */
  icon: string
  title: string
  description?: string
  cta?: { label: string; onPress: () => void; icon?: string }
}

/** Estado vacío unificado: ícono grande + título + descripción + CTA opcional.
 *  Reemplaza las 5 variantes duplicadas de Results/MyTrips/Community/Summary. */
export default function EmptyState({ icon, title, description, cta }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 text-center px-4"
    >
      <span
        className="material-symbols-outlined"
        aria-hidden
        style={{ fontSize: 72, color: 'rgba(255,255,255,0.22)' }}
      >
        {icon}
      </span>
      <h3 className="t-headline-sm text-white mt-4">{title}</h3>
      {description && (
        <p className="t-body-sm text-white/65 mt-2 max-w-xs">{description}</p>
      )}
      {cta && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={cta.onPress}
          className="t-cta mt-6 neu-btn-primary px-8 py-3 rounded-full text-white inline-flex items-center gap-2"
        >
          {cta.icon && (
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{cta.icon}</span>
          )}
          {cta.label}
        </motion.button>
      )}
    </motion.div>
  )
}
