import { memo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import EmptyState from '../components/ui/EmptyState'
import ConfirmSheet from '../components/ui/ConfirmSheet'
import TabSwitcher from '../components/ui/TabSwitcher'
import SmartImage from '../components/ui/SmartImage'
import { useTripsStore } from '../store/tripsStore'
import { useSearchStore } from '../store/searchStore'
import { MOCK_PROPERTIES } from '../data/mockData'
import { staggerContainer, staggerItem } from '../animations/transitions'
import { usePriceFormatter } from '../utils/currency'
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

// Callbacks reciben el trip/id (estables en el padre) para que memo sea efectivo
const TripCard = memo(function TripCard({ trip, onPress, onDelete }: { trip: Trip; onPress: (trip: Trip) => void; onDelete: (id: string) => void }) {
  const status = STATUS_LABELS[trip.status] ?? STATUS_LABELS.planning
  const { currency, fmt } = usePriceFormatter()
  const nights =
    (new Date(trip.checkOut).getTime() - new Date(trip.checkIn).getTime()) /
    (1000 * 60 * 60 * 24)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })

  const progress = trip.status === 'confirmed' || trip.status === 'completed' ? 100 :
                   trip.status === 'active' ? 65 : 35

  const handleShare = async (e: React.MouseEvent) => {
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

    // html2pdf pesa ~100KB: se carga recién cuando el usuario pide el PDF
    const html2pdf = (await import('html2pdf.js')).default
    html2pdf().set(opt).from(element).save()
  }

  return (
    <motion.div
      id={`trip-card-${trip.id}`}
      variants={staggerItem}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      onClick={() => onPress(trip)}
      className="glass-molded rounded-3xl overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-3xl">
        <SmartImage
          src={trip.property.images[0]}
          alt={trip.property.name}
          className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal"
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
            onDelete(trip.id)
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
          <span className="t-cta text-white">{fmt(trip.totalPrice)}</span>
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
            Total Pagado: {fmt(trip.totalPrice)} {currency}
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
})

export default function MyTripsScreen() {
  const navigate = useNavigate()
  const { trips, deleteTrip } = useTripsStore()
  const { savedPropertyIds, results } = useSearchStore()
  const { fmt } = usePriceFormatter()
  const [activeTab, setActiveTab] = useState<TripTab>('active')
  const [tripToDelete, setTripToDelete] = useState<string | null>(null)

  const confirmDelete = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete)
      setTripToDelete(null)
    }
  }

  const handleTripPress = useCallback((trip: Trip) => {
    navigate(`/results/${trip.property.id}`)
  }, [navigate])

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
        <TabSwitcher<TripTab>
          layoutId="trips-tab-pill"
          active={activeTab}
          onChange={setActiveTab}
          tabs={[
            { value: 'active', label: TAB_LABELS.active },
            { value: 'past', label: TAB_LABELS.past },
            { value: 'saved', label: TAB_LABELS.saved, badge: savedProperties.length },
          ]}
        />
      </div>

      <main className="flex-1 relative z-10 px-6 pb-32 max-w-md mx-auto w-full">
        {/* ── Saved tab ── */}
        {activeTab === 'saved' && (
          savedProperties.length === 0 ? (
            <EmptyState
              icon="favorite_border"
              title="Nada guardado aún"
              description="Tocá el corazón en cualquier propiedad para guardarla aquí."
              cta={{ label: 'Explorar propiedades', onPress: () => navigate('/results') }}
            />
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
                  <SmartImage
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
                    <span className="t-cta text-white">{fmt(property.pricePerNight)}</span>
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
            <EmptyState
              icon="luggage"
              title="Todavía no tenés viajes"
              description={activeTab === 'past'
                ? 'Cuando completes un viaje va a aparecer acá.'
                : 'Empezá a planificar tu próxima aventura.'}
              cta={{ label: 'Planificar viaje', onPress: () => navigate('/chat/1') }}
            />
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
                  onPress={handleTripPress}
                  onDelete={setTripToDelete}
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
          <ConfirmSheet
            icon="delete_forever"
            title="¿Eliminar este viaje?"
            message="Esta acción no se puede deshacer y el viaje se borrará de tu historial."
            confirmLabel="Sí, eliminar"
            destructive
            onConfirm={confirmDelete}
            onCancel={() => setTripToDelete(null)}
          />
        )}
      </AnimatePresence>
    </AppBackground>
  )
}
