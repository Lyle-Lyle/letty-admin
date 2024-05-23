// 项目开发阶段对应的打包配置项
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'node:path'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
const devConfig: UserConfig = {
  plugins: [
    react(),
    createHtmlPlugin({
      minify: false,
      entry: 'src/main.tsx',
      // 是否适配 vite5.0 之后的版本
      viteNext: true,
      inject: {
        data: {
          title: 'dev-文章后台管理系统',
          injectScript: ''
        }
      }
    })
  ],
  resolve: {
    alias: {
      // 配置 @ 的路径别名
      '@': join(__dirname, './src/')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
}

export default devConfig
