import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import logoFullSrc from '../assets/logo-full.svg'

type Tab = 'login' | 'register' | 'forgot-password'

export default function AuthScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithSocial, register, resetPassword, isLoading, error, clearError, onboardingComplete } = useAuthStore()
  const { showToast } = useUIStore()
  // Read the initial tab from router state (set by HomeScreen buttons); default to login
  const initialTab = (location.state as { tab?: Tab } | null)?.tab ?? 'login'
  const [tab, setTab] = useState<Tab>(initialTab)

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPw, setShowLoginPw] = useState(false)

  // Register form
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPw, setShowRegPw] = useState(false)

  // Forgot password form
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(loginEmail, loginPassword)
      const from = (location.state as { from?: Location })?.from
      if (from) {
        navigate(from.pathname + from.search, { state: from.state, replace: true })
        return
      }
      // New users (onboardingComplete === false) go through onboarding first;
      // returning users land straight on results.
      navigate(onboardingComplete ? '/results' : '/onboarding')
    } catch {
      // error message surfaced via store.error + toast for visibility
      const errMsg = useAuthStore.getState().error
      if (errMsg) showToast(errMsg, 'error')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(regName, regEmail, regPassword)
      // Email verification required — onboarding runs after the link is clicked
      // and SIGNED_IN fires, which triggers the HomeScreen guard.
      navigate('/auth/verify', { state: { email: regEmail } })
    } catch {
      const errMsg = useAuthStore.getState().error
      if (errMsg) showToast(errMsg, 'error')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await resetPassword(resetEmail)
      setResetSent(true)
      showToast('Enlace enviado a tu correo', 'success')
    } catch {
      const errMsg = useAuthStore.getState().error
      if (errMsg) showToast(errMsg, 'error')
    }
  }

  const handleSocial = async (provider: 'google' | 'apple') => {
    try {
      await loginWithSocial(provider)
      // Browser redirects to OAuth provider — these lines only execute if the
      // call fails before redirect. HomeScreen guard handles onboarding on return.
      navigate('/')
    } catch {
      const errMsg = useAuthStore.getState().error
      if (errMsg) showToast(errMsg, 'error')
    }
  }

  const handleTabChange = (t: Tab) => {
    clearError()
    setTab(t)
  }

  return (
    <AppBackground variant="chat">
      <div className="relative z-10 flex flex-col min-h-dvh px-6 max-w-md mx-auto w-full">
        {/* Back button */}
        <div className="pt-12 pb-4">
          <motion.button
            onClick={() => navigate('/')}
            aria-label="Volver al inicio"
            className="neu-icon-btn w-10 h-10 flex items-center justify-center text-white"
            whileTap={{ scale: 0.90 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_back</span>
          </motion.button>
        </div>

        {/* Main glass card — 32px radius, glass-panel */}
        <motion.div
          className="glass-panel rounded-[32px] px-6 py-6 flex flex-col gap-5"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Brand header */}
          <div className="text-center relative z-10 flex flex-col items-center pointer-events-none">
            <img src={logoFullSrc} alt="Planify Logo" className="w-[200px] sm:w-[220px] h-auto -my-20 object-contain drop-shadow-md mb-2" />
            <p
              className="t-body text-white/90 drop-shadow-sm"
            >
              Tu viaje comienza aquí.
            </p>
          </div>

          {/* Tab switcher — neu-pressed container + neu-flat spring indicator */}
          {tab !== 'forgot-password' && (
            <div className="neu-pressed rounded-full p-1 flex relative z-10">
              {/* Sliding indicator — spring physics, no CSS transition needed */}
              <motion.div
                className="absolute top-1 bottom-1 neu-flat rounded-full pointer-events-none"
                style={{ width: 'calc(50% - 4px)', left: '4px' }}
                animate={{ x: tab === 'login' ? '0%' : '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
              <button
                onClick={() => handleTabChange('login')}
                aria-pressed={tab === 'login'}
                className={`t-label flex-1 py-3 text-center relative z-10 transition-colors drop-shadow-sm ${
                  tab === 'login' ? 'text-white' : 'text-white/60'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => handleTabChange('register')}
                aria-pressed={tab === 'register'}
                className={`t-label flex-1 py-3 text-center relative z-10 transition-colors drop-shadow-sm ${
                  tab === 'register' ? 'text-white' : 'text-white/60'
                }`}
              >
                Registrarse
              </button>
            </div>
          )}

          {/* Forms */}
          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-3 relative z-10"
                onSubmit={handleLogin}
              >
                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="t-label text-white/90 px-3 drop-shadow-sm">
                    Correo Electrónico
                  </label>
                  <div className="neu-pressed rounded-xl flex items-center px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
                    <span className="material-symbols-outlined text-white/70 mr-3" style={{ fontSize: 20 }}>mail</span>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="t-body-sm bg-transparent border-none outline-none text-white w-full placeholder:text-white/50 focus:ring-0 p-0"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="t-label text-white/90 px-3 drop-shadow-sm">
                    Contraseña
                  </label>
                  <div className="neu-pressed rounded-xl flex items-center px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
                    <span className="material-symbols-outlined text-white/70 mr-3" style={{ fontSize: 20 }}>lock</span>
                    <input
                      type={showLoginPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="t-body-sm bg-transparent border-none outline-none text-white w-full placeholder:text-white/50 focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPw((v) => !v)}
                      aria-label={showLoginPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="material-symbols-outlined text-white/55 hover:text-white/85 transition-colors flex-shrink-0 ml-2 p-1 -m-1"
                      style={{ fontSize: 20 }}
                    >
                      {showLoginPw ? 'visibility_off' : 'visibility'}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleTabChange('forgot-password')}
                    className="t-label py-1 text-white/90 hover:text-white transition-colors underline decoration-white/30 underline-offset-2"
                    style={{ fontSize: '0.8125rem' }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                  className="t-headline-sm w-full h-14 rounded-full neu-btn-primary relative overflow-hidden group flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer pointer-events-none" />
                  <span className="drop-shadow-sm">{isLoading ? 'Iniciando...' : 'Entrar'}</span>
                  {!isLoading && <span className="material-symbols-outlined drop-shadow-sm" style={{ fontSize: 22 }}>arrow_forward</span>}
                </motion.button>

                {/* Inline error — only shown when Supabase returns an error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="t-caption text-center"
                    style={{ fontSize: '0.8125rem', color: '#ffb4ab' }}
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.form>
            ) : tab === 'register' ? (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-3 relative z-10"
                onSubmit={handleRegister}
              >
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="t-label text-white/90 px-3 drop-shadow-sm">
                    Nombre
                  </label>
                  <div className="neu-pressed rounded-xl flex items-center px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
                    <span className="material-symbols-outlined text-white/70 mr-3" style={{ fontSize: 20 }}>person</span>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      autoComplete="name"
                      className="t-body-sm bg-transparent border-none outline-none text-white w-full placeholder:text-white/50 focus:ring-0 p-0"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="t-label text-white/90 px-3 drop-shadow-sm">
                    Correo Electrónico
                  </label>
                  <div className="neu-pressed rounded-xl flex items-center px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
                    <span className="material-symbols-outlined text-white/70 mr-3" style={{ fontSize: 20 }}>mail</span>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="t-body-sm bg-transparent border-none outline-none text-white w-full placeholder:text-white/50 focus:ring-0 p-0"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="t-label text-white/90 px-3 drop-shadow-sm">
                    Contraseña
                  </label>
                  <div className="neu-pressed rounded-xl flex items-center px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
                    <span className="material-symbols-outlined text-white/70 mr-3" style={{ fontSize: 20 }}>lock</span>
                    <input
                      type={showRegPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      aria-describedby="reg-password-hint"
                      className="t-body-sm bg-transparent border-none outline-none text-white w-full placeholder:text-white/50 focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPw((v) => !v)}
                      aria-label={showRegPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="material-symbols-outlined text-white/55 hover:text-white/85 transition-colors flex-shrink-0 ml-2 p-1 -m-1"
                      style={{ fontSize: 20 }}
                    >
                      {showRegPw ? 'visibility_off' : 'visibility'}
                    </button>
                  </div>
                  {/* Hint visible ANTES del error — el requisito no debería descubrirse fallando */}
                  <p
                    id="reg-password-hint"
                    className="t-caption px-3"
                    style={{
                      color: regPassword.length > 0 && regPassword.length < 8
                        ? '#ffb4ab'
                        : 'rgba(255,255,255,0.55)',
                      transition: 'color 0.2s',
                    }}
                  >
                    {regPassword.length > 0 && regPassword.length < 8
                      ? `Mínimo 8 caracteres — te faltan ${8 - regPassword.length}`
                      : 'Mínimo 8 caracteres'}
                  </p>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                  className="t-headline-sm w-full h-14 rounded-full neu-btn-primary relative overflow-hidden group flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer pointer-events-none" />
                  <span className="drop-shadow-sm">{isLoading ? 'Registrando...' : 'Crear Cuenta'}</span>
                  {!isLoading && <span className="material-symbols-outlined drop-shadow-sm" style={{ fontSize: 22 }}>arrow_forward</span>}
                </motion.button>

                {/* Inline error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="t-caption text-center"
                    style={{ fontSize: '0.8125rem', color: '#ffb4ab' }}
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.form>
            ) : (
              <motion.form
                key="forgot-password"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-3 relative z-10"
                onSubmit={handleResetPassword}
              >
                <div className="text-center mb-2">
                  <h2 className="t-headline-sm text-white">Recuperar Contraseña</h2>
                  <p className="t-label font-normal text-white/75 mt-1">
                    Te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                </div>

                {resetSent ? (
                  <div className="glass-pressed rounded-2xl p-4 text-center mt-2">
                    <span className="material-symbols-outlined text-success-light mb-2" style={{ fontSize: 32 }}>check_circle</span>
                    <p className="text-white/90 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Revisa tu correo electrónico (incluyendo la carpeta de spam) para encontrar el enlace de recuperación.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      <div className="neu-pressed rounded-xl flex items-center px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
                        <span className="material-symbols-outlined text-white/70 mr-3" style={{ fontSize: 20 }}>mail</span>
                        <input
                          type="email"
                          placeholder="tu@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                          autoComplete="email"
                          aria-label="Correo electrónico"
                          className="t-body-sm bg-transparent border-none outline-none text-white w-full placeholder:text-white/50 focus:ring-0 p-0"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.97 }}
                      disabled={isLoading}
                      className="t-title w-full h-14 rounded-full neu-btn-primary relative overflow-hidden group flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
                    >
                      <span className="drop-shadow-sm">{isLoading ? 'Enviando...' : 'Enviar Enlace'}</span>
                    </motion.button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="t-label mt-2 py-2 text-white/65 hover:text-white transition-colors text-center"
                >
                  Volver a iniciar sesión
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Divider */}
          {tab !== 'forgot-password' && (
            <>
              <div className="flex items-center gap-4 relative z-10 mt-2">
                <div className="flex-1 h-px bg-white/20" />
                <span className="t-caption text-white/75 drop-shadow-sm" style={{ fontSize: '0.8125rem' }}>
                  O continuar con
                </span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              {/* Social buttons */}
              <div className="flex gap-6 justify-center relative z-10">
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => handleSocial('google')}
              aria-label="Continuar con Google"
              className="neu-icon-btn w-14 h-14 flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="white"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
              </svg>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => handleSocial('apple')}
              aria-label="Continuar con Apple"
              className="neu-icon-btn w-14 h-14 flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.93 3.78 2.04-3.18 1.98-2.64 6.27.56 7.6-.66 1.48-1.54 2.82-2.99 3.37zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </motion.button>
            </div>
            </>
          )}
        </motion.div>

        {/* Bottom spacer */}
        <div className="flex-[0.4]" />
      </div>
    </AppBackground>
  )
}
