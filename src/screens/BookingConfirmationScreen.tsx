import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import { useUIStore } from '../store/uiStore'
import { haptic } from '../utils/haptics'
import type { Trip } from '../types'

export default function BookingConfirmationScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const showToast = useUIStore((s) => s.showToast)
  const trip = (location.state as { trip?: Trip })?.trip

  useEffect(() => {
    if (!trip) {
      navigate('/trips', { replace: true })
    }
  }, [trip, navigate])

  const handleCopyCode = async () => {
    if (!trip?.confirmationCode) return
    try {
      await navigator.clipboard.writeText(trip.confirmationCode)
      haptic()
      showToast('Código copiado', 'success')
    } catch {
      showToast('No se pudo copiar el código', 'error')
    }
  }

  if (!trip) return null

  return (
    <AppBackground variant="chat">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
          className="w-24 h-24 rounded-full bg-success-light/20 flex items-center justify-center mb-6"
        >
          <span className="material-symbols-outlined text-success-light" style={{ fontSize: 48, fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="t-display text-white mb-2"
        >
          ¡Reserva Exitosa!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="t-body text-white/75 mb-8"
        >
          Tu aventura en <strong className="text-white font-semibold">{trip.property.name}</strong> está lista.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-surface p-6 rounded-3xl w-full mb-8 flex flex-col gap-2"
        >
          <span className="t-caption text-white/60 uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            Código de confirmación
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="t-headline text-success-light" style={{ letterSpacing: '0.05em' }}>
              {trip.confirmationCode}
            </span>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleCopyCode}
              aria-label="Copiar código de confirmación"
              className="w-10 h-10 rounded-full glass-raised flex items-center justify-center text-white/80 hover:text-white"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>content_copy</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/trips')}
          className="t-title neu-btn-primary w-full py-4 rounded-full text-white shadow-lg"
        >
          Ver Mis Viajes
        </motion.button>
      </div>
    </AppBackground>
  )
}
