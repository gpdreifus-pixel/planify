import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import { useAuthStore } from '../store/authStore'
import { useSearchStore } from '../store/searchStore'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { recentSearches, viewedPropertyIds, results } = useSearchStore()

  // Resolve recently viewed properties for contextual display
  const allKnownProperties = results.length > 0 ? results : []
  const recentlyViewedProperties = viewedPropertyIds
    .slice(0, 3)
    .map((id) => allKnownProperties.find((p) => p.id === id))
    .filter(Boolean)

  const hasRecentSearches = recentSearches.length > 0

  return (
    <AppBackground variant="chat">
      <div className="relative z-10 flex flex-col min-h-dvh px-6 max-w-md mx-auto w-full">
        {/* Top spacer */}
        <div className="flex-1" />

        {/* Main glass card — 40px radius, bidirectional neu shadows */}
        <motion.div
          className="glass-panel rounded-[40px] px-8 py-10 flex flex-col gap-5"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
        >
          {/* Badge — neu-pressed pill with icon */}
          <div className="flex justify-center">
            <div className="neu-pressed rounded-full px-4 py-2 flex items-center gap-2">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, color: '#ffb597' }}
              >
                flight_takeoff
              </span>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.8125rem',
                  color: 'rgba(255,255,255,0.80)',
                  fontWeight: 500,
                }}
              >
                Tu próximo destino
              </span>
            </div>
          </div>

          {/* Heading — Stitch: 42px, font-medium (500), tracking-wider */}
          <h1
            className="text-white text-center"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '2.625rem',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '0.04em',
            }}
          >
            {isAuthenticated && user
              ? `Hola, ${user.name.split(' ')[0]}`
              : '¿A dónde te llevamos?'}
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/65 text-center"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {isAuthenticated ? '¿Qué estás planeando hoy?' : '10 preguntas. Tu viaje ideal.'}
          </p>

          {/* CTA — h-20 (80px) rounded-full neu-btn-primary with shimmer */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
            className="w-full h-20 rounded-full neu-btn-primary relative overflow-hidden group mt-1 flex items-center justify-center gap-2"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.125rem',
              fontWeight: 700,
              letterSpacing: '0.015em',
            }}
            onClick={() => navigate('/chat/1')}
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer pointer-events-none" />
            <span>Planificá un viaje</span>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              arrow_forward
            </span>
          </motion.button>

          {/* Sign-in link or returning user context */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/trips')}
              className="text-center text-white/55 hover:text-white/75 transition-colors"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9375rem' }}
            >
              Ver mis viajes{' '}
              <span className="text-white/85 font-semibold underline underline-offset-2">
                →
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="text-center text-white/55 hover:text-white/75 transition-colors"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9375rem' }}
            >
              ¿Ya tenés cuenta?{' '}
              <span className="text-white/85 font-semibold underline underline-offset-2">
                Iniciá sesión
              </span>
            </button>
          )}
        </motion.div>

        {/* Recent searches — only shown when there's history */}
        {isAuthenticated && hasRecentSearches && (
          <motion.div
            className="mt-5 flex flex-col gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.3, ease: 'easeOut' }}
          >
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                fontWeight: 600,
              }}
            >
              Búsquedas recientes
            </p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 3).map((rs) => (
                <motion.button
                  key={rs.id}
                  whileTap={{ scale: 0.95, opacity: 1 }}
                  whileHover={{ y: -2, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  onClick={() => navigate('/chat/1')}
                  className="glass-molded rounded-full px-4 py-2 flex items-center gap-2"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    willChange: 'transform',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 15, color: '#ffb597' }}
                  >
                    travel_explore
                  </span>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.8125rem',
                      color: 'rgba(255,255,255,0.85)',
                      fontWeight: 500,
                    }}
                  >
                    {rs.criteria.destination ?? 'Búsqueda guardada'}
                  </span>
                  {rs.resultsCount > 0 && (
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '0.6875rem',
                        color: 'rgba(255,255,255,0.40)',
                      }}
                    >
                      {rs.resultsCount} opciones
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recently viewed destinations — shown when there's view history */}
        {isAuthenticated && recentlyViewedProperties.length > 0 && (
          <motion.div
            className="mt-4 flex flex-col gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.3, ease: 'easeOut' }}
          >
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                fontWeight: 600,
              }}
            >
              Vistos recientemente
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
              {recentlyViewedProperties.map((p) => p && (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.95, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  onClick={() => navigate(`/results/${p.id}`)}
                  className="glass-molded rounded-2xl overflow-hidden flex-shrink-0 w-32"
                  style={{ WebkitTapHighlightColor: 'transparent', willChange: 'transform' }}
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-20 object-cover opacity-80"
                  />
                  <div className="px-2.5 py-2">
                    <p
                      className="text-white truncate"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      {p.name}
                    </p>
                    <p
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.6875rem', color: '#ffb597' }}
                    >
                      ${p.pricePerNight}/noche
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div className="flex-1" />
      </div>
    </AppBackground>
  )
}
