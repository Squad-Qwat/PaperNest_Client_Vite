import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import devtoolsjson from 'vite-plugin-devtools-json'

export default defineConfig({

  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), devtoolsjson()],
  optimizeDeps: {
    include: ['@uiw/react-md-editor'],
  },
  ssr: {
    noExternal: ['@uiw/react-md-editor'],
  },  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7208',
        changeOrigin: true,
        secure: false, // Set to false for self-signed certificates in development
      }
    }
  }
})
