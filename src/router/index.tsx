import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../views/auth/AuthLayout';
import Login, { action as loginAction } from '../views/auth/Login';
import Register, { action as regAction } from '../views/auth/Register';

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
]);

export default router;
