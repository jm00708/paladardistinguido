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
        // 'html' fuera de globPatterns: el index.html NO se precachea.
        // Los JS/CSS si tienen hash de contenido (Vite), por eso son
        // seguros con CacheFirst -- un deploy nuevo genera nombres nuevos.
        globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // El documento HTML siempre se pide a la red primero. Antes,
            // al precachearse, un F5 normal podia servir una version
            // vieja del shell (con referencias a JS/CSS tambien viejos)
            // hasta una segunda recarga. Con NetworkFirst, un refresh
            // normal ya trae lo ultimo mientras haya conexion; solo cae
            // a cache si no hay red.
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
            },
          },
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
