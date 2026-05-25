import { create } from 'zustand'
import type { CommunityPost } from '../types'
import { supabase } from '../utils/supabase'
import {
  fetchCommunityPosts,
  fetchUserLikedPostIds,
  createCommunityPost,
  likePost,
  unlikePost,
} from '../services/db'

// ── Fallback posts shown while the community is empty ─────────────────────────
// These make the Explore tab useful before any real posts exist.
// IDs start with "demo-" so toggleLike skips the Supabase write for them.
const DEMO_POSTS: CommunityPost[] = [
  {
    id: 'demo-1',
    author: {
      id: 'demo',
      name: 'María G.',
      email: '',
      joinDate: '2025-01-10',
      tripsCount: 0,
      reviewsCount: 0,
      badges: [],
    },
    destination: 'Santorini, Grecia',
    images: [
      'https://images.unsplash.com/photo-1613395877344-13d4a8eeee8f?auto=format&fit=crop&w=800&q=80',
    ],
    caption:
      'Los atardeceres desde Oia son sencillamente mágicos. Cada noche el cielo se pinta de naranjas y rosas que ninguna foto logra capturar del todo. ¡Una experiencia que recomiendo 100%!',
    likes: 87,
    comments: 0,
    likedByUser: false,
    createdAt: '2025-04-12T18:30:00Z',
    tags: ['grecia', 'santorini'],
  },
  {
    id: 'demo-2',
    author: {
      id: 'demo',
      name: 'Lucas R.',
      email: '',
      joinDate: '2025-02-03',
      tripsCount: 0,
      reviewsCount: 0,
      badges: [],
    },
    destination: 'Tokio, Japón',
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    ],
    caption:
      'La mezcla de tradición y modernidad en Tokio es única. Fui durante la temporada de sakura y quedé sin palabras. La gastronomía, los barrios, la gente… todo fue perfecto.',
    likes: 134,
    comments: 0,
    likedByUser: false,
    createdAt: '2025-03-28T09:15:00Z',
    tags: ['japón', 'tokio', 'sakura'],
  },
  {
    id: 'demo-3',
    author: {
      id: 'demo',
      name: 'Sofía M.',
      email: '',
      joinDate: '2025-01-22',
      tripsCount: 0,
      reviewsCount: 0,
      badges: [],
    },
    destination: 'Machu Picchu, Perú',
    images: [
      'https://images.unsplash.com/photo-1526772662643-4c8d1b51c85b?auto=format&fit=crop&w=800&q=80',
    ],
    caption:
      'Subir al amanecer por el camino inca y ver la ciudadela aparecer entre la niebla es una experiencia que te cambia la vida. Un sueño cumplido después de años de planearlo.',
    likes: 211,
    comments: 0,
    likedByUser: false,
    createdAt: '2025-03-05T07:00:00Z',
    tags: ['perú', 'machupicchu', 'inca'],
  },
  {
    id: 'demo-4',
    author: {
      id: 'demo',
      name: 'Tomás B.',
      email: '',
      joinDate: '2025-02-15',
      tripsCount: 0,
      reviewsCount: 0,
      badges: [],
    },
    destination: 'Bali, Indonesia',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    ],
    caption:
      'Diez días en Bali y siento que apenas rasqué la superficie. Los templos de Ubud, el surf en Canggu, los arrozales… No quería volver. Ya estoy planeando el regreso.',
    likes: 96,
    comments: 0,
    likedByUser: false,
    createdAt: '2025-02-20T14:45:00Z',
    tags: ['bali', 'indonesia', 'surf'],
  },
]

interface CommunityState {
  posts: CommunityPost[]
  isLoading: boolean
  isCreating: boolean
  error: string | null
  // Actions
  fetchPosts: () => Promise<void>
  toggleLike: (postId: string) => void
  createPost: (
    destination: string,
    caption: string,
    imageUrl: string
  ) => Promise<boolean> // returns true on success
}

export const useCommunityStore = create<CommunityState>()((set, get) => ({
  posts: [],
  isLoading: false,
  isCreating: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      const [rawPosts, { data: sessionData }] = await Promise.all([
        fetchCommunityPosts(),
        supabase.auth.getSession(),
      ])

      const session = sessionData?.session
      const likedIds = new Set(
        session?.user ? await fetchUserLikedPostIds(session.user.id) : []
      )

      const realPosts = rawPosts.map((p) => ({
        ...p,
        likedByUser: likedIds.has(p.id),
      }))

      // If Supabase has no posts yet (table empty or migration not run),
      // show curated demo posts so the Explore tab is never blank.
      const posts = realPosts.length > 0 ? realPosts : DEMO_POSTS

      set({ posts, isLoading: false })
    } catch (e) {
      console.warn('[community] fetchPosts error:', e)
      set({ isLoading: false, posts: DEMO_POSTS })
    }
  },

  toggleLike: (postId) => {
    const post = get().posts.find((p) => p.id === postId)
    if (!post) return

    const wasLiked = post.likedByUser

    // Optimistic update — instant UI feedback
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByUser: !wasLiked,
              likes: wasLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      ),
    }))

    // Demo posts are local-only — skip Supabase write
    if (postId.startsWith('demo-')) return

    // Fire-and-forget cloud write
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return
      if (wasLiked) unlikePost(session.user.id, postId)
      else likePost(session.user.id, postId)
    })
  },

  createPost: async (destination, caption, imageUrl) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return false

    const meta = session.user.user_metadata ?? {}
    const authorName =
      meta.full_name ?? meta.name ?? session.user.email?.split('@')[0] ?? 'Viajero'
    const authorAvatar: string | undefined = meta.avatar_url

    set({ isCreating: true, error: null })

    const newPost = await createCommunityPost(
      session.user.id,
      authorName,
      authorAvatar,
      destination,
      caption,
      imageUrl
    )

    if (newPost) {
      // Prepend to feed so user immediately sees their post
      set((state) => ({
        posts: [{ ...newPost, likedByUser: false }, ...state.posts],
        isCreating: false,
      }))
      return true
    }

    set({ isCreating: false, error: 'No se pudo publicar. Intentá de nuevo.' })
    return false
  },
}))
