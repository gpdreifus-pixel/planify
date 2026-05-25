import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useSearchStore } from '../store/searchStore'
import { useTripsStore } from '../store/tripsStore'
import { MOCK_PROPERTIES } from '../data/mockData'
import { staggerContainer, staggerItem } from '../animations/transitions'

export default function TripDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedProperty, selectProperty, toggleSavedProperty, isPropertySaved } = useSearchStore()
  const { trips } = useTripsStore()

  useEffect(() => {
    if (id) selectProperty(id)
  }, [id, selectProperty])

  const property = selectedProperty ?? MOCK_PROPERTIES[0]
  const isSaved = isPropertySaved(property.id)
  // Check if user already has a live booking for this property
  const existingTrip = trips.find(
    (t) => t.property.id === property.id && ['confirmed', 'upcoming', 'active'].includes(t.status)
  )

  return (
    <AppBackground variant="chat">
      {/* Transparent top bar over hero image */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <TopAppBar
          backTo="/results"
          title=""
          rightSlot={
            <motion.button
              whileTap={{ scale: 0.88, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              onClick={() => toggleSavedProperty(property.id)}
              className="w-10 h-10 rounded-full glass-raised flex items-center justify-center"
              aria-label={isSaved ? 'Quitar de guardados' : 'Guardar propiedad'}
              style={{ WebkitTapHighlightColor: 'transparent', willChange: 'transform' }}
            >
              <motion.span
                key={String(isSaved)}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  color: isSaved ? '#ff6b1f' : 'rgba(255,255,255,0.90)',
                  fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                favorite
              </motion.span>
            </motion.button>
          }
        />
      </div>

      <main className="flex-1 relative z-10 pb-32 max-w-md mx-auto w-full">
        {/* Hero image */}
        <div className="relative h-[340px] overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          {/* Name overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2
              className="text-white drop-shadow-lg"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.875rem',
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              {property.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="material-symbols-outlined text-white/80" style={{ fontSize: 16 }}>location_on</span>
              <span
                className="text-white/80"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
              >
                {property.location}
              </span>
            </div>
          </div>
        </div>

        <motion.div
          className="px-5 pt-5 pb-6 flex flex-col gap-5"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Rating + price row */}
          <motion.div variants={staggerItem} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 16,
                      color: s <= Math.round(property.rating) ? '#ffb597' : 'rgba(255,255,255,0.25)',
                    }}
                  >★</span>
                ))}
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                {property.rating}
              </span>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                ({property.reviewCount})
              </span>
            </div>
            <div>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '1.625rem',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                ${property.pricePerNight}
              </span>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.60)',
                  marginLeft: '0.2rem',
                }}
              >
                /noche
              </span>
            </div>
          </motion.div>

          {/* Social pill — glass-raised rounded-full */}
          <motion.div
            variants={staggerItem}
            className="glass-raised rounded-full p-2 pr-5 flex items-center gap-3 cursor-pointer border border-white/25"
          >
            <div className="w-9 h-9 rounded-full glass-raised flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="material-symbols-outlined text-white/80" style={{ fontSize: 18 }}>person</span>
            </div>
            <div className="flex-1">
              <p
                className="text-white font-semibold drop-shadow-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem' }}
              >
                A Marte le encantó este lugar
              </p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ fontSize: 12, color: '#ffb597' }}>★</span>
                ))}
              </div>
            </div>
            <span className="material-symbols-outlined text-white/70" style={{ fontSize: 18 }}>chevron_right</span>
          </motion.div>

          {/* Description */}
          <motion.div variants={staggerItem}>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.5rem',
              }}
            >
              Descripción
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.9rem',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.80)',
                fontWeight: 300,
              }}
            >
              {property.description}
            </p>
          </motion.div>

          {/* Amenities */}
          <motion.div variants={staggerItem}>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.75rem',
              }}
            >
              Lo que incluye
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity.label}
                  className="glass-surface flex items-center gap-2.5 p-3 rounded-xl"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20, color: '#ffb597' }}
                  >
                    {amenity.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.8rem',
                      color: 'rgba(255,255,255,0.88)',
                    }}
                  >
                    {amenity.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activities */}
          <motion.div variants={staggerItem}>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.75rem',
              }}
            >
              Actividades en la zona
            </h3>
            <div className="flex flex-col gap-2">
              {['Playa y snorkel 🤿', 'Tour cultural histórico 🏛️', 'Gastronomía local 🍴', 'Senderismo 🥾'].map((act) => (
                <div
                  key={act}
                  className="glass-surface flex items-center justify-between p-3.5 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.875rem',
                      color: 'rgba(255,255,255,0.88)',
                    }}
                  >
                    {act}
                  </span>
                  <span className="material-symbols-outlined text-white/50" style={{ fontSize: 18 }}>
                    arrow_forward
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Price breakdown — glass-surface */}
          <motion.div variants={staggerItem}>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.75rem',
              }}
            >
              Desglose de precio
            </h3>
            <div className="glass-surface rounded-2xl p-4 flex flex-col gap-3">
              {[
                { label: '7 noches × $120', value: '$840' },
                { label: 'Impuestos y tasas', value: '$67' },
                { label: 'Servicio Planify', value: '$0' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.875rem',
                      color: 'rgba(255,255,255,0.70)',
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-white/15">
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  Total Final
                </span>
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  $907
                </span>
              </div>
              <p
                className="text-center"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                Sin sorpresas — precio final
              </p>
            </div>
          </motion.div>

          {/* Map link */}
          <motion.div variants={staggerItem}>
            <button
              onClick={() => navigate('/results/map')}
              className="flex items-center gap-2 hover:opacity-75 transition-opacity"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <span className="material-symbols-outlined text-white/60" style={{ fontSize: 20 }}>map</span>
              Ver en el mapa
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Floating CTA — adapts to existing booking state */}
      <div className="fixed bottom-24 left-0 right-0 px-6 z-40 max-w-md mx-auto">
        {existingTrip ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/booking/${property.id}`)}
            className="w-full h-14 rounded-full flex items-center justify-center gap-2 border border-white/20 text-white font-bold"
            style={{
              background: 'linear-gradient(to right, #22c55e, #16a34a)',
              boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.0625rem',
              fontWeight: 700,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            Ver links de reserva
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/booking/${property.id}`)}
            className="w-full h-14 rounded-full flex items-center justify-center gap-2 border border-white/20 text-white font-bold"
            style={{
              background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
              boxShadow: '0 4px 20px rgba(255,107,31,0.5)',
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.0625rem',
              fontWeight: 700,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            Ir a reservar
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
          </motion.button>
        )}
      </div>

      <BottomNav activeIndex={1} />
    </AppBackground>
  )
}
