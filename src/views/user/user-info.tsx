import type { FC } from 'react';
import { Button, Form, Input, Space, message } from 'antd';

import useUserStore, { selectUserInfo } from '@/store/user-store';

import { ActionFunctionArgs, useNavigation, useSubmit } from 'react-router-dom';
import to from 'await-to-js';
import { updateUserInfoApi } from '@/api/user-api';

const UserInfo: FC = () => {
  const userInfo = useUserStore(selectUserInfo);
  const submit = useSubmit();
  const [formRef] = Form.useForm();
  const navigation = useNavigation();
  const onFinish = (values: UserInfoForm) => {
    submit(values, { method: 'PUT' });
  };

  return (
    <Form
      form={formRef}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={userInfo}
      onFinish={onFinish}
      autoComplete='off'
    >
      <Form.Item label='id' name='id' hidden>
        <Input readOnly />
      </Form.Item>

      <Form.Item
        label='昵称'
        name='nickname'
        rules={[
          { required: true, message: '请填写昵称!' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label='邮箱'
        name='email'
        rules={[
          { required: true, message: '请填写邮箱!' },
          {
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '请填写正确的邮箱!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
        <Space>
          <Button
            type='primary'
            htmlType='submit'
            loading={navigation.state !== 'idle' && { delay: 200 }}
          >
            保存
          </Button>
          <Button
            type='default'
            onClick={() => formRef.setFieldsValue(userInfo)}
          >
            还原
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  const [err] = await to(updateUserInfoApi(fd));

  if (err) return null;
  message.success('更新成功！');

  return null;
};

export default UserInfo;
