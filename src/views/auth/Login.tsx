import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import {
  ActionFunctionArgs,
  Link,
  redirect,
  useFetcher,
  useSearchParams,
} from 'react-router-dom';
import { loginApi } from '@/api/auth-api';
import { setToken } from '@/store/app-store';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const loginFetcher = useFetcher();

  const onFinish = (values: LoginForm) => {
    loginFetcher.submit(values, { method: 'POST' });
    console.log('Received values of form: ', values);
  };

  return (
    <Form
      onFinish={onFinish}
      initialValues={{ username: searchParams.get('uname') }}
    >
      <Form.Item
        name='username'
        rules={[
          { required: true, message: 'Please input your Username!' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10位的非空字符!',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className='site-form-item-icon' />}
          placeholder='Username'
        />
      </Form.Item>
      <Form.Item
        name='password'
        rules={[
          { required: true, message: 'Please input your Password!' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15位的非空字符!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className='site-form-item-icon' />}
          type='password'
          placeholder='Password'
        />
      </Form.Item>
      <Form.Item>
        <a className='login-form-forgot' href=''>
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          className='login-form-button'
          loading={loginFetcher.state !== 'idle' && { delay: 200 }}
        >
          Log in
        </Button>
        Or <Link to='/register'>register now!</Link>
      </Form.Item>
    </Form>
  );
};

//因为登录成功之后，会把 token 存储到全局 store。紧接着会触发 AuthLayout 组件中的 if(token) 判断，发现 token 有值，因此会通过 <Navigate to="/" replace /> 自动跳转到后台主页。

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  try {
    const res = await loginApi(fd);
    setToken(res.token);
    message.success(res.message);
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default Login;
