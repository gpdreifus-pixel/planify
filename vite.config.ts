import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'prompt' — shows the app's own update banner instead of silently
      // reloading mid-session, which could interrupt active trip planning.
      registerType: 'prompt',

      includeAssets: ['favicon.png', 'favicon.svg', 'apple-touch-icon.png', 'splash.png'],

      manifest: {
        name: 'Planify',
        short_name: 'Planify',
        description: 'Planificá tu próximo viaje en 10 preguntas. Tu viaje ideal, con IA.',
        theme_color: '#ff6b1f',
        // background_color matches the top of the atmospheric gradient —
        // shown during launch before the first paint on Android and iOS.
        background_color: '#8178a8',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'es',
        id: 'planify-travel-app',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            // Maskable icon — Android adaptive icons crop to a circle/shape.
            // Using the same 512 source; the logo has enough safe-area padding.
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            // Any-purpose — used by browsers that need a fully opaque icon
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        screenshots: [
          {
            src: '/splash.png',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Planify — pantalla de inicio',
          },
        ],
        categories: ['travel', 'lifestyle', 'productivity'],
      },

      workbox: {
        // Aggressive cache for all build artifacts
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],

        // Take control of all clients immediately on activation —
        // no need to close and reopen tabs after an update installs.
        skipWaiting: true,
        clientsClaim: true,

        // Remove cached responses from outdated precache manifests
        // so stale assets don't accumulate across deployments.
        cleanupOutdatedCaches: true,

        runtimeCaching: [
          // Google Fonts stylesheet — long-lived, regenerated only on font changes
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-css',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365, maxEntries: 10 },
            },
          },
          // Google Fonts woff2 binaries — effectively immutable URLs
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-assets',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365, maxEntries: 20 },
            },
          },
          // Unsplash property images — network-first so new images load,
          // fall back to cache when offline
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'unsplash-images',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // Google user content (AI avatar, legacy images)
          {
            urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-user-content',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },

      // Register the SW as soon as the page loads
      injectRegister: 'auto',

      devOptions: {
        // Enable SW in dev so the update flow can be tested locally
        enabled: false,
        type: 'module',
      },
    }),
  ],
})
