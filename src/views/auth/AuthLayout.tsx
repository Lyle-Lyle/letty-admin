import type { FC, PropsWithChildren } from 'react';
import useAppStore, { selectToken } from '@/store/app-store';
import { Navigate } from 'react-router-dom';
import styles from '@/views/auth/AuthLayout.module.less';

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const token = useAppStore(selectToken);

  if (token) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>{children}</div>
    </div>
  );
};

export default AuthLayout;
