import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { path: '/results', icon: 'search', label: 'Buscar' },
  { path: '/trips',   icon: 'luggage', label: 'Viajes' },
  { path: '/community', icon: 'groups', label: 'Comunidad' },
  { path: '/profile', icon: 'person', label: 'Perfil' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[32px] neu-bottombar overflow-hidden">
      <div className="flex items-center justify-around px-4 h-20 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.path)

          return (
            <button
              key={item.path}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 min-w-16 py-1"
            >
              <motion.div
                whileTap={{ scale: 0.84 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                className={`w-12 h-12 flex items-center justify-center ${
                  isActive ? 'neu-nav-item-active' : 'text-white/70 hover:text-white/90'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: isActive ? 26 : 23,
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                      : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  {item.icon}
                </span>
              </motion.div>
              <span
                className={`text-[10px] leading-none font-semibold ${
                  isActive ? 'text-white' : 'text-white/60'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
      {/* Safe-area spacer — fills the home-indicator gap on iPhone X+ without
          shrinking the icon row, so the active bubble always has 80px to live in */}
      <div style={{ height: 'env(safe-area-inset-bottom)' }} />
    </nav>
  )
}
