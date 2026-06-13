import { memo, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import EmptyState from '../components/ui/EmptyState'
import TabSwitcher from '../components/ui/TabSwitcher'
import SmartImage from '../components/ui/SmartImage'
import { useCommunityStore } from '../store/communityStore'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { useSearchStore } from '../store/searchStore'
import { useUIStore } from '../store/uiStore'
import { haptic } from '../utils/haptics'
import { staggerContainer, staggerItem } from '../animations/transitions'
import type { CommunityPost } from '../types'

type Tab = 'explore' | 'mine'

// ── Skeleton card ──────────────────────────────────────────────────────────────
function SkeletonPost() {
  return (
    <div className="glass-surface rounded-[24px] overflow-hidden">
      {/* Author row */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-10 h-10 rounded-full skeleton-line flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3.5 skeleton-line rounded-lg w-1/3" />
          <div className="h-3 skeleton-line rounded-lg w-1/5" />
        </div>
      </div>
      {/* Image */}
      <div className="h-52 skeleton-line" />
      {/* Footer */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="h-3.5 skeleton-line rounded-lg w-4/5" />
        <div className="h-3 skeleton-line rounded-lg w-2/3" />
      </div>
    </div>
  )
}

// ── Post card ──────────────────────────────────────────────────────────────────
// Callbacks reciben el post (estables en el padre) para que memo sea efectivo
const PostCard = memo(function PostCard({
  post,
  onLike,
  onClick,
}: {
  post: CommunityPost
  onLike: (post: CommunityPost) => void
  onClick: (post: CommunityPost) => void
}) {
  return (
    <motion.article
      variants={staggerItem}
      onClick={() => onClick(post)}
      className="glass-surface rounded-[24px] overflow-hidden group cursor-pointer"
    >
      {/* Author row */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        {post.author.avatar ? (
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 neu-icon-btn"
          />
        ) : (
          <div className="neu-icon-btn w-10 h-10 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
            {post.author.name[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="t-label truncate text-white">{post.author.name}</p>
        </div>
        <span className="t-caption text-white/65 flex-shrink-0">
          {new Date(post.createdAt).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <SmartImage
          src={post.images[0]}
          alt={post.destination}
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="t-headline-sm text-white drop-shadow">{post.destination}</h3>
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 pt-3 pb-2">
        <p className="t-label font-normal text-white/85 line-clamp-2" style={{ lineHeight: 1.55 }}>
          {post.caption}
        </p>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-4 px-4 pb-2 pt-1 border-t border-white/10" onClick={e => e.stopPropagation()}>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onLike(post)}
          aria-label={post.likedByUser ? 'Quitar me gusta' : 'Me gusta'}
          aria-pressed={post.likedByUser}
          className="flex items-center gap-1.5 py-2 px-1"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 20,
              color: post.likedByUser ? '#ffb597' : 'rgba(255,255,255,0.65)',
              fontVariationSettings: post.likedByUser ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
          <span
            className="t-label"
            style={{
              fontSize: '0.8125rem',
              color: post.likedByUser ? '#ffb597' : 'rgba(255,255,255,0.65)',
            }}
          >
            {post.likes}
          </span>
        </motion.button>
      </div>
    </motion.article>
  )
})

// ── Main screen ────────────────────────────────────────────────────────────────
export default function CommunityScreen() {
  const navigate = useNavigate()
  const { posts, isLoading, fetchPosts, toggleLike } = useCommunityStore()
  const { isAuthenticated, user } = useAuthStore()
  const showToast = useUIStore((s) => s.showToast)

  // Keep tab in URL search param so the back button restores the right tab
  const searchParams = new URLSearchParams(window.location.search)
  const tab = (searchParams.get('tab') as Tab | null) ?? 'explore'

  const setTab = (t: Tab) => {
    const url = new URL(window.location.href)
    url.searchParams.set('tab', t)
    window.history.replaceState(null, '', url.toString())
    // Force re-render by navigating
    navigate(`/community?tab=${t}`, { replace: true })
  }

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)

  // Handlers estables para que React.memo de PostCard evite re-renders
  const handlePostClick = useCallback((post: CommunityPost) => {
    setSelectedPost(post)
  }, [])

  const handlePostLike = useCallback((post: CommunityPost) => {
    // El like de un invitado no debe fallar en silencio
    if (useAuthStore.getState().isAuthenticated) {
      toggleLike(post.id)
      haptic()
    } else {
      showToast('Iniciá sesión para dar me gusta', 'info')
    }
  }, [toggleLike, showToast])

  const handleCopyTrip = (post: CommunityPost) => {
    haptic()
    const criteria = post.tripCriteria ?? { destination: post.destination }
    // Los criterios van al chat (para que "Editar búsqueda" sea coherente)...
    const { reset, setCriteria } = useChatStore.getState()
    reset()
    setCriteria(criteria)
    // ...pero navegar solo no busca nada: sin disparar la búsqueda se veían
    // los resultados de la búsqueda anterior o el empty state.
    void useSearchStore.getState().search(criteria)
    setSelectedPost(null)
    navigate('/results')
  }

  // El store cae a posts de demostración cuando la tabla está vacía o falla
  // la conexión — el usuario debe saber que no es contenido real.
  const isDemoContent = posts.length > 0 && posts.every((p) => p.id.startsWith('demo-'))

  const displayPosts = (tab === 'mine' ? posts.filter((p) => p.author.id === user?.id) : posts).filter((p) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      p.destination.toLowerCase().includes(q) ||
      p.caption.toLowerCase().includes(q) ||
      p.author.name.toLowerCase().includes(q)
    )
  })

  return (
    <AppBackground variant="chat">
      <TopAppBar title="Comunidad" />

      {/* Tab switcher */}
      <div className="px-6 max-w-md mx-auto w-full relative z-10 pb-3">
        <TabSwitcher<Tab>
          layoutId="community-tab-pill"
          active={tab}
          onChange={setTab}
          tabs={[
            { value: 'explore', label: 'Explorar' },
            { value: 'mine', label: 'Mis posts' },
          ]}
        />
      </div>

      {/* Search bar */}
      <div className="px-6 max-w-md mx-auto w-full relative z-10 pb-3">
        <div className="neu-pressed rounded-xl flex items-center px-3 py-3 focus-within:ring-1 focus-within:ring-white/40 transition-all">
          <span className="material-symbols-outlined text-white/50 mr-2" style={{ fontSize: 20 }}>search</span>
          <input
            type="search"
            placeholder="Buscar destino, autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar publicaciones"
            className="t-body-sm bg-transparent border-none outline-none text-white w-full placeholder:text-white/40 focus:ring-0 p-0"
          />
        </div>
      </div>

      <main className="flex-1 relative z-10 px-6 pb-32 max-w-md mx-auto w-full overflow-y-auto">
        {/* Aviso de contenido demo — honestidad sobre el estado del sistema */}
        {isDemoContent && tab === 'explore' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-3 px-4 py-2.5 rounded-full glass-pressed border border-white/10"
          >
            <span className="material-symbols-outlined text-white/55" style={{ fontSize: 16 }}>info</span>
            <p className="t-caption text-white/70">
              Estás viendo publicaciones de ejemplo. ¡Sé el primero en compartir!
            </p>
          </motion.div>
        )}

        {/* Skeletons only on first load (no posts yet).
            On revisits the cached posts stay visible while the refresh runs in the background. */}
        {isLoading && posts.length === 0 && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => <SkeletonPost key={i} />)}
          </div>
        )}

        {/* Posts: render whenever we have posts OR the fetch finished (to show empty states).
            This keeps cached posts visible during a background refresh. */}
        {(!isLoading || posts.length > 0) && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-4"
          >
            {/* Empty states — only after loading finished with truly no posts */}
            {!isLoading && displayPosts.length === 0 && (
              <EmptyState
                icon={tab === 'mine' ? 'photo_camera' : searchQuery ? 'search_off' : 'groups'}
                title={
                  tab === 'mine'
                    ? 'Todavía no publicaste nada'
                    : searchQuery
                    ? 'Sin resultados para tu búsqueda'
                    : 'Sé el primero en compartir un viaje'
                }
                description={
                  tab === 'mine'
                    ? 'Compartí tu última aventura con la comunidad.'
                    : searchQuery
                    ? 'Probá con otro destino o autor.'
                    : 'Inspirá a otros viajeros con tu experiencia.'
                }
                cta={
                  isAuthenticated && !searchQuery
                    ? { label: 'Compartí tu viaje', onPress: () => navigate('/community/new'), icon: 'add' }
                    : undefined
                }
              />
            )}

            {displayPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={handlePostClick}
                onLike={handlePostLike}
              />
            ))}
          </motion.div>
        )}
      </main>

      {/* FAB — only for authenticated users */}
      <AnimatePresence>
        {isAuthenticated && !isLoading && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            whileTap={{ scale: 0.90 }}
            onClick={() => navigate('/community/new')}
            className="fixed z-40 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
            style={{
              bottom: 'calc(5rem + env(safe-area-inset-bottom))',
              right: '1.5rem',
              background: 'linear-gradient(135deg, #ff8c42, #ff6b1f)',
              boxShadow: '0 6px 20px rgba(255,107,31,0.55)',
            }}
            aria-label="Compartir viaje"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 26 }}>add</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Post Overlay */}
      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              style={{ zIndex: 9998 }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-sheet-dark rounded-t-[32px] flex flex-col pb-10 max-w-md mx-auto shadow-2xl"
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 9999 }}
            >
              <div className="sticky top-0 bg-gradient-to-b from-sheet-dark to-transparent pt-4 pb-2 px-6 flex justify-between items-center z-10">
                <h2 className="t-headline-sm text-white">{selectedPost.destination}</h2>
                <button
                  onClick={() => setSelectedPost(null)}
                  aria-label="Cerrar publicación"
                  className="neu-icon-btn w-10 h-10 flex items-center justify-center text-white"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                </button>
              </div>

              <div className="px-6 pb-24 flex flex-col gap-5 mt-2">
                <SmartImage src={selectedPost.images[0]} alt={selectedPost.destination} className="w-full h-48 object-cover rounded-2xl" />
                
                <p className="t-body-sm text-white/85" style={{ lineHeight: 1.6 }}>
                  {selectedPost.caption}
                </p>

                {selectedPost.experiences && selectedPost.experiences.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="t-title text-white">Experiencias</h3>
                    {selectedPost.experiences.map((exp, idx) => (
                      <div key={idx} className="glass-panel p-4 rounded-2xl flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="t-body font-semibold text-white">{exp.type}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <span
                                key={star}
                                className="material-symbols-outlined"
                                style={{
                                  fontSize: 16,
                                  color: star <= exp.rating ? '#ff8c42' : 'rgba(255,255,255,0.2)',
                                  fontVariationSettings: star <= exp.rating ? "'FILL' 1" : "'FILL' 0"
                                }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                        </div>
                        {exp.comment && (
                          <p className="t-label font-normal italic text-white/75">"{exp.comment}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCopyTrip(selectedPost)}
                  className="t-cta w-full mt-2 py-3.5 rounded-full flex items-center justify-center gap-2 text-white"
                  style={{
                    background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
                    boxShadow: '0 8px 25px rgba(255,107,31,0.4)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>content_copy</span>
                  Copiar este viaje
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </AppBackground>
  )
}
