import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import { useAuthStore } from '../store/authStore'
import type { UserPreferences } from '../types'

const STEPS = ['welcome', 'preferences', 'ready'] as const

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const { user, userPreferences, setPreferences, setOnboardingComplete } = useAuthStore()
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const step = STEPS[idx]

  const advance = () => {
    if (idx < STEPS.length - 1) {
      setDir(1)
      setIdx((i) => i + 1)
    } else {
      setOnboardingComplete()
      navigate('/chat/1', { replace: true })
    }
  }

  const variants = {
    enter: (d: number) => ({ x: d * 32, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: -d * 32, opacity: 0 }),
  }

  return (
    <AppBackground variant="chat">
      <div className="relative z-10 flex flex-col min-h-dvh px-6 max-w-md mx-auto w-full">
        {/* Top spacer */}
        <div style={{ height: '8vh' }} />

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === idx ? 28 : 8,
                background:
                  i === idx
                    ? 'rgba(255,255,255,0.95)'
                    : i < idx
                    ? 'rgba(255,255,255,0.55)'
                    : 'rgba(255,255,255,0.22)',
              }}
              className="h-2 rounded-full"
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
          ))}
        </div>

        {/* Step card */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="glass-panel rounded-[32px] px-6 py-8 flex flex-col items-center gap-6"
            >
              {step === 'welcome' && (
                <WelcomeStep name={user?.name.split(' ')[0] ?? 'Viajero'} />
              )}
              {step === 'preferences' && (
                <PrefsStep prefs={userPreferences} setPrefs={setPreferences} />
              )}
              {step === 'ready' && <ReadyStep />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA button */}
        <div className="py-8">
          <motion.button
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.14 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={advance}
            className="t-title w-full h-[72px] rounded-full neu-btn-primary relative overflow-hidden group flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer pointer-events-none" />
            <span>{step === 'ready' ? 'Planificá tu primer viaje' : 'Continuar'}</span>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              arrow_forward
            </span>
          </motion.button>
        </div>
      </div>
    </AppBackground>
  )
}

// ─── Step: Welcome ────────────────────────────────────────────────────────────

function WelcomeStep({ name }: { name: string }) {
  return (
    <>
      <motion.div
        initial={{ scale: 0.55, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.06, type: 'spring', stiffness: 280, damping: 20 }}
        className="w-24 h-24 rounded-3xl glass-raised flex items-center justify-center"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 52, color: '#ffb597' }}
        >
          flight_takeoff
        </span>
      </motion.div>

      <div className="text-center flex flex-col gap-3">
        <h1 className="t-display-xl text-white" style={{ fontSize: '2.25rem' }}>
          ¡Bienvenido/a,
          <br />
          {name}!
        </h1>
        <p className="t-body text-white/70" style={{ lineHeight: 1.65 }}>
          Planify es tu asistente de viajes personal. En 10 preguntas armamos el itinerario ideal para vos.
        </p>
      </div>
    </>
  )
}

// ─── Step: Preferences ───────────────────────────────────────────────────────

function PrefsStep({
  prefs,
  setPrefs,
}: {
  prefs: UserPreferences
  setPrefs: (p: Partial<UserPreferences>) => void
}) {
  const currencies = ['USD', 'EUR', 'ARS'] as const

  return (
    <>
      <div className="text-center flex flex-col gap-2 w-full">
        <h2 className="t-headline-lg text-white">Personalizá tu experiencia</h2>
        <p className="t-body-sm text-white/70">Podés cambiarlo cuando quieras desde tu perfil.</p>
      </div>

      {/* Currency */}
      <div className="glass-surface rounded-2xl p-4 flex flex-col gap-3 w-full">
        <p className="t-label text-white/90">Moneda</p>
        <div className="flex gap-2" role="radiogroup" aria-label="Moneda preferida">
          {currencies.map((c) => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.94 }}
              onClick={() => setPrefs({ currency: c })}
              role="radio"
              aria-checked={prefs.currency === c}
              className={`t-label flex-1 py-3 rounded-full transition-all ${
                prefs.currency === c
                  ? 'neu-btn-primary text-white'
                  : 'neu-pressed text-white/65 hover:text-white/85'
              }`}
            >
              {c}
            </motion.button>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Step: Ready ─────────────────────────────────────────────────────────────

function ReadyStep() {
  return (
    <>
      <motion.div
        initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.06, type: 'spring', stiffness: 260, damping: 18 }}
        className="w-24 h-24 rounded-3xl glass-raised flex items-center justify-center"
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 52,
            color: '#ffb597',
            fontVariationSettings: "'FILL' 1",
          }}
        >
          check_circle
        </span>
      </motion.div>

      <div className="text-center flex flex-col gap-3">
        <h1 className="t-display-xl text-white">¡Todo listo!</h1>
        <p className="t-body text-white/70" style={{ lineHeight: 1.65 }}>
          Ya podés planificar tu primer viaje. Contestá 10 preguntas y encontramos el lugar perfecto para vos.
        </p>
      </div>
    </>
  )
}
