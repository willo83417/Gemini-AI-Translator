import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
        plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tailwindcss-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          }
        ]
      },
      manifest: {
        name: "Gemini AI Translator",
        short_name: "GeminiTranslator",
        description: "A sleek, modern translation application powered by Google's Gemini API. It provides fast and accurate text translations between various languages with a clean, mobile-first user interface.",
        theme_color: "#3b82f6",
        background_color: "#f1f5f9",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            "src": "/images/icon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/images/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    })
  ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});