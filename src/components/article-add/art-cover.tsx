import { useRef, type FC } from 'react';
import { Space, Button, Avatar, message } from 'antd';
import useArtAddStore, {
  setCurrent,
  Move,
  setArticleCover,
  selectCover,
} from '@/store/art-add-store.ts';

const ArticleCover: FC = () => {
  const iptRef = useRef<HTMLInputElement>(null);
  const coverURL = useArtAddStore(selectCover);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    // 拿到文件之后，size 的单位是字节（Byte）
    // 1M = 1024KB = 1024 * 1024B
    if (files[0].size > 1024 * 1024 * 2)
      return message.error('封面图片大小不能超过2M!');

    console.log(files[0]);
    // 存储文章封面
    setArticleCover(files[0]);
  };

  const handleNext = () => {
    if (!coverURL) {
      return message.error('请选择文章封面！');
    }
    setCurrent();
  };

  return (
    <>
      <Space direction='vertical'>
        {coverURL ? (
          <Avatar size={300} shape='square' src={coverURL} />
        ) : (
          <Avatar size={300} shape='square'>
            请选择文章封面
          </Avatar>
        )}

        <Space direction='horizontal'>
          <Button type='primary' onClick={() => setCurrent(Move.prev)}>
            上一步
          </Button>
          <Button type='primary' onClick={() => iptRef.current?.click()}>
            选择封面
          </Button>
          <Button type='primary' onClick={handleNext}>
            下一步
          </Button>
          <input
            type='file'
            accept='image/*'
            style={{ display: 'none' }}
            ref={iptRef}
            onChange={handleFileChange}
          />
        </Space>
      </Space>
    </>
  );
};

export default ArticleCover;
