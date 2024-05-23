import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Button, Modal, Form, Input } from 'antd'
import { useSubmit, useActionData } from 'react-router-dom'
import { useNavLoading, useNavSubmitting } from '@/utils/hooks.ts'

const ButtonAdd: FC = () => {
  // 控制对话框展示隐藏的 布尔值 状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formRef] = Form.useForm()
  const submit = useSubmit()
  const actionData = useActionData() as boolean
  const loading = useNavLoading('POST')
  const submitting = useNavSubmitting('POST')

  useEffect(() => {
    if (actionData && loading) {
      setIsModalOpen(false)
    }
  }, [actionData, loading])

  const handleOk = () => {
    // 关闭对话框
    // setIsModalOpen(false)
    // 手动触发表单的校验
    // 1. 需要先拿到表单的引用对象
    // 2. 调用表单引用对象的 validateFields 方法
    formRef
      .validateFields()
      .then((values: ArtCateAddForm) => {
        console.log('校验通过后的数据是：', values)
        submit(values, { method: 'POST' })
      })
      .catch((err) => {
        console.log('校验不通过:', err)
      })
  }

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        添加分类
      </Button>

      <Modal
        title="添加文章分类"
        cancelText="取消"
        okText="添加"
        okButtonProps={{
          loading: submitting && { delay: 200 }
        }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        afterClose={() => formRef.resetFields()}
      >
        <Form form={formRef} autoComplete="off" style={{ marginTop: 25 }}>
          <Form.Item
            label="分类名称"
            name="cate_name"
            rules={[
              { required: true, message: '请填写分类名称!' },
              { pattern: /^\S{1,10}$/, message: '分类名称必须是1-10位的非空字符!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="分类别名"
            name="cate_alias"
            rules={[
              { required: true, message: '请填写分类别名!' },
              { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字!' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ButtonAdd
