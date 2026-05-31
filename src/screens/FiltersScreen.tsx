import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSearchStore } from '../store/searchStore'
import type { AccommodationType } from '../types'

const TYPES: { value: AccommodationType; label: string; icon: string }[] = [
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'hostel', label: 'Hostel', icon: '🛏️' },
  { value: 'apartment', label: 'Apartamento', icon: '🏠' },
  { value: 'resort', label: 'Resort', icon: '🌴' },
  { value: 'boutique', label: 'Boutique', icon: '✨' },
]

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recomendado' },
  { value: 'price-asc',   label: 'Menor precio' },
  { value: 'price-desc',  label: 'Mayor precio' },
  { value: 'rating',      label: 'Mejor rating' },
] as const

export default function FiltersScreen() {
  const navigate = useNavigate()
  const { filters, setFilters, applyFilters } = useSearchStore()

  const toggleType = (type: AccommodationType) => {
    const current = filters.types
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    setFilters({ types: updated })
  }

  const handleClose = () => navigate('/results')

  const handleApply = () => {
    applyFilters()
    navigate('/results')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: -1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose}
      />

      {/* Sheet — dark theme */}
      <motion.div
        className="relative bg-[#2a2438] w-full max-w-md mx-auto rounded-t-[32px] overflow-hidden shadow-2xl"
        style={{ maxHeight: '90dvh', overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-0">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.375rem',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
            }}
          >
            Filtros
          </h2>
          <button
            onClick={handleClose}
            className="neu-icon-btn w-9 h-9 flex items-center justify-center text-white"
            aria-label="Cerrar filtros"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 flex flex-col gap-6">

          {/* Sort */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.75rem',
              }}
            >
              Ordenar por
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((opt) => {
                const active = filters.sortBy === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFilters({ sortBy: opt.value })}
                    className="py-2.5 px-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: active ? '#FF6B1F' : 'rgba(255,255,255,0.7)',
                      background: active
                        ? 'rgba(255,107,31,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      border: active ? '1px solid rgba(255,107,31,0.30)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accommodation type */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.75rem',
              }}
            >
              Tipo de alojamiento
            </h3>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => {
                const active = filters.types.includes(t.value)
                return (
                  <button
                    key={t.value}
                    onClick={() => toggleType(t.value)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: active ? '#FF6B1F' : 'rgba(255,255,255,0.7)',
                      background: active ? 'rgba(255,107,31,0.15)' : 'rgba(255,255,255,0.05)',
                      border: active ? '1px solid rgba(255,107,31,0.30)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <span>{t.icon}</span>
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Price range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                Precio por noche
              </h3>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#FF6B1F',
                }}
              >
                hasta ${filters.priceMax}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={filters.priceMax}
              onChange={(e) => setFilters({ priceMax: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#FF6B1F' }}
            />
            <div className="flex justify-between mt-1">
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>$0</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>$1000</span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.75rem',
              }}
            >
              Rating mínimo
            </h3>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map((r) => {
                const active = filters.rating === r
                return (
                  <button
                    key={r}
                    onClick={() => setFilters({ rating: r })}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.8125rem',
                      color: active ? '#FF6B1F' : 'rgba(255,255,255,0.7)',
                      background: active ? 'rgba(255,107,31,0.15)' : 'rgba(255,255,255,0.05)',
                      border: active ? '1px solid rgba(255,107,31,0.30)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {r === 0 ? 'Todos' : `${r}★`}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-1">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleClose}
              className="flex-1 py-3.5 rounded-full font-semibold"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.9375rem',
                color: 'rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Limpiar
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleApply}
              className="flex-[2] py-3.5 rounded-full text-white font-bold"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                background: '#FF6B1F',
                boxShadow: '0 4px 16px rgba(255,107,31,0.4)',
              }}
            >
              Aplicar filtros
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
