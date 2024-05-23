import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { RouterProvider, matchPath } from 'react-router-dom'
import router from '@/router'
// 全局样式表
import '@/index.less'

// 第一个参数，是 pattern 模式，可以是路由的 path 地址（类似于正则表达式） /art-edit/:id
// 第二个参数，是实际的 URL 地址中的路径，比如 /art-edit/123
const result = matchPath('/art-edit/:id', '/art-list/123')
console.log(result)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>
)
