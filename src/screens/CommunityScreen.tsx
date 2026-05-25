import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useCommunityStore } from '../store/communityStore'
import { useAuthStore } from '../store/authStore'
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
function PostCard({
  post,
  onLike,
}: {
  post: CommunityPost
  onLike: () => void
}) {
  return (
    <motion.article
      variants={staggerItem}
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
          <p
            className="font-semibold truncate text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
          >
            {post.author.name}
          </p>
        </div>
        <span
          className="text-white/50 flex-shrink-0"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem' }}
        >
          {new Date(post.createdAt).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={post.images[0]}
          alt={post.destination}
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3
            className="text-white drop-shadow"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: 700 }}
          >
            {post.destination}
          </h3>
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 pt-3 pb-2">
        <p
          className="text-white/85 line-clamp-2"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.875rem',
            lineHeight: 1.55,
            fontWeight: 300,
          }}
        >
          {post.caption}
        </p>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-4 px-4 pb-4 pt-2 border-t border-white/10">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onLike}
          className="flex items-center gap-1.5"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 20,
              color: post.likedByUser ? '#ffb597' : 'rgba(255,255,255,0.55)',
              fontVariationSettings: post.likedByUser ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.8125rem',
              color: post.likedByUser ? '#ffb597' : 'rgba(255,255,255,0.55)',
              fontWeight: 600,
            }}
          >
            {post.likes}
          </span>
        </motion.button>
      </div>
    </motion.article>
  )
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function CommunityScreen() {
  const navigate = useNavigate()
  const { posts, isLoading, fetchPosts, toggleLike } = useCommunityStore()
  const { isAuthenticated, user } = useAuthStore()

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

  const displayPosts =
    tab === 'mine' ? posts.filter((p) => p.author.id === user?.id) : posts

  return (
    <AppBackground variant="chat">
      <TopAppBar title="Comunidad" />

      {/* Tab switcher */}
      <div className="px-6 max-w-md mx-auto w-full relative z-10 pb-3">
        <div className="glass-pressed rounded-full p-1 flex">
          {(['explore', 'mine'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold relative ${
                tab === t ? 'text-white' : 'text-white/55 hover:text-white/75'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {tab === t && (
                <motion.div
                  layoutId="community-tab-pill"
                  className="absolute inset-0 glass-raised rounded-full shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative z-10">
                {t === 'explore' ? 'Explorar' : 'Mis posts'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 relative z-10 px-6 pb-32 max-w-md mx-auto w-full overflow-y-auto">
        {/* Loading skeletons */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => <SkeletonPost key={i} />)}
          </div>
        )}

        {/* Posts */}
        {!isLoading && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-4"
          >
            {/* Empty states */}
            {displayPosts.length === 0 && tab === 'mine' && (
              <motion.div variants={staggerItem} className="text-center py-16">
                <span className="material-symbols-outlined text-white/25" style={{ fontSize: 60 }}>
                  photo_camera
                </span>
                <p
                  className="text-white/50 mt-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem' }}
                >
                  Todavía no publicaste nada.
                </p>
                {isAuthenticated && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/community/new')}
                    className="mt-5 px-6 py-2.5 rounded-full neu-btn-primary text-white font-semibold inline-flex items-center gap-2"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    Compartí tu viaje
                  </motion.button>
                )}
              </motion.div>
            )}

            {displayPosts.length === 0 && tab === 'explore' && (
              <motion.div variants={staggerItem} className="text-center py-16">
                <span className="material-symbols-outlined text-white/25" style={{ fontSize: 60 }}>
                  groups
                </span>
                <p
                  className="text-white/50 mt-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem' }}
                >
                  Sé el primero en compartir un viaje.
                </p>
                {isAuthenticated && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/community/new')}
                    className="mt-5 px-6 py-2.5 rounded-full neu-btn-primary text-white font-semibold inline-flex items-center gap-2"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    Compartí tu viaje
                  </motion.button>
                )}
              </motion.div>
            )}

            {displayPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => {
                  if (isAuthenticated) toggleLike(post.id)
                }}
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

      <BottomNav activeIndex={2} />
    </AppBackground>
  )
}
