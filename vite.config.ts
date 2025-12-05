import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'

export default defineConfig({
  plugins: [
    cloudflare(),
    ssrPlugin(),
  ],
  server: {
    hmr: {
      timeout: 60000,
    },
  },
  // Note: Local dev with remote R2 may still fail for files >100MB
  // Deploy to production for reliable large file uploads
})
