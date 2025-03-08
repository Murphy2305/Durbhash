import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5007', // Replace with your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Adjust based on backend API route
      },
    },
  },
  build: {
    outDir: 'dist', // Ensure output is in the correct directory for Vercel
    rollupOptions: {
      external: ["@chakra-ui/system"]
    }
  }
});
