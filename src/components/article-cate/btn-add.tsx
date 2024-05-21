import { useEffect, useState, type FC } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { useActionData, useSubmit } from 'react-router-dom';

import { useNavLoading, useNavSubmitting } from '@/utils/hooks.ts';
import useArtAddStore, { selectHasHydrated } from '@/store/art-add-store';

const ButtonAdd: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formRef] = Form.useForm();
  const submit = useSubmit();
  const loading = useNavLoading('POST');
  const submitting = useNavSubmitting('POST');
  const actionData = useActionData() as boolean;

  const handleOk = () => {
    // 关闭对话框
    setIsModalOpen(false);
    // 手动触发表单的校验
    // 1. 需要先拿到表单的引用对象
    // 2. 调用表单引用对象的 validateFields 方法
    formRef
      .validateFields()
      .then((values: ArtCateAddForm) => {
        console.log('校验通过后的数据是：', values);
        // TODO：提交表单数据到路由的 action 进行处理
        submit(values, { method: 'POST' });
      })
      .catch((err) => {
        console.log('校验不通过:', err);
      });
  };

  useEffect(() => {
    if (actionData && loading) {
      setIsModalOpen(false);
    }
  }, [actionData, loading]);
  return (
    <>
      <Button type='primary' onClick={() => setIsModalOpen(true)}>
        添加分类
      </Button>
      <Modal
        title='添加文章分类' // 对话框的标题
        cancelText='取消' // 取消按钮要显示的文本
        okText='添加' // 确认按钮要显示的文本
        okButtonProps={{
          loading: submitting && { delay: 200 },
        }}
        open={isModalOpen} // 是否展示对话框
        onOk={handleOk} // 确认按钮的事件处理函数
        onCancel={() => setIsModalOpen(false)} // 取消按钮的事件处理函数
        afterClose={() => formRef.resetFields()}
      >
        <Form autoComplete='off' style={{ marginTop: 25 }} form={formRef}>
          <Form.Item
            label='分类名称'
            name='cate_name'
            rules={[
              { required: true, message: '请填写分类名称!' },
              {
                pattern: /^\S{1,10}$/,
                message: '分类名称必须是1-10位的非空字符!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='分类别名'
            name='cate_alias'
            rules={[
              { required: true, message: '请填写分类别名!' },
              {
                pattern: /^[a-zA-Z0-9]{1,15}$/,
                message: '分类别名必须是1-15位的字母数字!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ButtonAdd;
