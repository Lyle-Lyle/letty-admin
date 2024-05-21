import type { FC } from 'react';
import { Button, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import type { PopconfirmProps } from 'antd';
import { useActionData, useLocation, useSubmit } from 'react-router-dom';
import { useNavLoading, useNavSubmitting } from '@/utils/hooks';

const BtnDeleteArticle: FC<{ id: number }> = ({ id }) => {
  // 通过这个状态，来控制气泡确认框的显示和隐藏
  const [open, setOpen] = useState(false);
  const submit = useSubmit();
  const location = useLocation();
  const submitting = useNavSubmitting(
    'DELETE',
    location.pathname + location.search
  );
  const loading = useNavLoading('DELETE', location.pathname + location.search);
  const actionData = useActionData() as boolean | null;

  const confirm = () => {
    submit({ id }, { method: 'DELETE' });
  };

  const cancel = () => {
    console.log('取消删除！');
    setOpen(false);
  };
  const handleOpenChange: PopconfirmProps['onOpenChange'] = (isOpen, e) => {
    const btnType = e?.currentTarget.dataset.type;
    if (!isOpen && btnType !== 'btn-ok') {
      // 如果不是点击“确认”按钮触发的关闭行为，则调用 setOpen(false) 关闭气泡确认框
      setOpen(false);
    }
  };

  useEffect(() => {
    if (loading && actionData) {
      setOpen(false);
    }
  }, [loading, actionData]);

  return (
    <Popconfirm
      title='操作提示'
      description='您确认删除此文章吗？'
      onConfirm={confirm}
      onCancel={cancel}
      okText='确认'
      cancelText='取消'
      open={open}
      onOpenChange={handleOpenChange}
      okButtonProps={{
        'data-type': 'btn-ok',
        loading: submitting && { delay: 200 },
      }}
    >
      <Button type='link' size='small' onClick={() => console.log('删除', id)}>
        删除
      </Button>
    </Popconfirm>
  );
};

export default BtnDeleteArticle;
