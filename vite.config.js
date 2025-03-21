import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  
  server: {
    open: true,
    port: 3000
  },
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  optimizeDeps: {
    include: ['@vercel/analytics']
  }
});