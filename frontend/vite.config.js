import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import sass from 'sass';

dotenv.config();

export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    include: ['redux-thunk']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8000,
    open: false,
    strictPort: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        sassOptions: {
          quietDeps: true,
          logger: {
            warn: (message, { deprecation }) => {
              // Suppress only deprecation warnings
              if (!deprecation) {
                console.warn(message);
              }
            }
          }
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  }
});
