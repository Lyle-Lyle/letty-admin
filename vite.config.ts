import { defineConfig } from 'vite'
import devConfig from './vite.dev.config'
import prodConfig from './vite.prod.config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return mode === 'development' ? devConfig : prodConfig
})
