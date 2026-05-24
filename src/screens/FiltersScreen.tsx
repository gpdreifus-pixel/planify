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
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose}
      />

      {/* Sheet — glass-bottom-sheet */}
      <motion.div
        className="relative glass-bottom-sheet w-full max-w-md mx-auto rounded-t-[32px] overflow-hidden"
        style={{ maxHeight: '90dvh', overflowY: 'auto' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.375rem',
              fontWeight: 700,
              color: '#93441A',
              lineHeight: 1.2,
            }}
          >
            Filtros
          </h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{
              background: 'rgba(255,255,255,0.6)',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.9)',
            }}
            aria-label="Cerrar filtros"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#5a4137' }}>close</span>
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
                color: '#1b1c1c',
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
                      color: active ? '#FF6B1F' : '#5a4137',
                      background: active
                        ? 'white'
                        : 'rgba(255,255,255,0.5)',
                      border: active ? '1px solid rgba(255,107,31,0.20)' : '1px solid white',
                      boxShadow: active
                        ? 'inset 2px 2px 6px rgba(0,0,0,0.05)'
                        : '4px 4px 8px rgba(0,0,0,0.05), -4px -4px 8px rgba(255,255,255,0.8)',
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
                color: '#1b1c1c',
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
                      color: active ? '#FF6B1F' : '#5a4137',
                      background: active ? 'white' : 'rgba(255,255,255,0.5)',
                      border: active ? '1px solid rgba(255,107,31,0.20)' : '1px solid white',
                      boxShadow: active
                        ? 'inset 2px 2px 6px rgba(0,0,0,0.05)'
                        : '4px 4px 8px rgba(0,0,0,0.05), -4px -4px 8px rgba(255,255,255,0.8)',
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
                  color: '#1b1c1c',
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
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem', color: '#8e7166' }}>$0</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem', color: '#8e7166' }}>$1000</span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#1b1c1c',
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
                      color: active ? '#FF6B1F' : '#5a4137',
                      background: active ? 'white' : 'rgba(255,255,255,0.5)',
                      border: active ? '1px solid rgba(255,107,31,0.20)' : '1px solid white',
                      boxShadow: active
                        ? 'inset 2px 2px 6px rgba(0,0,0,0.05)'
                        : '4px 4px 8px rgba(0,0,0,0.05), -4px -4px 8px rgba(255,255,255,0.8)',
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
                color: '#5a4137',
                background: 'rgba(255,255,255,0.5)',
                border: '1px solid white',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.05), -4px -4px 8px rgba(255,255,255,0.8)',
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
