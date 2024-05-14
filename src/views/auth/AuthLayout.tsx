import React, { FC, PropsWithChildren } from 'react';
import styles from './AuthLayout.module.less';

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>{children}</div>
    </div>
  );
};

export default AuthLayout;
