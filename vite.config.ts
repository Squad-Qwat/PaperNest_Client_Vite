import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    include: ['@uiw/react-md-editor'],
  },
  ssr: {
    noExternal: ['@uiw/react-md-editor'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://machinist-ai.vercel.app',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
