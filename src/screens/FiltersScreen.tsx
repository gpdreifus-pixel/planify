import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSearchStore } from '../store/searchStore'
import { useUIStore } from '../store/uiStore'
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
  const { filters, setFilters, applyFilters, resetFilters } = useSearchStore()
  const showToast = useUIStore((s) => s.showToast)

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

  // Resetea valores con el sheet abierto: el usuario ve los controles volver
  // a su estado inicial en lugar de que el panel se cierre sin explicación.
  const handleClear = () => {
    resetFilters()
    showToast('Filtros restablecidos', 'info')
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
        className="relative bg-sheet-dark w-full max-w-md mx-auto rounded-t-[32px] overflow-hidden shadow-2xl"
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
          <h2 className="t-headline text-white">Filtros</h2>
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
            <h3 className="t-section text-white mb-3">Ordenar por</h3>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((opt) => {
                const active = filters.sortBy === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFilters({ sortBy: opt.value })}
                    aria-pressed={active}
                    className="t-label py-3 px-3 rounded-xl transition-all"
                    style={{
                      color: active ? 'var(--color-primary-container)' : 'rgba(255,255,255,0.8)',
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
            <h3 className="t-section text-white mb-3">Tipo de alojamiento</h3>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => {
                const active = filters.types.includes(t.value)
                return (
                  <button
                    key={t.value}
                    onClick={() => toggleType(t.value)}
                    aria-pressed={active}
                    className="t-label flex items-center gap-1.5 px-4 py-3 rounded-full transition-all"
                    style={{
                      color: active ? 'var(--color-primary-container)' : 'rgba(255,255,255,0.8)',
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
              <h3 className="t-section text-white">Precio por noche</h3>
              <span className="t-label font-bold" style={{ color: 'var(--color-primary-container)' }}>
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
              aria-label="Precio máximo por noche"
              style={{ accentColor: 'var(--color-primary-container)' }}
            />
            <div className="flex justify-between mt-1">
              <span className="t-caption text-white/65">$0</span>
              <span className="t-caption text-white/65">$1000</span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="t-section text-white mb-3">Rating mínimo</h3>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map((r) => {
                const active = filters.rating === r
                return (
                  <button
                    key={r}
                    onClick={() => setFilters({ rating: r })}
                    aria-pressed={active}
                    aria-label={r === 0 ? 'Cualquier rating' : `Rating mínimo ${r} estrellas`}
                    className="t-label flex-1 py-3 rounded-xl transition-all"
                    style={{
                      fontSize: '0.8125rem',
                      color: active ? 'var(--color-primary-container)' : 'rgba(255,255,255,0.8)',
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
              onClick={handleClear}
              className="t-label flex-1 py-3.5 rounded-full"
              style={{
                fontSize: '0.9375rem',
                color: 'rgba(255,255,255,0.85)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Limpiar
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleApply}
              className="t-cta flex-[2] py-3.5 rounded-full text-white"
              style={{
                background: 'var(--color-primary-container)',
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
