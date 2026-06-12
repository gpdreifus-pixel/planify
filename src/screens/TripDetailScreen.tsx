import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import SmartImage from '../components/ui/SmartImage'
import { useSearchStore } from '../store/searchStore'
import { useTripsStore } from '../store/tripsStore'
import { useChatStore } from '../store/chatStore'
import ReviewsModal from '../components/ui/ReviewsModal'
import { MOCK_PROPERTIES } from '../data/mockData'
import { staggerContainer, staggerItem } from '../animations/transitions'

export default function TripDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedProperty, selectProperty, toggleSavedProperty, isPropertySaved } = useSearchStore()
  const { trips } = useTripsStore()
  const { criteria } = useChatStore()
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    if (id) selectProperty(id)
  }, [id, selectProperty])

  const property = selectedProperty ?? MOCK_PROPERTIES[0]
  const isSaved = isPropertySaved(property.id)
  // Check if user already has a live booking for this property
  const existingTrip = trips.find(
    (t) => t.property.id === property.id && ['confirmed', 'upcoming', 'active'].includes(t.status)
  )

  // Determine matches
  const searchKeywords = [...(criteria.activities || []), ...(criteria.extras || [])]
    .map(k => k.toLowerCase().replace(/[^\w\s\-áéíóúüñ]/gi, '').trim())
    .filter(Boolean)

  const matchedAmenities = property.amenities.filter(a => {
    const label = a.label.toLowerCase().replace(/[^\w\s\-áéíóúüñ]/gi, '').trim()
    return searchKeywords.some(kw => kw.includes(label) || label.includes(kw))
  })
  
  const matchedTags = property.tags.filter(t => {
    const tag = t.toLowerCase().replace(/[^\w\s\-áéíóúüñ]/gi, '').trim()
    return searchKeywords.some(kw => kw.includes(tag) || tag.includes(kw))
  })
  
  const displayAmenities = matchedAmenities.length > 0 || matchedTags.length > 0 ? matchedAmenities : property.amenities.slice(0, 2)
  const displayTags = matchedAmenities.length > 0 || matchedTags.length > 0 ? matchedTags : []


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

      <main className="flex-1 relative z-10 pb-44 max-w-md mx-auto w-full">
        {/* Hero image — eager: está above-the-fold, lazy la demoraría */}
        <div className="relative h-[340px] overflow-hidden">
          <SmartImage
            src={property.images[0]}
            alt={property.name}
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          {/* Name overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="t-headline-lg text-white drop-shadow-lg">{property.name}</h2>
            <button
              onClick={() => navigate('/results/map')}
              className="flex items-center gap-1.5 mt-2 py-1 hover:opacity-80 transition-opacity text-left"
            >
              <span className="material-symbols-outlined text-white/90" style={{ fontSize: 16 }}>location_on</span>
              <span className="t-label font-medium text-white/90 underline decoration-white/40 underline-offset-4">
                {property.location} (Ver en mapa)
              </span>
            </button>
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
              <span className="t-label text-white">{property.rating}</span>
              <span className="t-caption text-white/65">({property.reviewCount})</span>
            </div>
            <div>
              <span className="t-headline text-white">${property.pricePerNight}</span>
              <span className="t-caption text-white/70 ml-1">/noche</span>
            </div>
          </motion.div>

          {/* Social pill — glass-raised rounded-full */}
          <motion.div
            variants={staggerItem}
            onClick={() => setShowReviews(true)}
            className="glass-raised rounded-full p-2 pr-5 flex items-center gap-3 cursor-pointer border border-white/25 hover:bg-white/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-full glass-raised flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="material-symbols-outlined text-white/80" style={{ fontSize: 18 }}>person</span>
            </div>
            <div className="flex-1">
              <p className="t-label text-white drop-shadow-sm">
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

          {/* Match con tu búsqueda */}
          <motion.div variants={staggerItem} className="glass-molded rounded-2xl p-4 border border-success/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-success" style={{ fontSize: 20 }}>check_circle</span>
              <h3 className="t-cta text-white">Match con tu búsqueda</h3>
            </div>
            <p className="t-caption text-white/75 mb-3">Este alojamiento tiene lo que buscas:</p>
            <div className="flex flex-wrap gap-2">
              {displayAmenities.map((am) => (
                <div key={am.label} className="bg-success/20 text-success px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-success/30">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{am.icon}</span>
                  <span className="t-caption font-semibold">{am.label}</span>
                </div>
              ))}
              {displayTags.map((t) => (
                <div key={t} className="bg-success/20 text-success px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-success/30">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>label</span>
                  <span className="t-caption font-semibold">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={staggerItem}>
            <h3 className="t-title text-white mb-2">Descripción</h3>
            <p className="t-body-sm text-white/80" style={{ lineHeight: 1.65 }}>
              {property.description}
            </p>
          </motion.div>

          {/* Amenities */}
          <motion.div variants={staggerItem}>
            <h3 className="t-title text-white mb-3">Lo que incluye</h3>
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
                  <span className="t-caption text-white/90" style={{ fontSize: '0.8rem' }}>
                    {amenity.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activities */}
          <motion.div variants={staggerItem}>
            <h3 className="t-title text-white mb-3">Actividades en la zona</h3>
            <div className="flex flex-col gap-2">
              {['Playa y snorkel 🤿', 'Tour cultural histórico 🏛️', 'Gastronomía local 🍴', 'Senderismo 🥾'].map((act) => (
                <div
                  key={act}
                  className="glass-surface flex items-center justify-between p-3.5 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="t-label font-normal text-white/90">{act}</span>
                  <span className="material-symbols-outlined text-white/50" style={{ fontSize: 18 }}>
                    arrow_forward
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Price breakdown — glass-surface */}
          <motion.div variants={staggerItem}>
            <h3 className="t-title text-white mb-3">Desglose de precio</h3>
            <div className="glass-surface rounded-2xl p-4 flex flex-col gap-3">
              {[
                { label: '7 noches × $120', value: '$840' },
                { label: 'Impuestos y tasas', value: '$67' },
                { label: 'Servicio Planify', value: '$0' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="t-label font-normal text-white/75">{row.label}</span>
                  <span className="t-label text-white">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-white/15">
                <span className="t-cta text-white">Total Final</span>
                <span className="t-headline text-white">$907</span>
              </div>
              <p className="t-caption text-white/65 text-center">Sin sorpresas — precio final</p>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* Floating CTA — adapts to existing booking state */}
      <div className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-0 right-0 px-6 z-40 max-w-md mx-auto">
        {existingTrip ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/booking/${property.id}`)}
            className="t-title w-full h-14 rounded-full flex items-center justify-center gap-2 border border-white/20 text-white"
            style={{
              background: 'linear-gradient(to right, #22c55e, #16a34a)',
              boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
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
            className="t-title w-full h-14 rounded-full flex items-center justify-center gap-2 border border-white/20 text-white"
            style={{
              background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
              boxShadow: '0 4px 20px rgba(255,107,31,0.5)',
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

      <BottomNav />

      <AnimatePresence>
        {showReviews && (
          <ReviewsModal onClose={() => setShowReviews(false)} propertyName={property.name} />
        )}
      </AnimatePresence>
    </AppBackground>
  )
}
