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

      const posts = rawPosts.map((p) => ({
        ...p,
        likedByUser: likedIds.has(p.id),
      }))

      set({ posts, isLoading: false })
    } catch (e) {
      console.warn('[community] fetchPosts error:', e)
      // Always clear loading so the UI doesn't get stuck on skeletons
      set({ isLoading: false, posts: [] })
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
