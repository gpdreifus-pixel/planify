import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

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

  const { scrollY } = useScroll()
  const backgroundColor = useTransform(scrollY, [0, 30], ['rgba(30, 26, 40, 0)', 'rgba(30, 26, 40, 0.8)'])
  const backdropFilter = useTransform(scrollY, [0, 30], ['blur(0px)', 'blur(12px)'])
  const borderBottom = useTransform(scrollY, [0, 30], ['1px solid rgba(255,255,255,0)', '1px solid rgba(255,255,255,0.1)'])

  return (
    <motion.header
      style={{ backgroundColor, backdropFilter, borderBottom }}
      className={`w-full sticky top-0 z-40 flex justify-between items-center px-6 py-4 max-w-md mx-auto transition-colors ${className}`}
    >
      {/* Back button */}
      {(backTo !== undefined || onBack) ? (
        <motion.button
          aria-label="Volver"
          className="w-10 h-10 rounded-full flex items-center justify-center glass-raised hover:opacity-80 transition-opacity text-white flex-shrink-0"
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            arrow_back
          </span>
        </motion.button>
      ) : (
        <div className="w-10 flex-shrink-0" />
      )}

      {/* Title */}
      <div className="flex-1 flex justify-center min-w-0 px-2">
        <h1 className="t-headline text-white tracking-tight drop-shadow-md truncate">
          {title}
        </h1>
      </div>

      {/* Right slot */}
      <div className="w-10 flex justify-end">
        {rightSlot ?? null}
      </div>
    </motion.header>
  )
}
