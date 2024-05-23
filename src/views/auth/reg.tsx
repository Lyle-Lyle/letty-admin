/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space, message } from 'antd'
import { Link, useSubmit, redirect } from 'react-router-dom'
import type { ActionFunctionArgs } from 'react-router-dom'
import { regApi } from '@/api/auth-api.ts'
import to from 'await-to-js'
import { useNavSubmitting } from '@/utils/hooks'

const Reg: FC = () => {
  const submit = useSubmit()
  const submitting = useNavSubmitting('POST')

  const onFinish = (values: RegForm) => {
    if (submitting) return
    // 参数1：要提交给 action 的数据
    // 参数2：配置对象，用来指定提交的 method 和 action 地址
    submit(values, {
      method: 'POST'
    })
  }

  return (
    <Form onFinish={onFinish} size="large">
      <Form.Item
        name="username"
        rules={[
          { required: true, message: '请输入用户名！' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10位的非空字符！' }
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
      <Form.Item
        name="repassword"
        dependencies={['password']}
        validateFirst
        rules={[
          { required: true, message: '请确认密码！' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符！' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              // value 是当前表单项的值（第二个密码框的值）
              // getFieldValue('password') 用来获取指定表单项的值，
              if (value === getFieldValue('password')) return Promise.resolve()
              return Promise.reject(new Error('两次密码不一致！'))
            }
          })
        ]}
      >
        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Confirm Password" />
      </Form.Item>

      <Form.Item>
        <Space direction="vertical">
          <Button type="primary" htmlType="submit" loading={submitting && { delay: 200 }}>
            Register
          </Button>
          <div>
            Or <Link to="/login">login now!</Link>
          </div>
        </Space>
      </Form.Item>
    </Form>
  )
}

// 定义并导出路由的 action 函数
export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData()
  // 调用注册的接口
  const [err] = await to(regApi(fd))

  if (err) return null

  // 注册成功
  // 1. 提示用户成功的消息
  // 2. 立即跳转到登录页面（还需要把注册时候填写的用户名，以查询参数的形式带到登录页面）
  message.success('恭喜，注册成功！')
  return redirect('/login?uname=' + fd.get('username'))
}

export default Reg
