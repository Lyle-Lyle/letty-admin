import type { FC } from 'react'
import { useMemo } from 'react'
import { Breadcrumb } from 'antd'
import { useLocation, matchPath, useAsyncValue } from 'react-router-dom'

type BreadcrumbItem = {
  title: string
}

const RootBreadcrumb: FC = () => {
  // const loaderData = useLoaderData() as { menus: MenuItem[] } | null
  const [menuResult] = useAsyncValue() as [BaseResponse<MenuItem[]>]
  const menus = useMemo(() => menuResult.data || [], [menuResult])
  const location = useLocation()
  const nowPath = location.pathname === '/' ? '/home' : location.pathname

  // 只有 loaderData 或 nowPath 发生变化的时候，才会重新执行递归的函数，计算新的面包屑数据源
  const items = useMemo(() => resolveBreadcrumbItems(menus, nowPath), [menus, nowPath])

  return <Breadcrumb items={items} />
}

// 定义一个递归的函数，递归生成面包屑导航的数据源
const resolveBreadcrumbItems = (menus: MenuItem[] | undefined, nowPath: string, breadcrumbItems: BreadcrumbItem[] = []): BreadcrumbItem[] | undefined => {
  if (!menus) return
  for (const item of menus) {
    const matchResult = matchPath(item.key, nowPath)
    if (matchResult) {
      breadcrumbItems.unshift({ title: item.label })
      return breadcrumbItems
    }

    if (item.children) {
      // result 有两种结果：
      // 1. 找到了，那么 result 是一个数组，转为布尔值以后是 true
      // 2. 没找到子节点，那么 result 是 undefined，转为布尔值以后是 false
      const result = resolveBreadcrumbItems(item.children, nowPath, breadcrumbItems)
      if (result) {
        // 追加父节点
        breadcrumbItems.unshift({ title: item.label })
        return breadcrumbItems
      }
    }
  }
}

export default RootBreadcrumb
