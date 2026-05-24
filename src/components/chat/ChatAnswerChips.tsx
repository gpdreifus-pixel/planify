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
          whileTap={{ scale: 0.95 }}
          className="btn-primary px-5 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-all duration-200"
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
