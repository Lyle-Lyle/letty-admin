/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from 'react'
import { Layout, Spin } from 'antd'
import RootHeader from '@/components/root/header'
import useAppStore, { selectCollapsed } from '@/store/app-store'
import { initUser } from '@/store/user-store.ts'
import { getMenuApi } from '@/api/user-api.ts'
import RootMenu from '@/components/root/menu'
import { Outlet, defer, Await, useLoaderData } from 'react-router-dom'
import logo from '@/assets/images/logo.svg'
import styles from '@/views/root/css/root.module.less'

const { Sider, Content, Footer } = Layout

const Root: React.FC = () => {
  const collapsed = useAppStore(selectCollapsed)
  const loaderData = useLoaderData() as { result: Promise<[BaseResponse<MenuItem[]>, void]> }

  return (
    <Suspense fallback={<Spin fullscreen />}>
      <Await resolve={loaderData.result}>
        {() => {
          return (
            <Layout className={styles.container}>
              {/* 侧边栏 */}
              <Sider trigger={null} collapsible collapsed={collapsed}>
                {/* logo 区域 */}
                <div className={styles.boxLogo}>
                  <img src={logo} alt="logo" className={styles.logo} />
                  {/* 按需展示文字 */}
                  {!collapsed && <span className={styles.logoText}>文章管理系统</span>}
                </div>
                {/* 左侧菜单 */}
                <RootMenu />
              </Sider>
              <Layout>
                {/* 头部区域 */}
                <RootHeader />

                {/* 内容区域 */}
                <Content className={styles.content}>
                  {/* 路由占位符 */}
                  <Outlet />
                </Content>
                {/* 底部区域 */}
                <Footer className={styles.footer}>Powered by &copy;刘龙宾</Footer>
              </Layout>
            </Layout>
          )
        }}
      </Await>
    </Suspense>
  )
}

export default Root

export const loader = async () => {
  const result = Promise.all([getMenuApi(), initUser()])
  return defer({ result })
}
