import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useAuthStore } from '../store/authStore'
import { useTripsStore } from '../store/tripsStore'
import { staggerContainer, staggerItem } from '../animations/transitions'

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, logout, userPreferences, setPreferences } = useAuthStore()
  const { trips } = useTripsStore()

  const completedTrips = trips.filter((t) => t.status === 'completed').length

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBackground variant="chat">
      <TopAppBar title="Mi Perfil" />

      <main className="flex-1 relative z-10 px-6 pb-28 max-w-md mx-auto w-full">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4"
        >
          {/* Profile header card */}
          <motion.div
            variants={staggerItem}
            className="glass-surface rounded-3xl p-6 flex flex-col items-center text-center gap-3"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover neu-icon-btn"
              />
            ) : (
              <div className="neu-icon-btn w-20 h-20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontSize: 36 }}>
                  person
                </span>
              </div>
            )}
            <div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                {user?.name ?? 'Viajero'}
              </h2>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.60)',
                }}
              >
                {user?.email ?? ''}
              </p>
            </div>
            {user?.bio && (
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.75)',
                  fontWeight: 300,
                }}
              >
                {user.bio}
              </p>
            )}
          </motion.div>

          {/* Stats row */}
          <motion.div variants={staggerItem} className="grid grid-cols-3 gap-3">
            {[
              { label: 'Viajes', value: trips.length },
              { label: 'Completados', value: completedTrips },
              { label: 'Reseñas', value: user?.reviewsCount ?? 0 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-surface rounded-2xl p-4 flex flex-col items-center gap-1"
              >
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '1.625rem',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Badges */}
          {user?.badges && user.badges.length > 0 && (
            <motion.div variants={staggerItem} className="glass-surface rounded-3xl p-4">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                Logros
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 rounded-full font-semibold"
                    style={{
                      background: 'rgba(116,89,247,0.18)',
                      border: '1px solid rgba(116,89,247,0.30)',
                      color: '#c9bfff',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.8125rem',
                    }}
                  >
                    🏆 {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Preferences */}
          <motion.div variants={staggerItem} className="glass-surface rounded-3xl overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                Preferencias
              </h3>
            </div>

            {/* Currency */}
            <div
              className="px-5 py-3 flex items-center gap-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,0.50)' }}>
                payments
              </span>
              <span
                className="flex-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)' }}
              >
                Moneda
              </span>
              <div className="flex gap-1.5">
                {(['USD', 'EUR', 'ARS'] as const).map((c) => {
                  const active = userPreferences.currency === c
                  return (
                    <motion.button
                      key={c}
                      whileTap={{ scale: 0.91 }}
                      onClick={() => setPreferences({ currency: c })}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        background: active ? 'rgba(255,140,66,0.22)' : 'rgba(255,255,255,0.07)',
                        border: `1px solid ${active ? 'rgba(255,140,66,0.45)' : 'rgba(255,255,255,0.12)'}`,
                        color: active ? '#ff8c42' : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      {c}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Language */}
            <div
              className="px-5 py-3 flex items-center gap-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,0.50)' }}>
                language
              </span>
              <span
                className="flex-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)' }}
              >
                Idioma
              </span>
              <div className="flex gap-1.5">
                {([{ val: 'es' as const, label: 'ES' }, { val: 'en' as const, label: 'EN' }]).map(({ val, label }) => {
                  const active = userPreferences.language === val
                  return (
                    <motion.button
                      key={val}
                      whileTap={{ scale: 0.91 }}
                      onClick={() => setPreferences({ language: val })}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        background: active ? 'rgba(255,140,66,0.22)' : 'rgba(255,255,255,0.07)',
                        border: `1px solid ${active ? 'rgba(255,140,66,0.45)' : 'rgba(255,255,255,0.12)'}`,
                        color: active ? '#ff8c42' : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      {label}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Notifications toggle */}
            <div
              className="px-5 py-3 flex items-center gap-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,0.50)' }}>
                notifications
              </span>
              <span
                className="flex-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)' }}
              >
                Notificaciones
              </span>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setPreferences({ notifications: !userPreferences.notifications })}
                style={{
                  width: 46,
                  height: 26,
                  borderRadius: 9999,
                  background: userPreferences.notifications ? 'rgba(255,140,66,0.30)' : 'rgba(255,255,255,0.09)',
                  border: `1px solid ${userPreferences.notifications ? 'rgba(255,140,66,0.45)' : 'rgba(255,255,255,0.14)'}`,
                  padding: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: userPreferences.notifications ? 'flex-end' : 'flex-start',
                  transition: 'background 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                }}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: userPreferences.notifications ? '#ff8c42' : 'rgba(255,255,255,0.35)',
                  }}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Menu items */}
          <motion.div variants={staggerItem} className="glass-surface rounded-3xl overflow-hidden">
            {[
              { icon: 'help',        label: 'Ayuda y soporte' },
              { icon: 'privacy_tip', label: 'Privacidad' },
              { icon: 'info',        label: 'Acerca de Planify' },
            ].map((item, i, arr) => (
              <motion.button
                key={item.label}
                whileTap={{ scale: 0.98, x: 3 }}
                whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.05)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="flex items-center gap-4 px-4 py-4 w-full"
                style={{
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 22, color: 'rgba(255,255,255,0.55)' }}
                >
                  {item.icon}
                </span>
                <span
                  className="flex-1 text-left"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.9375rem',
                    color: 'rgba(255,255,255,0.88)',
                  }}
                >
                  {item.label}
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18, color: 'rgba(255,255,255,0.30)' }}
                >
                  chevron_right
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Logout */}
          <motion.div variants={staggerItem}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl font-semibold glass-surface"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.9375rem',
                color: '#ffb4ab',
                border: '1px solid rgba(255,180,171,0.22)',
              }}
            >
              Cerrar sesión
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav activeIndex={3} />
    </AppBackground>
  )
}
