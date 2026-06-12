import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import ConfirmSheet from '../components/ui/ConfirmSheet'
import { useAuthStore } from '../store/authStore'
import { useTripsStore } from '../store/tripsStore'
import { useUIStore } from '../store/uiStore'
import { staggerContainer, staggerItem } from '../animations/transitions'

export default function ProfileScreen() {
  const { user, logout, userPreferences, setPreferences, updateProfile, isLoading } = useAuthStore()
  const { trips } = useTripsStore()
  const showToast = useUIStore((s) => s.showToast)
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
            className="t-label px-4 h-10 rounded-full glass-raised flex items-center justify-center text-white disabled:opacity-50"
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
                aria-label="Cancelar edición"
                className="absolute top-2 left-2 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white"
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
                    maxLength={50}
                    aria-label="Nombre"
                    className="t-headline-sm w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-center text-white"
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Escribe algo sobre ti..."
                    maxLength={160}
                    aria-label="Biografía"
                    className="t-label font-normal w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-center text-white/80 resize-none h-24"
                  />
                </div>
              ) : (
                <>
                  <h2 className="t-headline text-white">{user?.name ?? 'Viajero'}</h2>
                  <p className="t-label font-normal text-white/65">{user?.email ?? ''}</p>
                  {user?.bio && (
                    <p className="t-label font-normal text-white/80 mt-2" style={{ lineHeight: 1.6 }}>
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
                <span className="t-headline text-white">{stat.value}</span>
                <span className="t-caption text-white/65">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Badges */}
          {user?.badges && user.badges.length > 0 && (
            <motion.div variants={staggerItem} className="glass-surface rounded-3xl p-4">
              <h3 className="t-cta text-white mb-3">Logros</h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className="t-label px-3 py-1.5 rounded-full"
                    style={{
                      fontSize: '0.8125rem',
                      background: 'rgba(116,89,247,0.18)',
                      border: '1px solid rgba(116,89,247,0.30)',
                      color: '#c9bfff',
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
              <h3 className="t-cta text-white">Preferencias</h3>
            </div>

            {/* Currency */}
            <div
              className="px-5 py-3 flex items-center gap-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,0.50)' }}>
                payments
              </span>
              <span className="t-body-sm flex-1 text-white/85">Moneda</span>
              <div className="flex gap-1.5" role="radiogroup" aria-label="Moneda">
                {(['USD', 'EUR', 'ARS'] as const).map((c) => {
                  const active = userPreferences.currency === c
                  return (
                    <motion.button
                      key={c}
                      whileTap={{ scale: 0.91 }}
                      onClick={() => setPreferences({ currency: c })}
                      role="radio"
                      aria-checked={active}
                      className="t-caption font-semibold px-3 py-2 rounded-full transition-all"
                      style={{
                        background: active ? 'rgba(255,140,66,0.22)' : 'rgba(255,255,255,0.07)',
                        border: `1px solid ${active ? 'rgba(255,140,66,0.45)' : 'rgba(255,255,255,0.12)'}`,
                        color: active ? '#ff8c42' : 'rgba(255,255,255,0.65)',
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
              <span className="t-body-sm flex-1 text-white/85">Notificaciones</span>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setPreferences({ notifications: !userPreferences.notifications })}
                role="switch"
                aria-checked={userPreferences.notifications}
                aria-label="Notificaciones"
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
                onClick={() => showToast(`${item.label}: disponible próximamente`, 'info')}
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
                <span className="t-body-sm flex-1 text-left text-white/90">{item.label}</span>
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
              className="t-body-sm font-semibold w-full py-4 rounded-2xl glass-surface flex items-center justify-center gap-2"
              style={{
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
          <ConfirmSheet
            icon="logout"
            title="¿Cerrar sesión?"
            message="Tendrás que volver a ingresar con tus credenciales la próxima vez."
            confirmLabel="Cerrar sesión"
            busyLabel="Saliendo..."
            destructive
            busy={loggingOut}
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutConfirm(false)}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </AppBackground>
  )
}
