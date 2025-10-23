import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/NOMBRE_DE_TU_REPOSITORIO/', // <-- ¡MUY IMPORTANTE! Reemplaza esto
})
