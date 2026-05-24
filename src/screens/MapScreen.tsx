import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useSearchStore } from '../store/searchStore'
import { MOCK_PROPERTIES } from '../data/mockData'

export default function MapScreen() {
  const navigate = useNavigate()
  const { filteredResults } = useSearchStore()
  const properties = filteredResults.length > 0 ? filteredResults : MOCK_PROPERTIES

  return (
    <AppBackground variant="app">
      <TopAppBar backTo="/results" title="Mapa" />

      <main className="flex-1 relative z-10 max-w-md mx-auto w-full pb-28">
        {/* Map placeholder */}
        <div
          className="mx-6 rounded-3xl overflow-hidden mb-6"
          style={{
            height: '50vh',
            background: 'linear-gradient(135deg, rgba(116,89,247,0.3) 0%, rgba(91,60,221,0.2) 100%)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <span className="material-symbols-outlined text-white/40" style={{ fontSize: 64 }}>map</span>
          <p
            className="text-white/40 text-center"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
          >
            Mapa interactivo
          </p>
          <p
            className="text-white/30 text-center"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem' }}
          >
            (Requiere integración con Maps API)
          </p>
        </div>

        {/* Property list */}
        <div className="px-6 flex flex-col gap-3">
          <h3
            className="text-white font-bold"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem' }}
          >
            Propiedades en el mapa
          </h3>
          {properties.map((property) => (
            <motion.div
              key={property.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/results/${property.id}`)}
              className="neu-card p-3 flex items-center gap-3 cursor-pointer"
            >
              <img
                src={property.images[0]}
                alt={property.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-white font-semibold truncate"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
                >
                  {property.name}
                </p>
                <p
                  className="text-white/50 truncate"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem' }}
                >
                  {property.location}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className="text-white font-bold"
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem' }}
                >
                  ${property.pricePerNight}
                </span>
                <span
                  className="text-white/50"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.7rem' }}
                >
                  /noche
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav activeIndex={0} />
    </AppBackground>
  )
}
