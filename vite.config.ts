import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    clearScreen: false,
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) return 'vendor';
              if (id.includes('lucide') || id.includes('motion') || id.includes('embla')) return 'ui';
              if (id.includes('zod') || id.includes('react-hook-form') || id.includes('i18next')) return 'utils';
              return 'deps';
            }
          }
        }
      }
    },
    server: {
      // Force HMR on for instant code updates
      hmr: true,
      // Enable file watching
      watch: {
        usePolling: false,
      },
      // Force no cache
      fs: {
        strict: false,
      },
      // Disable browser cache
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'motion'],
    },
  };
});
