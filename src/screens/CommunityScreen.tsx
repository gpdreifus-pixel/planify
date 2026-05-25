import { useState } from 'react'
import { motion } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { MOCK_COMMUNITY_POSTS } from '../data/mockData'
import { staggerContainer, staggerItem } from '../animations/transitions'

type Tab = 'community' | 'favorites'

export default function CommunityScreen() {
  const [posts, setPosts] = useState(MOCK_COMMUNITY_POSTS)
  const [activeTab, setActiveTab] = useState<Tab>('community')

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByUser: !p.likedByUser, likes: p.likedByUser ? p.likes - 1 : p.likes + 1 }
          : p
      )
    )
  }

  const displayPosts = activeTab === 'favorites'
    ? posts.filter((p) => p.likedByUser)
    : posts

  return (
    <AppBackground variant="chat">
      <TopAppBar title="Comunidad" />

      {/* Tab switcher — glass-pressed container, glass-raised active */}
      <div className="px-6 max-w-md mx-auto w-full relative z-10 pb-3">
        <div className="glass-pressed rounded-full p-1 flex">
          {(['community', 'favorites'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold relative ${
                activeTab === t ? 'text-white' : 'text-white/55 hover:text-white/75'
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {activeTab === t && (
                <motion.div
                  layoutId="community-tab-pill"
                  className="absolute inset-0 glass-raised rounded-full shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative z-10">
                {t === 'community' ? 'Comunidad' : 'Favoritos'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 relative z-10 px-6 pb-28 max-w-md mx-auto w-full">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4"
        >
          {displayPosts.length === 0 && (
            <motion.div variants={staggerItem} className="text-center py-16">
              <span className="material-symbols-outlined text-white/30" style={{ fontSize: 60 }}>
                favorite
              </span>
              <p
                className="text-white/50 mt-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9375rem' }}
              >
                Todavía no tenés favoritos.
              </p>
            </motion.div>
          )}

          {displayPosts.map((post) => (
            <motion.article
              key={post.id}
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
                    {post.author.name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold truncate text-white"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
                  >
                    {post.author.name}
                  </p>
                  <p
                    className="text-white/60"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem' }}
                  >
                    {post.author.tripsCount} viajes
                  </p>
                </div>
                <span
                  className="text-white/55 flex-shrink-0"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem' }}
                >
                  {new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Image — mix-blend-luminosity on hover transitions to normal */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={post.images[0]}
                  alt={post.destination}
                  className="w-full h-full object-cover opacity-90 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
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

              {/* Star rating — #ffb597 = primary peach */}
              <div className="flex items-center gap-1 px-4 pt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ fontSize: 14, color: s <= 4 ? '#ffb597' : 'rgba(255,255,255,0.25)' }}>
                    ★
                  </span>
                ))}
                <span
                  className="ml-1 text-white/60"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem' }}
                >
                  {post.destination.split(',')[1]?.trim() ?? post.destination}
                </span>
              </div>

              {/* Caption — font-light white/90 */}
              <div className="px-4 pt-2 pb-3">
                <p
                  className="text-white/90 line-clamp-2"
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
              <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => toggleLike(post.id)}
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

                  <button className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)' }}
                    >
                      chat_bubble_outline
                    </span>
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '0.8125rem',
                        color: 'rgba(255,255,255,0.55)',
                      }}
                    >
                      {post.comments}
                    </span>
                  </button>
                </div>

                {/* Ver detalle — orange gradient + rounded-full */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 font-semibold"
                  style={{
                    background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
                    boxShadow: '0 4px 12px rgba(255,140,66,0.4)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.8125rem',
                    color: 'white',
                  }}
                >
                  Ver detalle
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </main>

      <BottomNav activeIndex={2} />
    </AppBackground>
  )
}
