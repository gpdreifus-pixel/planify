import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import { useCommunityStore } from '../store/communityStore'

// Curated Unsplash presets — users can also paste their own URL
const PRESETS = [
  {
    label: 'Santorini',
    thumb: 'https://images.unsplash.com/photo-1613395877344-13d4a8eeee8f?auto=format&fit=crop&w=120&h=120&q=70',
    full: 'https://images.unsplash.com/photo-1613395877344-13d4a8eeee8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Tokyo',
    thumb: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&h=120&q=70',
    full: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Machu Picchu',
    thumb: 'https://images.unsplash.com/photo-1526772662643-4c8d1b51c85b?auto=format&fit=crop&w=120&h=120&q=70',
    full: 'https://images.unsplash.com/photo-1526772662643-4c8d1b51c85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'París',
    thumb: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=120&h=120&q=70',
    full: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Bali',
    thumb: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=120&h=120&q=70',
    full: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Playa',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&h=120&q=70',
    full: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
]

export default function CreatePostScreen() {
  const navigate = useNavigate()
  const { createPost, isCreating } = useCommunityStore()

  const [destination, setDestination] = useState('')
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handlePreset = (full: string) => {
    setImageUrl(full)
    setSelectedPreset(full)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!destination.trim()) { setError('Agregá un destino.'); return }
    if (!caption.trim())     { setError('Escribí una descripción.'); return }
    if (!imageUrl.trim())    { setError('Elegí o pegá una imagen.'); return }

    const ok = await createPost(destination.trim(), caption.trim(), imageUrl.trim())
    if (ok) {
      navigate('/community', { replace: true })
    } else {
      setError('No se pudo publicar. Intentá de nuevo.')
    }
  }

  return (
    <AppBackground variant="chat">
      <TopAppBar backTo="/community" title="Nueva publicación" />

      <main className="flex-1 relative z-10 px-6 pb-10 max-w-md mx-auto w-full overflow-y-auto">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          {/* Destination */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-white/90 px-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600 }}
            >
              ¿A dónde fuiste?
            </label>
            <div className="neu-pressed rounded-xl flex items-center px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
              <span className="material-symbols-outlined text-white/60 mr-3" style={{ fontSize: 20 }}>
                location_on
              </span>
              <input
                type="text"
                placeholder="París, Francia"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                maxLength={80}
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/40 focus:ring-0 p-0"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem' }}
              />
            </div>
          </div>

          {/* Image picker */}
          <div className="flex flex-col gap-2">
            <label
              className="text-white/90 px-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600 }}
            >
              Imagen
            </label>

            {/* Preset thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {PRESETS.map((p) => (
                <motion.button
                  key={p.full}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handlePreset(p.full)}
                  className="flex-shrink-0 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-16 h-16 rounded-2xl overflow-hidden"
                    style={{
                      outline: selectedPreset === p.full ? '2.5px solid #ff8c42' : '2px solid rgba(255,255,255,0.15)',
                      outlineOffset: selectedPreset === p.full ? '2px' : '0px',
                      transition: 'outline 0.15s ease',
                    }}
                  >
                    <img src={p.thumb} alt={p.label} className="w-full h-full object-cover" />
                  </div>
                  <span
                    className="text-white/55"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.65rem' }}
                  >
                    {p.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Custom URL input */}
            <div className="neu-pressed rounded-xl flex items-center px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
              <span className="material-symbols-outlined text-white/60 mr-3" style={{ fontSize: 20 }}>
                link
              </span>
              <input
                type="url"
                placeholder="O pegá una URL de imagen..."
                value={imageUrl}
                onChange={(e) => { setImageUrl(e.target.value); setSelectedPreset(null) }}
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/40 focus:ring-0 p-0 min-w-0"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
              />
            </div>

            {/* Live preview */}
            <AnimatePresence>
              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 180 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl overflow-hidden"
                >
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setError('No se pudo cargar la imagen. Verificá la URL.')}
                    onLoad={() => setError('')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-white/90 px-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600 }}
            >
              Contanos tu experiencia
            </label>
            <div className="neu-pressed rounded-xl px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
              <textarea
                placeholder="¿Qué fue lo más memorable del viaje?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={280}
                rows={4}
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/40 focus:ring-0 p-0 resize-none"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                }}
              />
              <p
                className="text-right text-white/30 mt-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem' }}
              >
                {caption.length}/280
              </p>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.8125rem',
                  color: '#ffb4ab',
                }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={isCreating}
            className="w-full h-14 rounded-full neu-btn-primary relative overflow-hidden group flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.125rem',
              fontWeight: 700,
              letterSpacing: '0.015em',
            }}
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer pointer-events-none" />
            <span>{isCreating ? 'Publicando...' : 'Publicar'}</span>
            {!isCreating && (
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                send
              </span>
            )}
          </motion.button>
        </motion.form>
      </main>
    </AppBackground>
  )
}
