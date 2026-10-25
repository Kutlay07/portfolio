import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import studioPlugin from './studio-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), studioPlugin()],
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
  preview: { host: '127.0.0.1' },
})
