import { FC } from 'react';
import { Image, Space } from 'antd';
import styles from '@/views/home/home.module.less';
// 二维码
import bili from '@/assets/images/bili.jpg';
import douyin from '@/assets/images/douyin.jpg';
import mp from '@/assets/images/mp.jpg';

const Home: FC = () => {
  return (
    <div className={styles.containerHome}>
      <h1 className={styles.title}>快来关注我吧~</h1>
      <br />
      <Space direction='horizontal' size={50}>
        {/* <Image
          width={300}
          height={500}
          className={styles.qrImage}
          fallback={fallbackImage}
          src={douyin}
        />
        <Image
          width={500}
          height={500}
          className={styles.qrImage}
          fallback={fallbackImage}
          src={mp}
        />
        <Image
          width={300}
          height={500}
          className={styles.qrImage}
          fallback={fallbackImage}
          src={bili}
        /> */}
      </Space>
    </div>
  );
};

export default Home;
