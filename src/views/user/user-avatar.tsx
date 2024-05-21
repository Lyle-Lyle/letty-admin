import { useMemo, useRef, useState, type FC } from 'react';
import { Space, Button, Avatar, message } from 'antd';
import useUserStore, { selectAvatar } from '@/store/user-store';
import { updateAvatarApi } from '@/api/user-api';
import to from 'await-to-js';
import { ActionFunctionArgs, useNavigation, useSubmit } from 'react-router-dom';

const UserAvatar: FC = () => {
  const avatar = useUserStore(selectAvatar);
  const iptRef = useRef<HTMLInputElement>(null);
  const [newAvatar, setNewAvatar] = useState('');
  const navigation = useNavigation();

  // 动态计算，并缓存计算的结果
  const isDisabled = useMemo(
    () => !newAvatar || newAvatar === avatar,
    [newAvatar, avatar]
  );

  const submit = useSubmit();
  const saveAvatar = () => {
    submit({ avatar: newAvatar }, { method: 'PATCH' });
  };

  const showDialog = () => {
    iptRef.current?.click();
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    // 创建文件读取器，把文件读为 base64 的字符串
    const fr = new FileReader();
    fr.readAsDataURL(files[0]);
    fr.onload = () => {
      if (fr.result) {
        // 把读取成功的内容，存储到 state 状态中
        setNewAvatar(fr.result as string);
      }
    };
  };
  return (
    <Space direction='vertical'>
      {/* 按需渲染头像组件 */}
      {newAvatar || avatar ? (
        <Avatar size={300} shape='square' src={newAvatar || avatar} />
      ) : (
        <Avatar size={300} shape='square' onClick={showDialog}>
          请选择头像
        </Avatar>
      )}

      <Space direction='horizontal'>
        <Button onClick={showDialog}>选择照片</Button>
        <Button
          type='primary'
          disabled={isDisabled}
          onClick={saveAvatar}
          loading={navigation.state !== 'idle' && { delay: 200 }}
        >
          保存头像
        </Button>
        <input
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          ref={iptRef}
          onChange={onFileChange}
        />
      </Space>
    </Space>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  const [err] = await to(updateAvatarApi(fd));

  if (err) return null;
  message.success('头像更新成功！');
  return null;
};

export default UserAvatar;
