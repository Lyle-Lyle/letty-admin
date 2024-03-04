import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Login from '@/pages/login/Login';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
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
