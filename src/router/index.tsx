import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../views/auth/AuthLayout';
import Login, { action as loginAction } from '../views/auth/Login';
import Register, { action as regAction } from '../views/auth/Register';
import Root, { loader as rootLoader } from '../views/root/root.tsx';
import AuthRoot from '@/views/root/auth-root';
import Home from '@/views/home/home.tsx';

import UserAvatar, {
  action as userAvatarAction,
} from '@/views/user/user-avatar';
import UserInfo, { action as userInfoAction } from '@/views/user/user-info';
import ArticleEdit, {
  loader as artEditLoader,
  action as artEditAction,
} from '@/views/article/article-edit';
import ArticleList, {
  loader as artListLoader,
  action as artListAction,
} from '@/views/article/article-list';
import ArticleCate, {
  loader as artCateLoader,
  action as artCateAction,
} from '@/views/article/article-cate';
import UserPassword, {
  action as userPwdAction,
} from '@/views/user/user-password';
import ArticleAdd, {
  loader as artAddLoader,
  action as artAddAction,
} from '@/views/article/article-add';

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
      { path: 'user-info', element: <UserInfo />, action: userInfoAction },
      {
        path: 'user-avatar',
        element: <UserAvatar />,
        action: userAvatarAction,
      },
      { path: 'user-pwd', element: <UserPassword />, action: userPwdAction },
      {
        path: 'art-cate',
        element: <ArticleCate />,
        loader: artCateLoader,
        action: artCateAction,
      },
      {
        path: 'art-list',
        element: <ArticleList />,
        loader: artListLoader,
        action: artListAction,
      },
      {
        path: 'art-add',
        element: <ArticleAdd />,
        loader: artAddLoader,
        action: artAddAction,
        shouldRevalidate: () => false,
      },
      {
        path: 'art-edit/:id',
        element: <ArticleEdit />,
        loader: artEditLoader,
        action: artEditAction,
        shouldRevalidate: () => false,
      },
    ],
  },
]);

export default router;
