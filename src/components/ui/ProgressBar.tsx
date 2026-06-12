import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number  // 0-100
  className?: string
}

export default function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={`px-6 w-full max-w-7xl mx-auto mb-8 relative z-10 ${className}`}>
      <div
        className="h-2 progress-track w-full"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de la búsqueda"
      >
        <motion.div
          className="h-full progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 0.8 }}
        />
      </div>
    </div>
  )
}
