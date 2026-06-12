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
            <h2 className="t-headline-lg text-white mb-3">Revisá tu email</h2>
            <p className="t-body-sm text-white/75">Te enviamos un enlace de verificación a</p>
            {email && (
              <p className="t-body-sm font-semibold text-white mt-1">{email}</p>
            )}
            <p className="t-caption text-white/60 mt-3" style={{ fontSize: '0.8125rem', lineHeight: 1.65 }}>
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
              className="t-label px-6 py-3 rounded-full transition-colors"
              style={{
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

            <p className="t-caption text-white/45">
              ¿No lo recibiste? Revisá tu carpeta de spam.
            </p>
          </motion.div>
        </div>

        {/* Open email CTA — Gmail web/app; `mailto:` sin destinatario abría un
            compose vacío (o nada) en lugar de la bandeja de entrada */}
        <motion.a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
          className="t-cta w-full py-4 rounded-full btn-primary text-white flex items-center justify-center gap-2 no-underline"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>open_in_new</span>
          Abrir Gmail
        </motion.a>
      </main>
    </AppBackground>
  )
}
