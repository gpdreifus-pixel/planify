import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import { supabase } from '../utils/supabase'
import { useAuthStore } from '../store/authStore'

const RESEND_COOLDOWN = 60 // seconds

type ResendStatus = 'idle' | 'sending' | 'sent' | 'error'

export default function VerifyEmailScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  // Email forwarded via router state from AuthScreen's handleRegister
  const email = (location.state as { email?: string } | null)?.email ?? ''

  const [cooldown, setCooldown] = useState(0)
  const [status, setStatus] = useState<ResendStatus>('idle')

  // ── Guard: redirect when already authenticated ────────────────────────────
  // Fires when the user clicks the email link and onAuthStateChange resolves
  // in this tab, or when the screen is loaded while a session already exists.
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  // ── Guard: no email + not authenticated = stale URL, send back to auth ────
  useEffect(() => {
    if (!email && !isAuthenticated) navigate('/auth', { replace: true })
  }, [email, isAuthenticated, navigate])

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleResend = async () => {
    if (!email || cooldown > 0 || status === 'sending') return
    setStatus('sending')
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    } else {
      setStatus('sent')
      setCooldown(RESEND_COOLDOWN)
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const resendLabel = () => {
    if (status === 'sending') return 'Enviando...'
    if (status === 'sent')    return '¡Enviado!'
    if (status === 'error')   return 'Error — intentá de nuevo'
    if (cooldown > 0)         return `Reenviar en ${cooldown}s`
    return 'Reenviar email'
  }

  const resendDisabled = cooldown > 0 || status === 'sending'

  return (
    <AppBackground variant="chat">
      <TopAppBar backTo="/auth" title="Verificación" />

      <main className="flex-1 flex flex-col relative z-10 px-6 pb-10 max-w-md mx-auto w-full">
        <div className="flex-1 flex flex-col items-center justify-center gap-8">

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.1 }}
            className="w-24 h-24 rounded-3xl glass-raised flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-white" style={{ fontSize: 48 }}>
              mark_email_read
            </span>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-center"
          >
            <h2
              className="text-white mb-3"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}
            >
              Revisá tu email
            </h2>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.9375rem',
                lineHeight: 1.65,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.70)',
              }}
            >
              Te enviamos un enlace de verificación a
            </p>
            {email && (
              <p
                className="mt-1"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                {email}
              </p>
            )}
            <p
              className="mt-3"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.8125rem',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              Hacé clic en el enlace para activar tu cuenta.
              La app se abrirá automáticamente.
            </p>
          </motion.div>

          {/* Resend controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.button
              whileTap={{ scale: resendDisabled ? 1 : 0.96 }}
              onClick={handleResend}
              disabled={resendDisabled}
              className="px-6 py-2.5 rounded-full transition-colors"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 600,
                background: resendDisabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.16)',
                color: resendDisabled ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.82)',
                cursor: resendDisabled ? 'default' : 'pointer',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={resendLabel()}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'inline-block' }}
                >
                  {resendLabel()}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.30)',
              }}
            >
              ¿No lo recibiste? Revisá tu carpeta de spam.
            </p>
          </motion.div>
        </div>

        {/* Open email app CTA */}
        <motion.a
          href="mailto:"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-full btn-primary text-white font-bold flex items-center justify-center gap-2 no-underline"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>open_in_new</span>
          Abrir app de email
        </motion.a>
      </main>
    </AppBackground>
  )
}
