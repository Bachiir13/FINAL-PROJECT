// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // <-- important pour que les assets pointent correctement à la racine
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:3001', // adapte au port de ton backend
        changeOrigin: true,
      }
    }
  }
});
