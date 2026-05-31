import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import type { Trip } from '../types'

export default function BookingConfirmationScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const trip = (location.state as { trip?: Trip })?.trip

  useEffect(() => {
    if (!trip) {
      navigate('/trips', { replace: true })
    }
  }, [trip, navigate])

  if (!trip) return null

  return (
    <AppBackground variant="chat">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
          className="w-24 h-24 rounded-full bg-[#4ade80]/20 flex items-center justify-center mb-6"
        >
          <span className="material-symbols-outlined text-[#4ade80]" style={{ fontSize: 48, fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}
        >
          ¡Reserva Exitosa!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: 1.5 }}
        >
          Tu aventura en <strong className="text-white font-semibold">{trip.property.name}</strong> está lista.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-surface p-6 rounded-3xl w-full mb-8 flex flex-col gap-2"
        >
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Código de confirmación
          </span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#4ade80', letterSpacing: '0.05em' }}>
            {trip.confirmationCode}
          </span>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/trips')}
          className="neu-btn-primary w-full py-4 rounded-full text-white font-bold shadow-lg"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.125rem' }}
        >
          Ver Mis Viajes
        </motion.button>
      </div>
    </AppBackground>
  )
}
