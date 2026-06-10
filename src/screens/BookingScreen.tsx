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
import html2pdf from 'html2pdf.js'

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
  const { bookTrip, trips } = useTripsStore()
  const { criteria } = useChatStore()
  const [isBooking, setIsBooking] = useState(false)

  const property = selectedProperty ?? MOCK_PROPERTIES[0]

  // Check if already booked
  const existingTrip = trips.find(
    (t) => t.property.id === property.id && ['confirmed', 'upcoming', 'active'].includes(t.status)
  )

  // ── Derive dates from criteria ────────────────────────────────────────
  const getCheckInDate = (): string => {
    const raw = criteria.departureDate ?? ''
    // Try to parse an ISO date first
    const parsed = new Date(raw)
    if (!isNaN(parsed.getTime()) && raw.match(/\d{4}-\d{2}-\d{2}/)) {
      return raw
    }
    // Default: next Saturday from today
    const today = new Date()
    const daysUntilSat = (6 - today.getDay() + 7) % 7 || 7
    const nextSat = new Date(today)
    nextSat.setDate(today.getDate() + daysUntilSat)
    return nextSat.toISOString().split('T')[0]
  }

  const getNights = (): number => {
    const raw = (criteria.returnDate ?? '').toLowerCase()
    // Parse chip responses like "Un finde 2d", "Una semana 7d", "Dos semanas 14d"
    const match = raw.match(/(\d+)\s*d/)
    if (match) return parseInt(match[1], 10)
    if (raw.includes('finde') || raw.includes('weekend')) return 2
    if (raw.includes('semana') && raw.includes('dos')) return 14
    if (raw.includes('semana')) return 7
    return 7 // default
  }

  const getTravelers = (): number => {
    if (typeof criteria.travelers === 'number') return criteria.travelers
    const raw = String(criteria.travelers ?? '').toLowerCase()
    if (raw.includes('solo') || raw.includes('🧳')) return 1
    if (raw.includes('pareja') || raw.includes('💑')) return 2
    if (raw.includes('amigos') || raw.includes('👯')) return 4
    if (raw.includes('familia') || raw.includes('👨')) return 4
    // Try to parse a number
    const num = parseInt(raw, 10)
    if (!isNaN(num) && num > 0) return num
    return 1
  }

  const checkIn = getCheckInDate()
  const nights = getNights()
  const travelers = getTravelers()
  const checkOutDate = new Date(checkIn)
  checkOutDate.setDate(checkOutDate.getDate() + nights)
  const checkOut = checkOutDate.toISOString().split('T')[0]

  const handleBook = async () => {
    if (existingTrip) {
      navigate('/trips')
      return
    }

    setIsBooking(true)
    await new Promise((r) => setTimeout(r, 1200))
    const newTrip = bookTrip(property, criteria, checkIn, checkOut, travelers)
    navigate('/booking-confirmation', { state: { trip: newTrip } })
  }

  const totalEstimate = property.pricePerNight * nights + 850 + 220 + 45

  const handleSharePDF = () => {
    const element = document.getElementById('booking-summary-pdf')
    if (!element) return

    const opt = {
      margin:       15,
      filename:     `Planify_Viaje_${property.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0d0d0d' },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    }

    html2pdf().set(opt).from(element).save()
  }

  return (
    <AppBackground variant="chat">
      <TopAppBar 
        backTo={`/results/${id}`} 
        title="Reservar tu viaje" 
        rightSlot={
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSharePDF}
            className="w-10 h-10 rounded-full glass-raised flex items-center justify-center text-white hover:bg-white/10"
            title="Compartir en PDF"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>share</span>
          </motion.button>
        }
      />

      <main id="booking-summary-pdf" className="flex-1 relative z-10 px-6 pb-72 max-w-md mx-auto w-full">
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
              USD{travelers > 1 ? ' / por persona' : ''}
            </p>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                marginTop: '0.5rem',
                lineHeight: 1.4,
              }}
            >
              * Precio estimado sujeto a cambios de disponibilidad y plataformas.
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
                ? property.pricePerNight * nights
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
        {existingTrip ? (
          <div className="w-full rounded-[2rem] glass-molded p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                Código de reserva
              </span>
              <span className="font-mono font-bold text-white tracking-widest bg-white/10 px-3 py-1 rounded-lg">
                {existingTrip.confirmationCode}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/trips')}
              className="w-full h-12 rounded-full flex items-center justify-center gap-2 text-white font-bold border border-white/20"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1rem',
                background: 'linear-gradient(to right, #22c55e, #16a34a)',
                boxShadow: '0 8px 25px rgba(34,197,94,0.3)',
              }}
            >
              Volver a Mis Viajes
            </motion.button>
          </div>
        ) : (
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
        )}
      </div>

      <BottomNav />
    </AppBackground>
  )
}
