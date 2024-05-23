import type { FC, PropsWithChildren } from 'react'
import useAppStore, { selectToken } from '@/store/app-store'
import { Navigate, useLocation } from 'react-router-dom'
import styles from '@/views/auth/css/auth-layout.module.less'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const token = useAppStore(selectToken)
  const location = useLocation()

  if (token) {
    let nextURL = ''
    if (location.search.includes('?from=')) {
      const search = location.search.replace('?from=', '')
      nextURL = search ? search : '/'
    } else {
      nextURL = '/'
    }

    console.log(nextURL)
    return <Navigate to={nextURL} replace />
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>{children}</div>
    </div>
  )
}

export default AuthLayout
