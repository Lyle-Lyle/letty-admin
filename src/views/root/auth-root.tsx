import type { FC, PropsWithChildren } from 'react';
import useAppStore, { selectToken } from '@/store/app-store.ts';
import { Navigate } from 'react-router-dom';

/**
 *
 * 权限路由
 */

const AuthRoot: FC<PropsWithChildren> = ({ children }) => {
  // 基于 Selector 选取派生的数据
  const token = useAppStore(selectToken);

  if (token) {
    // 有 token，已登录
    return <>{children}</>;
  } else {
    // 无 token，需要强制跳转到登录页面
    return <Navigate to='/login' replace />;
  }
};

export default AuthRoot;
