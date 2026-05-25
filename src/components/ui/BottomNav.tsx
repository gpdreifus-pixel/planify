import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { path: '/results', icon: 'search' },
  { path: '/trips',   icon: 'luggage' },
  { path: '/community', icon: 'groups' },
  { path: '/profile', icon: 'person' },
]

interface BottomNavProps {
  /** Override active index (useful when path matching is ambiguous). */
  activeIndex?: number
}

export default function BottomNav({ activeIndex }: BottomNavProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[32px] neu-bottombar">
      <div className="flex items-center justify-around px-4 h-20 max-w-md mx-auto pb-safe">
        {NAV_ITEMS.map((item, idx) => {
          const isActive =
            activeIndex !== undefined
              ? activeIndex === idx
              : pathname.startsWith(item.path)

          return (
            <button
              key={item.path}
              aria-label={item.icon}
              onClick={() => navigate(item.path)}
            >
              <motion.div
                whileTap={{ scale: 0.84 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                className={`w-14 h-14 flex items-center justify-center ${
                  isActive ? 'neu-nav-item-active' : 'text-white/70 hover:text-white/90'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: isActive ? 28 : 24,
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                      : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  {item.icon}
                </span>
              </motion.div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
