import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useTripsStore } from '../store/tripsStore'
import { useSearchStore } from '../store/searchStore'
import { MOCK_PROPERTIES } from '../data/mockData'
import { staggerContainer, staggerItem } from '../animations/transitions'
import type { Trip } from '../types'
import html2pdf from 'html2pdf.js'

type TripTab = 'active' | 'past' | 'saved'

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  upcoming:  { label: 'Próximo',      color: '#ff6b1f', bg: 'rgba(255,107,31,0.20)' },
  confirmed: { label: 'Confirmado',   color: '#4ade80', bg: 'rgba(74,222,128,0.18)' },
  active:    { label: 'En curso',     color: '#c9bfff', bg: 'rgba(201,191,255,0.18)' },
  completed: { label: 'Completado',   color: 'rgba(255,255,255,0.55)', bg: 'rgba(255,255,255,0.10)' },
  cancelled: { label: 'Cancelado',    color: '#ffb4ab', bg: 'rgba(255,180,171,0.15)' },
  planning:  { label: 'Planificando', color: '#ffb597', bg: 'rgba(255,181,151,0.20)' },
}

function TripCard({ trip, onPress, onDelete }: { trip: Trip; onPress: () => void; onDelete: () => void }) {
  const status = STATUS_LABELS[trip.status] ?? STATUS_LABELS.planning
  const nights =
    (new Date(trip.checkOut).getTime() - new Date(trip.checkIn).getTime()) /
    (1000 * 60 * 60 * 24)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })

  const progress = trip.status === 'confirmed' || trip.status === 'completed' ? 100 :
                   trip.status === 'active' ? 65 : 35

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const element = document.getElementById(`trip-pdf-template-${trip.id}`)
    if (!element) return

    const opt = {
      margin:       5,
      filename:     `Planify_Reserva_${trip.property.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    }

    html2pdf().set(opt).from(element).save()
  }

  return (
    <motion.div
      id={`trip-card-${trip.id}`}
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
        {/* Share button */}
        <button
          onClick={handleShare}
          aria-label="Descargar comprobante en PDF"
          className="absolute top-3 left-3 w-10 h-10 rounded-full glass-raised flex items-center justify-center text-white/80 hover:text-white"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
        </button>
        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="Eliminar viaje"
          className="absolute top-3 left-[3.75rem] w-10 h-10 rounded-full glass-raised flex items-center justify-center text-white/80 hover:text-[#ffb4ab] transition-colors"
          title="Eliminar viaje"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="t-title text-white">{trip.property.name}</h2>
        <p className="t-label font-normal flex items-center gap-1 text-white/75">
          <span className="material-symbols-outlined text-white/50" style={{ fontSize: 16 }}>calendar_month</span>
          {formatDate(trip.checkIn)} — {formatDate(trip.checkOut)}
          <span className="ml-1">· {nights}n</span>
        </p>

        {/* Progress bar */}
        <div className="mt-1 flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="t-caption text-white/60 uppercase tracking-widest" style={{ fontSize: '0.625rem' }}>
              Progreso del viaje
            </span>
            <span className="t-caption text-white/60" style={{ fontSize: '0.625rem' }}>
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
          <span className="t-label font-normal text-white/65">{trip.property.location}</span>
          <span className="t-cta text-white">${trip.totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Hidden PDF Template for MyTrips */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id={`trip-pdf-template-${trip.id}`} style={{ padding: '40px', fontFamily: 'sans-serif', color: '#000', backgroundColor: '#fff', width: '800px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#ff6b1f', fontWeight: 'bold' }}>Planify - Resumen de Viaje</h1>
          <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#111' }}>{trip.property.name}</h2>
          <p style={{ fontSize: '16px', color: '#555', marginBottom: '30px' }}>
            Del {formatDate(trip.checkIn)} al {formatDate(trip.checkOut)} ({nights} noches) para {trip.travelers} viajero{trip.travelers > 1 ? 's' : ''}
          </p>

          <div style={{ marginBottom: '40px', fontSize: '24px', fontWeight: 'bold', color: '#111', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
            Total Pagado: ${trip.totalPrice.toLocaleString()} USD
          </div>

          <div style={{ fontSize: '16px', marginBottom: '12px', color: '#333' }}>
            <strong>Estado de la reserva:</strong> <span style={{ color: '#ff6b1f', backgroundColor: '#fff0e6', padding: '4px 8px', borderRadius: '4px' }}>{status.label}</span>
          </div>
          
          <div style={{ fontSize: '16px', marginBottom: '30px', color: '#333' }}>
            <strong>Código de Confirmación:</strong> <span style={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>{trip.confirmationCode}</span>
          </div>

          <div style={{ marginTop: '50px', fontSize: '14px', color: '#999', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            Este documento es un comprobante generado por Planify.<br/>
            Si necesitas asistencia, contacta al soporte técnico.
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function MyTripsScreen() {
  const navigate = useNavigate()
  const { trips, deleteTrip } = useTripsStore()
  const { savedPropertyIds, results } = useSearchStore()
  const [activeTab, setActiveTab] = useState<TripTab>('active')
  const [tripToDelete, setTripToDelete] = useState<string | null>(null)

  const confirmDelete = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete)
      setTripToDelete(null)
    }
  }

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
      {/* Sin rightSlot: el ícono de notificaciones anterior no tenía acción
          asociada — un control muerto comunica funcionalidad que no existe. */}
      <TopAppBar title="Mis Viajes" />

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
                    <p className="t-section truncate text-white">{property.name}</p>
                    <p className="t-caption truncate text-white/65" style={{ fontSize: '0.8rem' }}>
                      {property.location}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span style={{ fontSize: 12, color: '#ffb597' }}>★</span>
                      <span className="t-caption font-semibold text-white/75">{property.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="t-cta text-white">${property.pricePerNight}</span>
                    <span className="t-caption text-white/55" style={{ fontSize: '0.7rem' }}>/noche</span>
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
                  onDelete={() => setTripToDelete(trip.id)}
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
          aria-label="Planificar un nuevo viaje"
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

      <BottomNav />

      <AnimatePresence>
        {tripToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setTripToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-molded rounded-3xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>delete_forever</span>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                ¿Eliminar este viaje?
              </h3>
              <p className="text-white/70 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem' }}>
                Esta acción no se puede deshacer y el viaje se borrará de tu historial.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTripToDelete(null)}
                  className="flex-1 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.95rem' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-full bg-[#ffb4ab] text-black font-bold hover:bg-[#ff8f82] transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.95rem' }}
                >
                  Sí, eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppBackground>
  )
}
