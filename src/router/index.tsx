import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../views/auth/AuthLayout';
import Login, { action as loginAction } from '../views/auth/Login';
import Register, { action as regAction } from '../views/auth/Register';
import Root, { loader as rootLoader } from '../views/root/root.tsx';
import AuthRoot from '@/views/root/auth-root';
import Home from '@/views/home/home.tsx';

import UserAvatar from '@/views/user/user-avatar';
import UserInfo from '@/views/user/user-info';
import UserPassword from '@/views/user/user-password';
import ArticleAdd from '@/views/article/article-add';
import ArticleCate from '@/views/article/article-cate';
import ArticleEdit from '@/views/article/article-edit';
import ArticleList from '@/views/article/article-list';

const router = createBrowserRouter([
  {
    path: '/login',
    action: loginAction,
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    action: regAction,
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },

  {
    path: '/',
    element: (
      <AuthRoot>
        <Root />
      </AuthRoot>
    ),
    loader: rootLoader,
    children: [
      // 索引路由
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'user-info', element: <UserInfo /> },
      { path: 'user-avatar', element: <UserAvatar /> },
      { path: 'user-pwd', element: <UserPassword /> },
      { path: 'art-cate', element: <ArticleCate /> },
      { path: 'art-list', element: <ArticleList /> },
      { path: 'art-add', element: <ArticleAdd /> },
      { path: 'art-edit/:id', element: <ArticleEdit /> },
    ],
  },
]);

export default router;
