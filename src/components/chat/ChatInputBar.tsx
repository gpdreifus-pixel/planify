import { motion } from 'framer-motion'

interface ChatInputBarProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
}

export default function ChatInputBar({ value, onChange, onSend, placeholder }: ChatInputBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full px-6 pb-8 pt-10 bg-gradient-to-t from-[#ff6b1f] via-[#ff6b1f]/40 to-transparent z-40 flex justify-center">
      <div className="max-w-md w-full flex items-center gap-3">
        {/* Input */}
        <div className="flex-1 glass-pressed rounded-full flex items-center px-5 py-3 border border-white/10 focus-within:border-white/30 transition-colors">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Escribí tu respuesta...'}
            className="w-full bg-transparent border-none outline-none text-white placeholder-white/50 focus:ring-0 p-0"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1rem' }}
            type="text"
          />
        </div>

        {/* Send button — scales in when there's text to send */}
        <motion.button
          aria-label="Send"
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          animate={{ scale: value.trim() ? 1 : 0.88, opacity: value.trim() ? 1 : 0.5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          onClick={onSend}
          className="w-[52px] h-[52px] rounded-full btn-primary flex items-center justify-center text-white flex-shrink-0"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            arrow_upward
          </span>
        </motion.button>
      </div>
    </div>
  )
}
