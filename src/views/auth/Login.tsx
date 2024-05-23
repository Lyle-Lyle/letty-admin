/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space, message } from 'antd'
import { Link, useSearchParams, useFetcher } from 'react-router-dom'
import type { ActionFunctionArgs } from 'react-router-dom'
import { loginApi } from '@/api/auth-api.ts'
import to from 'await-to-js'
import { setToken } from '@/store/app-store.ts'

const Login: FC = () => {
  // 解析 URL 中的查询参数
  const [searchParams] = useSearchParams()
  const loginFetcher = useFetcher()

  const onFinish = (values: LoginForm) => {
    if (loginFetcher.state === 'submitting') return
    loginFetcher.submit(values, { method: 'POST' })
  }

  return (
    <Form size="large" initialValues={{ username: searchParams.get('uname') }} onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[
          { required: true, message: '请输入用户名！' },
          { pattern: /^[0-9a-zA-Z]{1,10}$/, message: '用户名必须是1-10位的字母数字！' }
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码！' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符！' }
        ]}
      >
        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Space direction="vertical">
          <Button type="primary" htmlType="submit" loading={loginFetcher.state === 'submitting' && { delay: 200 }}>
            Log in
          </Button>
          <div>
            Or <Link to="/reg">register now!</Link>
          </div>
        </Space>
      </Form.Item>
    </Form>
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData()
  const [err, res] = await to(loginApi(fd))

  if (err) return null

  // 全局存储登录成功之后拿到的 token 值
  setToken(res.token)
  // 提示用户登录成功
  message.success(res.message)
  // 跳转到后台主页
  // return redirect('/')
  return null
}

export default Login
