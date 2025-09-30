import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/decimal_interactive_tutorial/',
  plugins: [react()],
})
