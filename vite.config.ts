import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Kept distinct from Kidora-fe's 5173 so both apps can run side by
    // side locally — matches kidora-be's default ADMIN_URL CORS entry.
    port: 5174,
  },
})
