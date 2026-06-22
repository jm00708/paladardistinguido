import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // se registra a mano en UpdateToast.jsx para poder avisar al usuario
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'El Paladar Distinguido',
        short_name: 'Paladar',
        description: 'Tu sommelier personal en cada mesa',
        theme_color: '#2A2118',
        background_color: '#2A2118',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',   // necesario para que Docker exponga el puerto
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: false,
        configure: (proxy) => {
          // django-tenants elige el schema por el header Host.
          // Lo sobreescribimos aquí porque changeOrigin no es suficiente.
          const tenantHost = process.env.VITE_TENANT_HOST || 'noma.localhost'
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Host', tenantHost)
          })
        },
      },
    },
  },
})
