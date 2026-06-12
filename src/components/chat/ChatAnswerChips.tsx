import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../animations/transitions'

interface ChatAnswerChipsProps {
  chips: string[]
  onSelect: (chip: string) => void
  isMulti?: boolean
  selectedValues?: string[]
}

export default function ChatAnswerChips({ chips, onSelect, selectedValues = [] }: ChatAnswerChipsProps) {
  return (
    <motion.div
      className="flex flex-wrap ml-[52px] gap-3 mt-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {chips.map((chip) => {
        const isSelected = selectedValues.includes(chip)
        return (
          <motion.button
            key={chip}
            variants={staggerItem}
            whileTap={{ scale: 0.93, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -2, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className={`px-5 py-3 rounded-full flex items-center gap-2 transition-colors border ${
              isSelected
                ? 'btn-primary border-transparent'
                : 'bg-white/15 border-white/25 hover:bg-white/25'
            }`}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
            }}
            onClick={() => onSelect(chip)}
          >
            <span className="t-label text-white">{chip}</span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
