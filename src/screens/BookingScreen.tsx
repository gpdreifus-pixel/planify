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

  const handleSharePDF = async () => {
    const element = document.getElementById('booking-pdf-template')
    if (!element) return

    const opt = {
      margin:       15,
      filename:     `Planify_Viaje_${property.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    }

    // html2pdf pesa ~100KB: se carga recién cuando el usuario pide el PDF
    const html2pdf = (await import('html2pdf.js')).default
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
            aria-label="Descargar resumen en PDF"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>share</span>
          </motion.button>
        }
      />

      <main className="flex-1 relative z-10 px-6 pb-72 max-w-md mx-auto w-full">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-5"
        >
          {/* Info banner — glass-molded rounded-full */}
          <motion.div variants={staggerItem} className="glass-molded rounded-full px-6 py-4 flex items-start gap-4">
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#ffb68d' }}>info</span>
            <p className="t-label font-normal" style={{ color: 'rgba(255,181,141,0.90)' }}>
              Planify no procesa pagos. Te llevamos a reservar en cada plataforma original.
            </p>
          </motion.div>

          {/* Total summary card */}
          <motion.div variants={staggerItem} className="glass-molded rounded-[2rem] p-8 flex flex-col items-center text-center">
            <p className="t-caption font-semibold text-white/65 uppercase mb-3" style={{ letterSpacing: '0.2em' }}>
              Combo Total Estimado
            </p>
            <h2 className="t-display-xl text-white mb-1" style={{ fontSize: '3rem' }}>
              ${totalEstimate.toLocaleString()}
            </h2>
            <p className="t-body" style={{ color: '#ffb68d' }}>
              USD{travelers > 1 ? ' / por persona' : ''}
            </p>
            <p className="t-caption text-white/60 mt-2">
              * Precio estimado sujeto a cambios de disponibilidad y plataformas.
            </p>
          </motion.div>

          {/* Booking breakdown */}
          <motion.div variants={staggerItem} className="flex flex-col gap-4">
            <h3 className="t-headline-sm text-white">Desglose para Reservar</h3>

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
                      <p className="t-caption text-white/65 uppercase" style={{ fontSize: '0.6875rem', letterSpacing: '0.12em' }}>
                        {item.label}
                      </p>
                      <p className="t-cta text-white">
                        {item.label === 'Alojamiento' ? property.name : `${item.platform}`}
                      </p>
                    </div>
                  </div>

                  {/* Right: action button */}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    aria-label={`Reservar ${item.label} en ${item.platform}`}
                    className="raised-btn rounded-full px-4 py-3 flex items-center gap-2"
                  >
                    <span className="t-label text-white/95" style={{ fontSize: '0.8125rem' }}>
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
              <span className="t-label font-normal text-white/75">Código de reserva</span>
              <span className="font-mono font-bold text-white tracking-widest bg-white/10 px-3 py-1 rounded-lg">
                {existingTrip.confirmationCode}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/trips')}
              className="t-cta w-full h-12 rounded-full flex items-center justify-center gap-2 text-white border border-white/20"
              style={{
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
            className="t-title w-full h-16 rounded-full flex items-center justify-center gap-3 text-white disabled:opacity-60 border border-white/20"
            style={{
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

      {/* Hidden PDF Template for Booking */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="booking-pdf-template" style={{ padding: '40px', fontFamily: 'sans-serif', color: '#000', backgroundColor: '#fff', width: '800px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#ff6b1f', fontWeight: 'bold' }}>Planify - Tu Viaje a {property.name}</h1>
          <p style={{ fontSize: '16px', color: '#555', marginBottom: '30px' }}>
            Del {checkIn} al {checkOut} ({nights} noches) para {travelers} viajero{travelers > 1 ? 's' : ''}
          </p>

          <h2 style={{ fontSize: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            Resumen Estimado
          </h2>
          <div style={{ marginBottom: '40px', fontSize: '28px', fontWeight: 'bold', color: '#111' }}>
            Total: ${totalEstimate.toLocaleString()} USD
            <span style={{ fontSize: '16px', color: '#777', fontWeight: 'normal', marginLeft: '10px' }}>
              {travelers > 1 ? '/ por persona' : ''}
            </span>
          </div>

          <h2 style={{ fontSize: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            Desglose para Reservar
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {BOOKING_ITEMS.map((item) => {
              const price = item.priceKey === 'base' ? property.pricePerNight * nights : item.extra ?? 0
              const fakeUrl = `https://www.${item.platform.toLowerCase()}.com/planify-booking`
              return (
                <li key={item.label} style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#111' }}>
                    {item.label} — {item.label === 'Alojamiento' ? property.name : item.platform}
                  </div>
                  <div style={{ fontSize: '16px', marginBottom: '12px', color: '#444' }}>
                    Costo estimado: <strong style={{ color: '#22c55e' }}>${price}</strong>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', backgroundColor: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                    Link de reserva:{' '}
                    <a href={fakeUrl} style={{ color: '#0066cc', textDecoration: 'none', wordBreak: 'break-all' }}>{fakeUrl}</a>
                  </div>
                </li>
              )
            })}
          </ul>
          
          <div style={{ marginTop: '50px', fontSize: '14px', color: '#999', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            Este documento es un resumen estimado generado por Planify.<br/>
            Los precios finales están sujetos a disponibilidad en cada plataforma.
          </div>
        </div>
      </div>
    </AppBackground>
  )
}
