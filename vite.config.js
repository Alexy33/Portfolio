import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  },
  assetsInclude: ['**/*.JPG', '**/*.PNG'], // Ajout des extensions en majuscules
})