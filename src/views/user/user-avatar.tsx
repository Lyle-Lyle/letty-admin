/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react'
import { useRef, useState, useMemo } from 'react'
import { Space, Button, Avatar, message } from 'antd'
import useUserStore, { selectAvatar } from '@/store/user-store'
import { useSubmit } from 'react-router-dom'
import type { ActionFunctionArgs } from 'react-router-dom'
import { updateAvatarApi } from '@/api/user-api.ts'
import to from 'await-to-js'
import { useNavSubmitting } from '@/utils/hooks'

const UserAvatar: FC = () => {
  const avatar = useUserStore(selectAvatar)
  const [newAvatar, setNewAvatar] = useState('')
  const iptRef = useRef<HTMLInputElement>(null)
  const submit = useSubmit()
  const submitting = useNavSubmitting('PATCH')

  // 动态计算，并缓存计算的结果
  const isDisabled = useMemo(() => !newAvatar || newAvatar === avatar, [newAvatar, avatar])

  const showDialog = () => {
    iptRef.current?.click()
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files || files.length === 0) return

    // 创建文件读取器，把文件读为 base64 的字符串
    const fr = new FileReader()
    fr.readAsDataURL(files[0])
    fr.onload = () => {
      if (fr.result) {
        setNewAvatar(fr.result as string)
      }
    }
  }

  const saveAvatar = () => {
    if (submitting) return
    submit({ avatar: newAvatar }, { method: 'PATCH' })
  }

  return (
    <Space direction="vertical">
      {/* 按需渲染头像组件 */}
      {newAvatar || avatar ? (
        <Avatar size={300} shape="square" src={newAvatar || avatar} />
      ) : (
        <Avatar size={300} shape="square" onClick={showDialog}>
          请选择头像
        </Avatar>
      )}

      <Space direction="horizontal">
        <Button onClick={showDialog}>选择照片</Button>
        <Button type="primary" disabled={isDisabled} loading={submitting && { delay: 200 }} onClick={saveAvatar}>
          保存头像
        </Button>
        <input type="file" accept="image/*" style={{ display: 'none' }} ref={iptRef} onChange={onFileChange} />
      </Space>
    </Space>
  )
}

export default UserAvatar

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData()
  const [err] = await to(updateAvatarApi(fd))

  if (err) return null
  message.success('头像更新成功！')
  return null
}
