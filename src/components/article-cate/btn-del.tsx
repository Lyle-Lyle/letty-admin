import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Button, message, Popconfirm } from 'antd'
import type { PopconfirmProps } from 'antd'
import { useActionData, useSubmit } from 'react-router-dom'
import { useNavSubmitting, useNavLoading } from '@/utils/hooks.ts'

const ButtonDelete: FC<{ id: number }> = ({ id }) => {
  const [open, setOpen] = useState(false)
  const submit = useSubmit()
  const submitting = useNavSubmitting('DELETE')
  const loading = useNavLoading('DELETE')
  const actionData = useActionData() as boolean

  useEffect(() => {
    if (loading && actionData) {
      setOpen(false)
    }
  }, [loading, actionData])

  const handleDelete = () => {
    if (id === 1 || id === 2) {
      return message.error('管理员不允许删除此分类！')
    }
    setOpen(true)
  }

  const confirm = () => {
    console.log('确认删除！', id)
    submit({ id }, { method: 'DELETE' })
  }

  const cancel = () => {
    console.log('取消了删除')
    setOpen(false)
  }

  const handleOpenChange: PopconfirmProps['onOpenChange'] = (isOpen, e) => {
    const btnType = e?.currentTarget.dataset.type
    if (!isOpen && btnType !== 'btn-ok') {
      // 手动关闭旧的气泡确认框
      setOpen(false)
    }
  }

  return (
    <>
      <Popconfirm
        open={open}
        title="操作提示"
        description="您确定删除此文章分类吗？"
        onConfirm={confirm}
        onCancel={cancel}
        okText="确定"
        cancelText="取消"
        onOpenChange={handleOpenChange}
        okButtonProps={{
          'data-type': 'btn-ok',
          loading: submitting && { delay: 200 }
        }}
      >
        <Button type="link" size="small" onClick={handleDelete}>
          删除
        </Button>
      </Popconfirm>
    </>
  )
}

export default ButtonDelete
