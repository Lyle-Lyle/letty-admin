import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
// 导入 logo 图片
import logo from '@/assets/images/Logo.jpeg';
// 导入模块化的样式表
import styles from '@/views/root/css/root.module.less';
import RootHeader from '@/components/root/header';
import useAppStore, { selectCollapsed } from '@/store/app-store';
import { initUser } from '@/store/user-store';
import to from 'await-to-js';
import { getMenuApi } from '@/api/user-api';
import RootMenu from '@/components/root/menu';
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const Root: React.FC = () => {
  const collapsed = useAppStore(selectCollapsed);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className={styles.container}>
      {/* 侧边栏 */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* logo 区域 */}
        <div className={styles['box-logo']}>
          <img src={logo} alt='logo' className={styles.logo} />
          {/* 按需展示文字 */}
          {!collapsed && (
            <span className={styles['logo-text']}>文章管理系统</span>
          )}
        </div>
        <RootMenu />
      </Sider>
      <Layout>
        {/* 头部区域 */}
        <RootHeader />
        {/* 内容区域 */}
        <Content className={styles.content}>
          <Outlet />
        </Content>
        {/* 底部区域 */}
        <Footer className={styles.footer}>Powered by &copy;刘龙宾</Footer>
      </Layout>
    </Layout>
  );
};

export const loader = async () => {
  // 在路由匹配成功后，将要渲染 Root 组件之前，先调用 initUser 函数获取全局共享的用户信息
  initUser();
  // 获取左侧菜单的列表数据
  const [err, res] = await to(getMenuApi());
  // 接口调用失败
  if (err) return null;
  // 接口调用成功
  return { menus: res.data };
};

export default Root;
