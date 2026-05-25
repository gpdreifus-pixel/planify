import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number  // 0-100
  className?: string
}

export default function ProgressBar({ value, className = '' }: ProgressBarProps) {
  return (
    <div className={`px-6 w-full max-w-7xl mx-auto mb-8 relative z-10 ${className}`}>
      <div className="h-2 progress-track w-full">
        <motion.div
          className="h-full progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 0.8 }}
        />
      </div>
    </div>
  )
}
