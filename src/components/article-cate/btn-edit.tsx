import { useEffect, useState, type FC } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
import { useActionData, useSubmit } from 'react-router-dom';
import { useNavLoading, useNavSubmitting } from '@/utils/hooks';

const ButtonEdit: FC<{ cate: CateItem }> = ({ cate }) => {
  const [formRef] = Form.useForm<CateItem>();
  const submit = useSubmit();
  const submitting = useNavSubmitting('PUT');
  const loading = useNavLoading('PUT');
  const actionData = useActionData() as boolean | null;
  const showEditModal = () => {
    console.log(cate);
    if (cate.id === 1 || cate.id === 2) {
      message.error('管理员不允许修改此数据！');
      return;
    }

    // 通过 Form 的 ref 引用对象，进行表单数据的回显操作
    formRef.setFieldsValue(cate);

    // TODO：展示 Modal 对话框，进行修改的操作
    setIsModalOpen(true);
  };
  const handleOk = () => {
    formRef
      .validateFields()
      .then((values) => {
        submit(values, { method: 'PUT' });
        // TODO：把验证通过的表单数据，提交到路由的 action 中进行处理
      })
      .catch((err) => {
        console.log('表单校验失败：', err);
      });
  };
  useEffect(() => {
    if (loading && actionData) {
      setIsModalOpen(false);
    }
  }, [loading, actionData]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button type='link' size='small' onClick={showEditModal}>
        修改
      </Button>
      <Modal
        title='修改文章分类'
        cancelText='取消'
        okText='保存'
        okButtonProps={{ loading: submitting && { delay: 200 } }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        afterClose={() => formRef.resetFields()}
      >
        <Form form={formRef} autoComplete='off' style={{ marginTop: 25 }}>
          <Form.Item label='id' name='id' hidden>
            <Input readOnly />
          </Form.Item>

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

export default ButtonEdit;
