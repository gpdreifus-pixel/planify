import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../animations/transitions'

interface ChatAnswerChipsProps {
  chips: string[]
  onSelect: (chip: string) => void
}

export default function ChatAnswerChips({ chips, onSelect }: ChatAnswerChipsProps) {
  return (
    <motion.div
      className="flex flex-wrap ml-[52px] gap-3 mt-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {chips.map((chip) => (
        <motion.button
          key={chip}
          variants={staggerItem}
          // Pin opacity to 1 in every gesture state so a tap during the mount
          // spring never compounds the in-progress opacity with a reset flicker.
          whileTap={{ scale: 0.93, opacity: 1 }}
          whileHover={{ scale: 1.05, y: -2, opacity: 1 }}
          // Gesture-specific transition — kept fast and snappy.
          // The mount animation uses the transition defined inside staggerItem.
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          className="btn-primary px-5 py-2.5 rounded-full flex items-center gap-2"
          style={{
            // Force GPU compositing layer so Framer Motion's transform
            // animations never trigger a CPU repaint on the background.
            willChange: 'transform',
            // Prevent subpixel rendering gaps on some Android WebViews.
            backfaceVisibility: 'hidden',
            // Extra explicit kill in case some browser ignores the * reset.
            WebkitTapHighlightColor: 'transparent',
            outline: 'none',
            userSelect: 'none',
          }}
          onClick={() => onSelect(chip)}
        >
          <span
            className="text-white font-semibold"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
          >
            {chip}
          </span>
        </motion.button>
      ))}
    </motion.div>
  )
}
