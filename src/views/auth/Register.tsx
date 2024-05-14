import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import {
  ActionFunction,
  ActionFunctionArgs,
  redirect,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import { regApi } from '@/api/auth-api';

const Register: React.FC = () => {
  const submit = useSubmit();
  const navigation = useNavigation();

  const onFinish = (values: RegisterForm) => {
    console.log('Received values of form: ', values);
    submit(values, {
      method: 'POST',
      action: '/register',
    });
  };

  return (
    <Form
      name='normal_login'
      className='login-form'
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name='username'
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input
          prefix={<UserOutlined className='site-form-item-icon' />}
          placeholder='Username'
        />
      </Form.Item>
      <Form.Item
        name='password'
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className='site-form-item-icon' />}
          type='password'
          placeholder='Password'
        />
      </Form.Item>

      <Form.Item
        name='repassword'
        rules={[
          { required: true, message: 'Please confirm your Password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The new password that you entered do not match!')
              );
            },
          }),
        ]}
      >
        <Input
          prefix={<LockOutlined className='site-form-item-icon' />}
          type='password'
          placeholder='confirm your password'
        />
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          className='login-form-button'
          loading={navigation.state !== 'idle' && { delay: 200 }}
        >
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

// 定义并导出路由的action函数
export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  console.log('ok', fd.get('username'));
  // 做了自动转换
  // const data = Object.fromEntries(fd) as RegisterForm;

  try {
    const res = await regApi(fd);
    console.log(res);
  } catch (err) {
    console.log(err);
    if (err) return null;
  }
  message.success('Register successfully');
  return redirect('/login?uname=' + fd.get('username'));
};

export default Register;
