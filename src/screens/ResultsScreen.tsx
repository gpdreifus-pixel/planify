import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useSearchStore } from '../store/searchStore'
import type { Property } from '../types'
import { staggerContainer, staggerItem } from '../animations/transitions'

// Reads store directly to avoid prop-drilling saved state into every card
function SaveButton({ propertyId }: { propertyId: string }) {
  const { toggleSavedProperty, isPropertySaved } = useSearchStore()
  const saved = isPropertySaved(propertyId)
  return (
    <motion.button
      whileTap={{ scale: 0.80, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      onClick={(e) => { e.stopPropagation(); toggleSavedProperty(propertyId) }}
      className="absolute top-3 right-3 w-9 h-9 rounded-full glass-raised flex items-center justify-center z-10"
      aria-label={saved ? 'Quitar de guardados' : 'Guardar propiedad'}
      style={{ WebkitTapHighlightColor: 'transparent', willChange: 'transform' }}
    >
      <motion.span
        key={String(saved)}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className="material-symbols-outlined"
        style={{
          fontSize: 18,
          color: saved ? '#ff6b1f' : 'rgba(255,255,255,0.85)',
          fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        favorite
      </motion.span>
    </motion.button>
  )
}

/** Structured shimmer placeholder matching the card's layout */
function SkeletonCard() {
  return (
    <div className="glass-surface rounded-3xl overflow-hidden">
      <div className="h-48 skeleton-line" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-5 skeleton-line rounded-lg w-3/4" />
        <div className="h-4 skeleton-line rounded-lg w-1/2" />
        <div className="flex justify-between mt-1">
          <div className="h-4 skeleton-line rounded-lg w-1/3" />
          <div className="h-4 skeleton-line rounded-lg w-1/4" />
        </div>
        <div className="h-9 skeleton-line rounded-full mt-1" />
      </div>
    </div>
  )
}

function PropertyCard({ property, onPress }: { property: Property; onPress: () => void }) {
  return (
    <motion.div
      variants={staggerItem}
      whileTap={{ scale: 0.975 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      onClick={onPress}
      className="glass-surface rounded-3xl overflow-hidden cursor-pointer group"
    >
      {/* Image — mix-blend-luminosity */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover opacity-90 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {/* Save button — top right */}
        <SaveButton propertyId={property.id} />
        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="t-caption font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ background: 'rgba(255,107,31,0.88)' }}
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Name overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="t-title text-white drop-shadow-lg">{property.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="t-label font-normal text-white/75">{property.location}</p>
            <div className="flex items-center gap-1 mt-1">
              <span style={{ color: '#ffb597', fontSize: '0.875rem' }}>★</span>
              <span className="t-label text-white">{property.rating}</span>
              <span className="t-caption text-white/65">({property.reviewCount})</span>
            </div>
          </div>
          <div className="text-right">
            <span className="t-headline-sm text-white">${property.pricePerNight}</span>
            <span className="t-caption text-white/70 ml-1">/ noche</span>
          </div>
        </div>

        {/* Ver detalle — orange gradient with arrow */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="t-label w-full flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 text-white"
          style={{
            background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
            boxShadow: '0 4px 12px rgba(255,140,66,0.4)',
          }}
          onClick={(e) => { e.stopPropagation(); onPress() }}
        >
          Ver detalle
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function ResultsScreen() {
  const navigate = useNavigate()
  const { filteredResults, isLoading, hasSearched } = useSearchStore()

  const handlePropertyPress = (property: Property) => {
    navigate(`/results/${property.id}`)
  }

  return (
    <AppBackground variant="chat">
      <TopAppBar
        backTo="/chat/summary"
        title="Resultados"
        rightSlot={
          <motion.button
            whileTap={{ scale: 0.90 }}
            onClick={() => navigate('/results/filters')}
            aria-label="Abrir filtros"
            className="w-10 h-10 rounded-full glass-raised flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>tune</span>
          </motion.button>
        }
      />

      <main className="flex-1 relative z-10 px-6 pb-32 max-w-md mx-auto w-full">
        {/* Subtitle row */}
        <div className="flex items-center justify-between mb-5">
          <p className="t-label font-normal text-white/75" aria-live="polite">
            {isLoading
              ? 'Buscando...'
              : hasSearched
              ? `${filteredResults.length} opciones encontradas`
              : 'Explorá las mejores opciones'}
          </p>
          <button
            onClick={() => navigate('/results/map')}
            aria-label="Ver resultados en el mapa"
            className="t-label font-normal text-white/75 flex items-center gap-1 py-2 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>map</span>
            Mapa
          </button>
        </div>

        {/* Loading skeletons — structured shimmer matching card layout */}
        {isLoading && (
          <motion.div
            className="flex flex-col gap-4"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.3 }}
              >
                <SkeletonCard />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Results */}
        {!isLoading && (
          <motion.div
            className="flex flex-col gap-5"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {(hasSearched ? filteredResults : []).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onPress={() => handlePropertyPress(property)}
              />
            ))}

            {/* Empty state — filtered */}
            {hasSearched && filteredResults.length === 0 && (
              <div className="text-center py-16">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 64, color: 'rgba(255,255,255,0.25)' }}
                >
                  search_off
                </span>
                <p
                  className="mt-4"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: 'rgba(255,255,255,0.50)',
                  }}
                >
                  No encontramos resultados.
                </p>
                <button
                  onClick={() => navigate('/chat/1')}
                  className="mt-4 underline"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  Editar búsqueda
                </button>
              </div>
            )}

            {/* Not searched yet */}
            {!hasSearched && (
              <div className="text-center py-16">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 64, color: 'rgba(255,255,255,0.25)' }}
                >
                  travel_explore
                </span>
                <p
                  className="mt-4"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: 'rgba(255,255,255,0.50)',
                  }}
                >
                  Comenzá buscando tu próximo destino.
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/chat/1')}
                  className="mt-6 neu-btn-primary px-8 py-3 rounded-full text-white"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                >
                  Empezar búsqueda
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </main>

      <BottomNav />
    </AppBackground>
  )
}
