import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
  },
  server: {
    host: true, // Crucial for Docker
    port: 5173,
    proxy: {
      // 1. PRODUCT SERVICE (Inventory & Catalog)
      '/api/products': {
        target: 'http://product_services:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/products/, '')
      },
      // 2. INVENTORY SERVICE
      '/api/inventory': {
        target: 'http://inventory_services:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/inventory/, '')
      },
      // 3. USER SERVICE (Auth & Profiles)
      '/api/users': {
        target: 'http://user_services:8002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, '')
      },
      // 4. ORDER SERVICE
      '/api/orders': {
        target: 'http://order_services:8003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/orders/, '')
      },
      // 5. NOTIFICATION SERVICE
      '/api/notifications': {
        target: 'http://notification_services:8004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/notifications/, '')
      },
      // 6. PAYMENT SERVICE
      '/api/payments': {
        target: 'http://payment_services:8005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/payments/, '')
      },
      // 7. AI CHATBOT (RAG)
      '/api/ai-chat': {
        target: 'http://ai_chatbot:8006',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai-chat/, '')
      },
      // 8. AI PRODUCT VISUALIZATION (Design Gen)
      '/api/ai-design': {
        target: 'http://ai_design_visualization:8007',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai-design/, '')
      },
    }
  }
})