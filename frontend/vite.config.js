import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
   server: {
    port: 5173, // Set the desired port
    strictPort: true, // Exit if the port is already in use
    proxy: {
      // Any request starting with '/api' will be forwarded to the backend
      '/api': {
        target: 'http://localhost:5001', // Your backend server
        changeOrigin: true,
      },
    },
  }
})
