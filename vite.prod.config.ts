// 项目发布上线时对应的打包配置项
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { createHtmlPlugin } from 'vite-plugin-html'
import externalGlobals from 'rollup-plugin-external-globals'

// https://vitejs.dev/config/
const prodConfig: UserConfig = {
  plugins: [
    react(),
    visualizer({ open: true }),
    externalGlobals({
      // 键: 值
      // 排除的第三方包的名字: window对象上通过 CDN 资源链接挂载的对象的名字
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-quill': 'ReactQuill',
      localforage: 'localforage',
      dayjs: 'dayjs',
      antd: 'antd'
    }),
    createHtmlPlugin({
      // 是否针对 html 标签进行代码压缩
      minify: true,
      // 打包的入口
      entry: 'src/main.tsx',
      // 是否适配 vite5.0 之后的版本
      viteNext: true,
      // 向网页中注入数据
      inject: {
        // 真正要注入到网页中的数据
        data: {
          title: '文章后台管理系统',
          injectScript: `<script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/react-quill@2.0.0/dist/react-quill.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/antd@5.12.2/dist/antd.min.js"></script>
          `
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
  },
  build: {
    // 这是 rollup 的打包配置项
    rollupOptions: {
      output: {
        assetFileNames: '[ext]/[name]-[hash][extname]',
        entryFileNames: 'js/entry/[name]-[hash].js',
        chunkFileNames: 'js/chunk/[name]-[hash].js'
      },
      // 凡是需要排除在打包结果之外的第三方依赖包，都需要声明到这个数组中，而且没有前后顺序
      external: ['react-dom', 'react', 'react-quill', 'localforage', 'antd', 'dayjs']
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
}

export default prodConfig
