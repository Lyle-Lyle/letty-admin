import { useMemo, type FC } from 'react';
import { Breadcrumb } from 'antd';
import { matchPath, useLoaderData, useLocation } from 'react-router-dom';

type BreadcrumbItem = {
  title: string;
};

//定义一个递归的函数，用来递归的生成面包屑导航的数据源
const resolveBreadcrumbItems = (
  menus: MenuItem[] | undefined,
  nowPath: string,
  breadcrumbItems: BreadcrumbItem[] = []
): BreadcrumbItem[] | undefined => {
  if (!menus) return;
  for (const item of menus) {
    // 进行路径的匹配操作：
    // 如果 matchResult 为 null 说明匹配失败
    // 如果 matchResult 是一个匹配的结果对象，说明匹配成功
    const matchResult = matchPath(item.key, nowPath);
    if (matchResult) {
      // 如果 matchResult 能转为 true，说明匹配成功
      breadcrumbItems.unshift({ title: item.label });
      return breadcrumbItems;
    }

    if (item.children) {
      // result 有两种结果：
      // 1. 找到了，那么 result 是一个数组，转为布尔值以后是 true
      // 2. 没找到子节点，那么 result 是 undefined，转为布尔值以后是 false
      const result = resolveBreadcrumbItems(
        item.children,
        nowPath,
        breadcrumbItems
      );
      if (result) {
        // 追加父节点
        breadcrumbItems.unshift({ title: item.label });
        return breadcrumbItems;
      }
    }
  }
};

const RootBreadcrumb: FC = () => {
  const loaderData = useLoaderData() as { menus: MenuItem[] } | null;
  const location = useLocation();
  const nowPath = location.pathname === '/' ? '/home' : location.pathname;
  const items = useMemo(
    () => resolveBreadcrumbItems(loaderData?.menus, nowPath),
    [loaderData, nowPath]
  );

  return <Breadcrumb items={items} />;
};

export default RootBreadcrumb;
