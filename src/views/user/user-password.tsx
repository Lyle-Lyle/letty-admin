/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react'
import { Button, Form, Input, Space, message, Spin } from 'antd'
import { useSubmit, useActionData } from 'react-router-dom'
import type { ActionFunctionArgs } from 'react-router-dom'
import { updatePwdApi } from '@/api/user-api.ts'
import to from 'await-to-js'
import { useNavSubmitting } from '@/utils/hooks'

const UserPassword: FC = () => {
  const [formRef] = Form.useForm()
  const submit = useSubmit()
  const actionData = useActionData() as { result: boolean } | null
  const submitting = useNavSubmitting('PATCH')

  if (actionData?.result) {
    // 密码更新成功了，重置表单
    formRef.resetFields()
  }

  const onFinish = (values: ResetPwdForm) => {
    if (submitting) return
    submit(values, { method: 'PATCH' })
  }

  return (
    <Form form={formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }} onFinish={onFinish} autoComplete="off">
      <Spin spinning={submitting} delay={200}>
        <Form.Item
          label="原密码"
          name="old_pwd"
          validateFirst
          rules={[
            { required: true, message: '请填写原密码!' },
            { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符!' }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="new_pwd"
          dependencies={['old_pwd']}
          validateFirst
          rules={[
            { required: true, message: '请填写新密码!' },
            { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                // 校验通过 return Promise.resolve()
                if (value !== getFieldValue('old_pwd')) return Promise.resolve()
                // 校验不通过 return Promise.reject('')
                return Promise.reject(new Error('新旧密码不能相同!'))
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="确认新密码"
          name="re_pwd"
          dependencies={['new_pwd']}
          validateFirst
          rules={[
            { required: true, message: '请再次确认新密码!' },
            { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value === getFieldValue('new_pwd')) return Promise.resolve()
                return Promise.reject('两次新密码不一致!')
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button type="default" onClick={() => formRef.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Spin>
    </Form>
  )
}

export default UserPassword

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData()
  const [err] = await to(updatePwdApi(fd))

  if (err) return null
  message.success('密码更新成功！')
  return { result: true }
}
