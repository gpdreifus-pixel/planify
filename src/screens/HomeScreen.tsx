import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import { useAuthStore } from '../store/authStore'
import logoFullSrc from '../assets/logo-full.png'

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
          <div className="flex justify-center mb-[-10px] relative z-10">
            <img src={logoFullSrc} alt="Planify Logo" className="h-16 w-auto object-contain drop-shadow-md" />
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
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.8125rem',
                  color: 'rgba(255,255,255,0.80)',
                  fontWeight: 500,
                }}
              >
                Tu próximo destino
              </span>
            </div>
          </div>

          {/* Heading — guest vs authenticated */}
          <h1
            className="text-white text-center"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '2.625rem',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '0.04em',
            }}
          >
            {isAuthenticated && user
              ? `Hola, ${user.name.split(' ')[0]}`
              : '¿A dónde te llevamos?'}
          </h1>

          {/* Subtitle — guest vs authenticated */}
          <p
            className="text-white/65 text-center"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {isAuthenticated ? '¿Qué estás planeando hoy?' : '10 preguntas. Tu viaje ideal.'}
          </p>

          {/* CTA — h-20 (80px) rounded-full neu-btn-primary with shimmer */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
            className="w-full h-20 rounded-full neu-btn-primary relative overflow-hidden group mt-1 flex items-center justify-center gap-2"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.125rem',
              fontWeight: 700,
              letterSpacing: '0.015em',
            }}
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
              className="text-center text-white/55 hover:text-white/75 transition-colors"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9375rem' }}
            >
              Ver mis viajes{' '}
              <span className="text-white/85 font-semibold underline underline-offset-2">
                →
              </span>
            </button>
          ) : (
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth', { state: { tab: 'login' } })}
                className="flex-1 py-3.5 rounded-full neu-pressed text-white/80 hover:text-white font-semibold transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem' }}
              >
                Iniciar sesión
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth', { state: { tab: 'register' } })}
                className="flex-1 py-3.5 rounded-full neu-flat text-white font-semibold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem' }}
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
