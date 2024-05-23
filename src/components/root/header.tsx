import type { FC } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Button, Avatar } from 'antd'
import Logout from '@/components/root/logout.tsx'
import useAppStore, { setCollapsed, selectCollapsed } from '@/store/app-store'
import useUserStore, { selectName, selectAvatar } from '@/store/user-store'
import RootBreadcrumb from '@/components/root/breadcrumb.tsx'
import styles from '@/components/root/css/header.module.less'

const { Header } = Layout

const RootHeader: FC = () => {
  // 从 zustand 中获取全局的数据（侧边栏折叠展开的状态）
  const collapsed = useAppStore(selectCollapsed)
  const name = useUserStore(selectName)
  const avatar = useUserStore(selectAvatar)

  return (
    <Header className={styles.container}>
      <div className={styles.boxLeft}>
        <Button type="text" className={styles.btnCollapsed} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
        <span>欢迎：{name}，您当前的位置：</span>
        {/* 封装并实现面包屑组件 */}
        <RootBreadcrumb />
      </div>
      <div>
        {/* 头像 */}
        {avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />}
        {/* 退出登录按钮 */}
        <Logout />
      </div>
    </Header>
  )
}

export default RootHeader
