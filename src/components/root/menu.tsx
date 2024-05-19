import type { FC } from 'react';
import { Menu } from 'antd';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';

import { useState } from 'react';
import type { MenuProps } from 'antd';

import {
  HomeOutlined,
  ReadOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  FileAddOutlined,
  FileTextOutlined,
  UserOutlined,
  SolutionOutlined,
  PictureOutlined,
  KeyOutlined,
} from '@ant-design/icons';

//在 RootMenu 组件之外，定义图标名称和图标组件的映射关系（因为这个映射关系是静态数据，所以不需要把 iconMap 定义到组件中）：
const iconMap = {
  // 键: 值
  // icon 的名字: 要替换成的图标组件
  HomeOutlined: <HomeOutlined />,
  ReadOutlined: <ReadOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  ProfileOutlined: <ProfileOutlined />,
  FileAddOutlined: <FileAddOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  UserOutlined: <UserOutlined />,
  SolutionOutlined: <SolutionOutlined />,
  PictureOutlined: <PictureOutlined />,
  KeyOutlined: <KeyOutlined />,
};

// 定义一个方法，递归的处理每个菜单项的图标
const resolveMenuIcon = (menus: MenuItem[]) => {
  for (const menu of menus) {
    const iconName = menu.icon as keyof typeof iconMap;
    menu.icon = iconMap[iconName];

    if (menu.children) {
      resolveMenuIcon(menu.children);
    }
  }
};

const rootSubmenuKeys = ['2', '3'];

// 用来递归的查找当前选中结点的父节点的 key 值，并 return
const getOpenKey = (
  menus: MenuItem[] | undefined,
  selectedKey: string,
  parentKey: string = ''
): string => {
  if (!menus) return '';
  for (const item of menus) {
    // 如果当前循环项的 key 等于 selectedKey（被选中的菜单项的 key），则把父节点的 key 值返回
    if (item.key === selectedKey) {
      return parentKey;
    }

    if (item.children) {
      const result = getOpenKey(item.children, selectedKey, item.key);
      if (result) {
        // 找到了
        return result;
      }
    }
  }

  return '';
};

const RootMenu: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 要默认被选中的菜单项的 key
  const selectedKey = location.pathname === '/' ? '/home' : location.pathname;
  // 获取 loader 返回的数据
  const data = useLoaderData() as { menus: MenuItem[] } | null;

  if (!data) return;
  const { menus } = data;
  resolveMenuIcon(menus);
  const [openKeys, setOpenKeys] = useState<string[]>([
    getOpenKey(data?.menus, selectedKey),
  ]);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    // 进行路由导航的跳转
    navigate(key);
  };

  return (
    <>
      <Menu
        theme='dark'
        mode='inline'
        items={menus}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={onMenuItemClick}
        selectedKeys={[selectedKey]}
      />
    </>
  );
};

export default RootMenu;
