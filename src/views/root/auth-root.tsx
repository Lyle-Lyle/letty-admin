import type { FC, PropsWithChildren } from 'react'
import useAppStore, { selectToken } from '@/store/app-store.ts'
import { Navigate, useLocation, matchRoutes } from 'react-router-dom'
import router from '@/router'

const AuthRoot: FC<PropsWithChildren> = ({ children }) => {
  // 基于 Selector 选取派生的数据
  const token = useAppStore(selectToken)
  const location = useLocation()

  if (token) {
    // 有 token，已登录
    return <>{children}</>
  } else {
    const nextURL = location.pathname + location.search
    const matchResult = matchRoutes(router.routes, nextURL)

    if (matchResult && matchResult.length !== 0 && matchResult[matchResult.length - 1].route.path === '*') {
      // 无 token，需要强制跳转到登录页面
      return <Navigate to="/login" replace />
    } else {
      // 无 token，需要强制跳转到登录页面
      const to = nextURL === '/' || nextURL === '/home' ? '/login' : '/login?from=' + nextURL
      return <Navigate to={to} replace />
    }
  }
}

export default AuthRoot
