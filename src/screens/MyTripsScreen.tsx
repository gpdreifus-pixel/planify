import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useTripsStore } from '../store/tripsStore'
import { useSearchStore } from '../store/searchStore'
import { MOCK_PROPERTIES } from '../data/mockData'
import { staggerContainer, staggerItem } from '../animations/transitions'
import type { Trip } from '../types'

type TripTab = 'active' | 'past' | 'saved'

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  upcoming:  { label: 'Próximo',      color: '#ff6b1f', bg: 'rgba(255,107,31,0.20)' },
  confirmed: { label: 'Confirmado',   color: '#4ade80', bg: 'rgba(74,222,128,0.18)' },
  active:    { label: 'En curso',     color: '#c9bfff', bg: 'rgba(201,191,255,0.18)' },
  completed: { label: 'Completado',   color: 'rgba(255,255,255,0.55)', bg: 'rgba(255,255,255,0.10)' },
  cancelled: { label: 'Cancelado',    color: '#ffb4ab', bg: 'rgba(255,180,171,0.15)' },
  planning:  { label: 'Planificando', color: '#ffb597', bg: 'rgba(255,181,151,0.20)' },
}

function TripCard({ trip, onPress }: { trip: Trip; onPress: () => void }) {
  const status = STATUS_LABELS[trip.status] ?? STATUS_LABELS.planning
  const nights =
    (new Date(trip.checkOut).getTime() - new Date(trip.checkIn).getTime()) /
    (1000 * 60 * 60 * 24)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })

  const progress = trip.status === 'confirmed' || trip.status === 'completed' ? 100 :
                   trip.status === 'active' ? 65 : 35

  return (
    <motion.div
      variants={staggerItem}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      onClick={onPress}
      className="glass-molded rounded-3xl overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-3xl">
        <img
          src={trip.property.images[0]}
          alt={trip.property.name}
          className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* Status badge */}
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full font-semibold text-[10px] uppercase tracking-wide"
          style={{
            background: status.bg,
            color: status.color,
            border: `1px solid ${status.color}40`,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            backdropFilter: 'blur(8px)',
          }}
        >
          {status.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: 'white',
          }}
        >
          {trip.property.name}
        </h2>
        <p
          className="flex items-center gap-1 text-white/70 text-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span className="material-symbols-outlined text-white/50" style={{ fontSize: 16 }}>calendar_month</span>
          {formatDate(trip.checkIn)} — {formatDate(trip.checkOut)}
          <span className="ml-1">· {nights}n</span>
        </p>

        {/* Progress bar */}
        <div className="mt-1 flex flex-col gap-1">
          <div className="flex justify-between">
            <span
              className="text-white/50 uppercase tracking-widest"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.625rem' }}
            >
              Progreso del viaje
            </span>
            <span
              className="text-white/50"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.625rem' }}
            >
              {progress}%
            </span>
          </div>
          <div className="h-1.5 w-full glass-pressed rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
                boxShadow: '0 0 8px rgba(255,107,31,0.7)',
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span
            className="text-white/55 text-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {trip.property.location}
          </span>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1rem',
              fontWeight: 700,
              color: 'white',
            }}
          >
            ${trip.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function MyTripsScreen() {
  const navigate = useNavigate()
  const { trips } = useTripsStore()
  const { savedPropertyIds, results } = useSearchStore()
  const [activeTab, setActiveTab] = useState<TripTab>('active')

  const upcoming = trips.filter((t) => ['upcoming', 'confirmed', 'active', 'planning'].includes(t.status))
  const past = trips.filter((t) => ['completed', 'cancelled'].includes(t.status))

  // Resolve saved properties from known results — fall back to mock data
  const knownProperties = results.length > 0 ? results : MOCK_PROPERTIES
  const savedProperties = knownProperties.filter((p) => savedPropertyIds.includes(p.id))

  const displayTrips = activeTab === 'past' ? past : upcoming

  const TAB_LABELS: Record<TripTab, string> = {
    active: 'Activos',
    past: 'Pasados',
    saved: 'Guardados',
  }

  return (
    <AppBackground variant="chat">
      <TopAppBar
        title="Mis Viajes"
        rightSlot={
          <motion.button
            whileTap={{ scale: 0.90 }}
            className="w-10 h-10 rounded-full glass-raised flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span>
          </motion.button>
        }
      />

      {/* Tab switcher */}
      <div className="px-6 max-w-md mx-auto w-full relative z-10 pb-4">
        <div className="glass-pressed rounded-full p-1 flex">
          {(['active', 'past', 'saved'] as TripTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold relative ${
                activeTab === t ? 'text-white' : 'text-white/55 hover:text-white/75'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {activeTab === t && (
                <motion.div
                  layoutId="trips-tab-pill"
                  className="absolute inset-0 glass-raised rounded-full shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1">
                {TAB_LABELS[t]}
                {/* Badge for saved count */}
                {t === 'saved' && savedProperties.length > 0 && (
                  <span
                    className="inline-flex items-center justify-center rounded-full"
                    style={{
                      minWidth: 16,
                      height: 16,
                      background: activeTab === 'saved' ? 'rgba(255,107,31,0.80)' : 'rgba(255,255,255,0.20)',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: 'white',
                      padding: '0 4px',
                    }}
                  >
                    {savedProperties.length}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 relative z-10 px-6 pb-32 max-w-md mx-auto w-full">
        {/* ── Saved tab ── */}
        {activeTab === 'saved' && (
          savedProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 72, color: 'rgba(255,255,255,0.20)' }}
              >
                favorite_border
              </span>
              <h3
                className="text-white mt-4"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: 700 }}
              >
                Nada guardado aún
              </h3>
              <p
                className="mt-2 max-w-xs text-white/50"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem', lineHeight: 1.55 }}
              >
                Tocá el corazón en cualquier propiedad para guardarla aquí.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/results')}
                className="mt-6 neu-btn-primary px-8 py-3 rounded-full text-white"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
              >
                Explorar propiedades
              </motion.button>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-3"
            >
              {savedProperties.map((property) => (
                <motion.div
                  key={property.id}
                  variants={staggerItem}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  onClick={() => navigate(`/results/${property.id}`)}
                  className="glass-molded rounded-2xl p-3 flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-white font-semibold truncate"
                      style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9375rem' }}
                    >
                      {property.name}
                    </p>
                    <p
                      className="text-white/55 truncate"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.8rem' }}
                    >
                      {property.location}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span style={{ fontSize: 12, color: '#ffb597' }}>★</span>
                      <span
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.70)', fontWeight: 600 }}
                      >
                        {property.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, color: 'white' }}
                    >
                      ${property.pricePerNight}
                    </span>
                    <span
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}
                    >
                      /noche
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        )}

        {/* ── Active / Past tabs ── */}
        {activeTab !== 'saved' && (
          trips.length === 0 || displayTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 72, color: 'rgba(255,255,255,0.20)' }}
              >
                luggage
              </span>
              <h3
                className="text-white mt-4"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: 700 }}
              >
                Todavía no tenés viajes
              </h3>
              <p
                className="mt-2 max-w-xs text-white/50"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem', lineHeight: 1.55 }}
              >
                Empezá a planificar tu próxima aventura.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/chat/1')}
                className="mt-6 neu-btn-primary px-8 py-3 rounded-full text-white"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
              >
                Planificar viaje
              </motion.button>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-4"
            >
              {displayTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onPress={() => navigate(`/results/${trip.property.id}`)}
                />
              ))}
            </motion.div>
          )
        )}
      </main>

      {/* FAB */}
      <div className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-6 z-40">
        <motion.button
          whileTap={{ scale: 0.90 }}
          whileHover={{ scale: 1.12, boxShadow: '0 12px 30px rgba(255,107,31,0.6)' }}
          transition={{ type: 'spring', stiffness: 380, damping: 20 }}
          onClick={() => navigate('/chat/1')}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #ff8c42, #ff6b1f)',
            boxShadow: '0 8px 20px rgba(255,107,31,0.4)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <span className="material-symbols-outlined text-white" style={{ fontSize: 26 }}>add</span>
        </motion.button>
      </div>

      <BottomNav activeIndex={1} />
    </AppBackground>
  )
}
