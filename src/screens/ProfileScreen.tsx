import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useAuthStore } from '../store/authStore'
import { useTripsStore } from '../store/tripsStore'
import { staggerContainer, staggerItem } from '../animations/transitions'

export default function ProfileScreen() {
  const { user, logout, userPreferences, setPreferences, updateProfile, isLoading } = useAuthStore()
  const { trips } = useTripsStore()
  const [loggingOut, setLoggingOut] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name ?? '')
  const [editBio, setEditBio] = useState(user?.bio ?? '')

  useEffect(() => {
    if (user && !isEditing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditName(user.name)
      setEditBio(user.bio ?? '')
    }
  }, [user, isEditing])

  const handleSave = async () => {
    try {
      await updateProfile(editName, editBio)
      setIsEditing(false)
    } catch {
      // error handled by store
    }
  }

  const completedTrips = trips.filter((t) => t.status === 'completed').length

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    // logout() clears all storage and then does window.location.href = '/'
    // so this component will be unmounted — no need to reset loggingOut.
    await logout()
  }

  return (
    <AppBackground variant="chat">
      <TopAppBar 
        title="Mi Perfil" 
        rightSlot={
          <motion.button
            whileTap={{ scale: 0.90 }}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isLoading && isEditing}
            className="px-4 h-9 rounded-full glass-raised flex items-center justify-center text-white font-semibold text-sm disabled:opacity-50"
          >
            {isEditing ? (isLoading ? 'Guardando...' : 'Guardar') : 'Editar'}
          </motion.button>
        }
      />

      <main className="flex-1 relative z-10 px-6 pb-32 max-w-md mx-auto w-full">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4"
        >
          {/* Profile header card */}
          <motion.div
            variants={staggerItem}
            className="glass-surface rounded-3xl p-6 flex flex-col items-center text-center gap-3 relative"
          >
            {isEditing && (
              <button 
                onClick={() => { setIsEditing(false); setEditName(user?.name ?? ''); setEditBio(user?.bio ?? '') }}
                className="absolute top-4 left-4 text-white/50 hover:text-white"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            )}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover neu-icon-btn"
              />
            ) : (
              <div className="neu-icon-btn w-20 h-20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white" style={{ fontSize: 36 }}>
                  person
                </span>
              </div>
            )}
            <div className="w-full px-4">
              {isEditing ? (
                <div className="flex flex-col gap-3 mt-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-center text-white font-bold"
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem' }}
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Escribe algo sobre ti..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-center text-white/80 resize-none h-24"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
                  />
                </div>
              ) : (
                <>
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
                  {user?.bio && (
                    <p
                      className="mt-2"
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
                </>
              )}
            </div>
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
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full py-4 rounded-2xl font-semibold glass-surface flex items-center justify-center gap-2"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.9375rem',
                color: '#ffb4ab',
                border: '1px solid rgba(255,180,171,0.22)',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              Cerrar sesión
            </motion.button>
          </motion.div>
        </motion.div>

      </main>

      {/* Logout Confirm Sheet */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loggingOut && setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              style={{ zIndex: 9998 }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[#2a2438] rounded-t-[32px] flex flex-col pt-6 pb-10 px-6 max-w-md mx-auto shadow-2xl"
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 9999 }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2 text-center" style={{ fontFamily: "'Syne', sans-serif" }}>¿Cerrar sesión?</h3>
              <p className="text-white/70 text-center mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Tendrás que volver a ingresar con tus credenciales la próxima vez.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={loggingOut}
                  className="flex-1 py-3.5 rounded-full neu-pressed text-white/80 hover:text-white font-semibold transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex-1 py-3.5 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(to right, #e74c3c, #c0392b)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {loggingOut ? 'Saliendo...' : 'Cerrar sesión'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </AppBackground>
  )
}
