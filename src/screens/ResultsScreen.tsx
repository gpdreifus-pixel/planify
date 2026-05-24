import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useSearchStore } from '../store/searchStore'
import type { Property } from '../types'
import { staggerContainer, staggerItem } from '../animations/transitions'

function PropertyCard({ property, onPress }: { property: Property; onPress: () => void }) {
  return (
    <motion.div
      variants={staggerItem}
      whileTap={{ scale: 0.985 }}
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
        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-white font-semibold"
              style={{
                background: 'rgba(255,107,31,0.88)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.75rem',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Name overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3
            className="text-white drop-shadow-lg"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.125rem',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {property.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p
              className="text-white/75"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
            >
              {property.location}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span style={{ color: '#ffb597', fontSize: '0.875rem' }}>★</span>
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
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                ({property.reviewCount})
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.375rem',
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
              / noche
            </span>
          </div>
        </div>

        {/* Ver detalle — orange gradient with arrow */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-white/20 font-semibold text-white"
          style={{
            background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
            boxShadow: '0 4px 12px rgba(255,140,66,0.4)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.9rem',
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
            className="w-10 h-10 rounded-full glass-raised flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>tune</span>
          </motion.button>
        }
      />

      <main className="flex-1 relative z-10 px-6 pb-28 max-w-md mx-auto w-full">
        {/* Subtitle row */}
        <div className="flex items-center justify-between mb-5">
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.70)',
            }}
          >
            {isLoading
              ? 'Buscando...'
              : hasSearched
              ? `${filteredResults.length} opciones encontradas`
              : 'Explorá las mejores opciones'}
          </p>
          <button
            onClick={() => navigate('/results/map')}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.70)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>map</span>
            Mapa
          </button>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-surface rounded-3xl h-64 animate-pulse opacity-50" />
            ))}
          </div>
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

      <BottomNav activeIndex={0} />
    </AppBackground>
  )
}
