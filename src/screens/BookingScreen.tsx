import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useSearchStore } from '../store/searchStore'
import { useTripsStore } from '../store/tripsStore'
import { useChatStore } from '../store/chatStore'
import { MOCK_PROPERTIES } from '../data/mockData'
import { staggerContainer, staggerItem } from '../animations/transitions'

const BOOKING_ITEMS = [
  { icon: 'bed',            label: 'Alojamiento', platform: 'Airbnb',    priceKey: 'base' as const },
  { icon: 'flight_takeoff', label: 'Vuelo',       platform: 'Despegar',  extra: 850 },
  { icon: 'train',          label: 'Transporte',  platform: 'Uber',      extra: 220 },
  { icon: 'local_activity', label: 'Actividades', platform: 'Civitatis', extra: 45  },
]

export default function BookingScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedProperty } = useSearchStore()
  const { bookTrip } = useTripsStore()
  const { criteria } = useChatStore()
  const [isBooking, setIsBooking] = useState(false)

  const property = selectedProperty ?? MOCK_PROPERTIES[0]

  const handleBook = async () => {
    setIsBooking(true)
    await new Promise((r) => setTimeout(r, 1200))
    bookTrip(
      property,
      criteria,
      '2025-06-15',
      '2025-06-22',
      typeof criteria.travelers === 'number' ? criteria.travelers : 1
    )
    navigate('/trips')
  }

  const totalEstimate = property.pricePerNight * 7 + 850 + 220 + 45

  return (
    <AppBackground variant="chat">
      <TopAppBar backTo={`/results/${id}`} title="Reservar tu viaje" />

      <main className="flex-1 relative z-10 px-6 pb-52 max-w-md mx-auto w-full">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-5"
        >
          {/* Info banner — glass-molded rounded-full */}
          <motion.div variants={staggerItem} className="glass-molded rounded-full px-6 py-4 flex items-start gap-4">
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#ffb68d' }}>info</span>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.875rem',
                color: 'rgba(255,181,141,0.90)',
                lineHeight: 1.5,
              }}
            >
              Planify no procesa pagos. Te llevamos a reservar en cada plataforma original.
            </p>
          </motion.div>

          {/* Total summary card */}
          <motion.div variants={staggerItem} className="glass-molded rounded-[2rem] p-8 flex flex-col items-center text-center">
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.60)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: '0.75rem',
                fontWeight: 600,
              }}
            >
              Combo Total Estimado
            </p>
            <h2
              className="text-white font-bold mb-1"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '3rem', fontWeight: 700 }}
            >
              ${totalEstimate.toLocaleString()}
            </h2>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1rem',
                color: '#ffb68d',
              }}
            >
              USD / por persona
            </p>
          </motion.div>

          {/* Booking breakdown */}
          <motion.div variants={staggerItem} className="flex flex-col gap-4">
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'white',
              }}
            >
              Desglose para Reservar
            </h3>

            {BOOKING_ITEMS.map((item) => {
              const price = item.priceKey === 'base'
                ? property.pricePerNight * 7
                : item.extra ?? 0

              return (
                <div
                  key={item.label}
                  className="glass-molded rounded-full p-3 pr-5 flex items-center justify-between"
                >
                  {/* Left: icon + info */}
                  <div className="flex items-center gap-4">
                    <div className="icon-well-round w-14 h-14 flex items-center justify-center">
                      <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#ffb68d' }}>
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: '0.6875rem',
                          color: 'rgba(255,255,255,0.55)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: '1rem',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      >
                        {item.label === 'Alojamiento' ? property.name : `${item.platform}`}
                      </p>
                    </div>
                  </div>

                  {/* Right: action button */}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="raised-btn rounded-full px-4 py-2.5 flex items-center gap-2"
                  >
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '0.8125rem',
                        color: 'rgba(255,255,255,0.95)',
                        fontWeight: 600,
                      }}
                    >
                      {item.platform} ${price}
                    </span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)' }}>
                      open_in_new
                    </span>
                  </motion.button>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </main>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-0 right-0 px-6 z-40 max-w-md mx-auto">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleBook}
          disabled={isBooking}
          className="w-full h-16 rounded-full flex items-center justify-center gap-3 text-white font-bold disabled:opacity-60 border border-white/20"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.125rem',
            fontWeight: 700,
            background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
            boxShadow: '0 12px 40px rgba(255,107,31,0.5)',
          }}
        >
          <span>{isBooking ? 'Procesando...' : 'Ya reservé todo'}</span>
          {!isBooking && (
            <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          )}
        </motion.button>
      </div>

      <BottomNav activeIndex={0} />
    </AppBackground>
  )
}
