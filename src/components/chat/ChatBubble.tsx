import { motion } from 'framer-motion'
import { chatBubbleVariants } from '../../animations/transitions'
import { AI_AVATAR } from '../../data/mockData'

interface ChatBubbleProps {
  question: string
  hint: string
}

export default function ChatBubble({ question, hint }: ChatBubbleProps) {
  return (
    <motion.div
      className="flex flex-col items-start w-full mt-4 mb-6"
      variants={chatBubbleVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-end gap-3 max-w-[90%]">
        {/* AI avatar */}
        <div className="w-10 h-10 rounded-full flex-shrink-0 glass-raised flex items-center justify-center overflow-hidden">
          <img
            src={AI_AVATAR}
            alt="Planify AI"
            className="w-full h-full object-cover opacity-90 mix-blend-screen"
          />
        </div>

        {/* Bubble */}
        <div className="glass-molded px-6 py-5 rounded-2xl rounded-bl-sm">
          <p
            className="text-white leading-tight tracking-tight drop-shadow-sm"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 600 }}
          >
            {question}
          </p>
        </div>
      </div>

      {/* Hint */}
      <div className="ml-[52px] mt-3">
        <p
          className="text-white/70"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem', fontWeight: 400 }}
        >
          {hint}
        </p>
      </div>
    </motion.div>
  )
}
