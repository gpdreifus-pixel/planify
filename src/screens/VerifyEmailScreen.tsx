import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'

export default function VerifyEmailScreen() {
  const navigate = useNavigate()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...code]
    newCode[idx] = value.slice(-1)
    setCode(newCode)
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handleVerify = () => {
    // Any 6-digit code works in prototype
    navigate('/')
  }

  return (
    <AppBackground variant="chat">
      <TopAppBar backTo="/auth" title="Verificación" />

      <main className="flex-1 flex flex-col relative z-10 px-6 pb-10 max-w-md mx-auto w-full">
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl glass-raised flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 40 }}>
              mark_email_read
            </span>
          </div>

          {/* Text */}
          <div className="text-center">
            <h2
              className="text-white mb-2"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}
            >
              Verificá tu email
            </h2>
            <p
              className="text-white/70"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1rem', lineHeight: 1.6 }}
            >
              Te enviamos un código de 6 dígitos. Ingresalo para continuar.
            </p>
          </div>

          {/* OTP inputs */}
          <div className="flex gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el }}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                maxLength={1}
                inputMode="numeric"
                className="w-12 h-14 rounded-2xl text-center text-white text-xl font-bold glass-pressed border border-white/20 focus:border-white/50 outline-none transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              />
            ))}
          </div>

          {/* Resend */}
          <button
            className="text-white/60 hover:text-white/90 transition-colors underline"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
          >
            Reenviar código
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          className="w-full py-4 rounded-full btn-primary text-white font-bold"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700 }}
        >
          Verificar
        </motion.button>
      </main>
    </AppBackground>
  )
}
