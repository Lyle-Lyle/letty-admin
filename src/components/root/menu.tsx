import type { FC } from 'react'
import { useState } from 'react'
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
  KeyOutlined
} from '@ant-design/icons'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation, useAsyncValue } from 'react-router-dom'

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
  KeyOutlined: <KeyOutlined />
}

const rootSubmenuKeys = ['2', '3']

const RootMenu: FC = () => {
  // const data = useLoaderData() as { menus: MenuItem[] } | null
  const [menuResult] = useAsyncValue() as [BaseResponse<MenuItem[]>]
  const menus = menuResult.data || []

  // 在函数式组件中，不能按条件执行 hook，必须在组件顶部调用 hook
  const navigate = useNavigate()
  const location = useLocation()

  // 要默认被选中的菜单项的 key
  const selectedKey = location.pathname === '/' ? '/home' : location.pathname
  const [openKeys, setOpenKeys] = useState<string[]>([getOpenKey(menus, selectedKey)])

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  // if (!data) return

  // const { menus } = data
  // 递归处理每个菜单项的图标
  resolveMenuIcon(menus)

  const onMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    // 进行路由导航的跳转
    navigate(key)
  }

  return (
    <>
      <Menu theme="dark" mode="inline" items={menus} openKeys={openKeys} onOpenChange={onOpenChange} onClick={onMenuItemClick} selectedKeys={[selectedKey]} />
    </>
  )
}

// 定义一个方法，递归的处理每个菜单项的图标
const resolveMenuIcon = (menus: MenuItem[]) => {
  for (const menu of menus) {
    const iconName = menu.icon as keyof typeof iconMap
    menu.icon = iconMap[iconName]

    if (menu.children) {
      resolveMenuIcon(menu.children)
    }
  }
}

// 定义一个递归函数，递归的查找当前选中结点的父节点的 key 值，并 return
const getOpenKey = (menus: MenuItem[] | undefined, selectedKey: string, parentKey: string = ''): string => {
  if (!menus) return ''
  for (const item of menus) {
    // 如果当前循环项的 key 等于 selectedKey（被选中的菜单项的 key），则把父节点的 key 值返回
    if (item.key === selectedKey) {
      return parentKey
    }

    if (item.children) {
      const result = getOpenKey(item.children, selectedKey, item.key)
      if (result) {
        // 找到了
        return result
      }
    }
  }

  return ''
}

export default RootMenu
