import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import { useAuthStore } from '../store/authStore'
import logoFullSrc from '../assets/logo-full.svg'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { isAuthenticated, isInitializing, onboardingComplete, user } = useAuthStore()

  // Redirect new users to onboarding once auth has resolved
  useEffect(() => {
    if (!isInitializing && isAuthenticated && !onboardingComplete) {
      navigate('/onboarding', { replace: true })
    }
  }, [isAuthenticated, isInitializing, onboardingComplete, navigate])

  return (
    <AppBackground variant="chat">
      <div className="relative z-10 flex flex-col min-h-dvh px-6 max-w-md mx-auto w-full">
        {/* Top spacer */}
        <div className="flex-1" />

        {/* Main glass card — 40px radius, bidirectional neu shadows */}
        <motion.div
          className="glass-panel rounded-[40px] px-8 py-10 flex flex-col gap-5"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
        >
          {/* Logo */}
          <div className="flex justify-center relative z-10 pointer-events-none">
            <img src={logoFullSrc} alt="Planify Logo" className="w-[200px] sm:w-[220px] h-auto -my-20 object-contain drop-shadow-md" />
          </div>

          {/* Badge — neu-pressed pill with icon */}
          <div className="flex justify-center mt-2">
            <div className="neu-pressed rounded-full px-4 py-2 flex items-center gap-2">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, color: '#ffb597' }}
              >
                flight_takeoff
              </span>
              <span className="t-label font-medium text-white/80" style={{ fontSize: '0.8125rem' }}>
                Tu próximo destino
              </span>
            </div>
          </div>

          {/* Heading — guest vs authenticated.
              t-display-xl: Syne solo está cargada en 600/700 — el weight 500
              anterior se renderizaba sintético (borroso e inconsistente). */}
          <h1 className="t-display-xl text-white text-center">
            {isAuthenticated && user
              ? `Hola, ${user.name.split(' ')[0]}`
              : '¿A dónde te llevamos?'}
          </h1>

          {/* Subtitle — guest vs authenticated */}
          <p className="t-body text-white/70 text-center" style={{ lineHeight: 1.6 }}>
            {isAuthenticated ? '¿Qué estás planeando hoy?' : '10 preguntas. Tu viaje ideal.'}
          </p>

          {/* CTA — h-20 (80px) rounded-full neu-btn-primary with shimmer */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
            className="t-title w-full h-20 rounded-full neu-btn-primary relative overflow-hidden group mt-1 flex items-center justify-center gap-2"
            onClick={() => navigate('/chat/1')}
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer pointer-events-none" />
            <span>Planificá un viaje</span>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              arrow_forward
            </span>
          </motion.button>

          {/* Secondary action — shortcut for authenticated, two auth entry points for guests */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/trips')}
              className="t-section text-center text-white/65 hover:text-white/85 transition-colors py-2"
            >
              Ver mis viajes{' '}
              <span className="text-white/85 underline underline-offset-2">→</span>
            </button>
          ) : (
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth', { state: { tab: 'login' } })}
                className="t-body-sm font-semibold flex-1 py-3.5 rounded-full neu-pressed text-white/80 hover:text-white transition-colors"
              >
                Iniciar sesión
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth', { state: { tab: 'register' } })}
                className="t-body-sm font-semibold flex-1 py-3.5 rounded-full neu-flat text-white"
              >
                Crear cuenta
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Bottom spacer */}
        <div className="flex-1" />
      </div>
    </AppBackground>
  )
}
