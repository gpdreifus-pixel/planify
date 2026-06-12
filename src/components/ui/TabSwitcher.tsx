import { motion } from 'framer-motion'

export interface TabOption<T extends string> {
  value: T
  label: string
  /** Contador opcional (p.ej. cantidad de guardados) */
  badge?: number
}

interface TabSwitcherProps<T extends string> {
  tabs: TabOption<T>[]
  active: T
  onChange: (value: T) => void
  /** Único por pantalla — identifica el pill animado compartido de framer */
  layoutId: string
}

/** Segmented control glass unificado (MyTrips, Community). */
export default function TabSwitcher<T extends string>({
  tabs,
  active,
  onChange,
  layoutId,
}: TabSwitcherProps<T>) {
  return (
    <div className="glass-pressed rounded-full p-1 flex" role="tablist">
      {tabs.map((t) => {
        const isActive = active === t.value
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.value)}
            className={`t-label flex-1 py-3 rounded-full relative ${
              isActive ? 'text-white' : 'text-white/60 hover:text-white/80'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 glass-raised rounded-full shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1">
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span
                  className="inline-flex items-center justify-center rounded-full text-white"
                  style={{
                    minWidth: 16,
                    height: 16,
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '0 4px',
                    background: isActive ? 'rgba(255,107,31,0.80)' : 'rgba(255,255,255,0.20)',
                  }}
                >
                  {t.badge}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
