import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../animations/transitions'

interface ChatAnswerChipsProps {
  chips: string[]
  onSelect: (chip: string) => void
  isMulti?: boolean
  selectedValues?: string[]
}

export default function ChatAnswerChips({ chips, onSelect, isMulti, selectedValues = [] }: ChatAnswerChipsProps) {
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
            className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors border ${
              isSelected
                ? 'btn-primary border-transparent'
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
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
        )
      })}
    </motion.div>
  )
}
