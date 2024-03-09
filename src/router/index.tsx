import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Login from '@/pages/login/Login';
import Register from '@/pages/register/Register';
import Welcome from '@/pages/welcome/Welcome';
import Layout from '@/layout/index';
import UserList from '@/pages/management/user/index';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/welcome" />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '',
        element: <Layout />,
        children: [
            {
                path: '/welcome',
                element: <Welcome />,
            },
            {
                path: '/userList',
                element: <UserList />,
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/404" />,
    },
    {
        path: '/404',
        element: <div>404</div>,
    },
]);

export default router;
