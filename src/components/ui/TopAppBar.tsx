import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface TopAppBarProps {
  /** Back destination path. Omit to hide back button. */
  backTo?: string
  /** Called instead of navigation when set. */
  onBack?: () => void
  title?: string
  /** Slot for the right side (e.g. step indicator, icon button). */
  rightSlot?: React.ReactNode
  /** Extra className for the header element. */
  className?: string
}

export default function TopAppBar({
  backTo,
  onBack,
  title = 'Planify',
  rightSlot,
  className = '',
}: TopAppBarProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else if (backTo) navigate(backTo)
    else navigate(-1)
  }

  return (
    <header
      className={`w-full sticky top-0 z-30 flex justify-between items-center px-6 py-4 max-w-md mx-auto ${className}`}
    >
      {/* Back button */}
      {(backTo !== undefined || onBack) ? (
        <motion.button
          aria-label="Back"
          className="w-10 h-10 rounded-full flex items-center justify-center glass-raised hover:opacity-80 transition-opacity text-white"
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            arrow_back
          </span>
        </motion.button>
      ) : (
        <div className="w-10" />
      )}

      {/* Title */}
      <div className="flex-1 flex justify-center">
        <h1
          className="text-white tracking-tight drop-shadow-md"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 700 }}
        >
          {title}
        </h1>
      </div>

      {/* Right slot */}
      <div className="w-10 flex justify-end">
        {rightSlot ?? null}
      </div>
    </header>
  )
}
