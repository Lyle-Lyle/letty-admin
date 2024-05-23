import type { FC } from 'react'
import { useRef } from 'react'
import { Space, Button, message, Spin } from 'antd'
import { useNavSubmitting } from '@/utils/hooks.ts'
import { useSubmit } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import styles from '../article-add/css/art-content.module.less'
import useArticleEditStore, { updateCurrent, setContent, setArticleState, selectContent, selectIsShowDraft } from '@/store/art-edit-store'
import { Move } from '@/store/art-add-store'
import { modules } from '@/components/article-add/art-content'

const EditContent: FC = () => {
  // 选取全局的文章内容
  const value = useArticleEditStore(selectContent)
  const submit = useSubmit()
  const submitting = useNavSubmitting('PUT')
  const isShowDarft = useRef(useArticleEditStore(selectIsShowDraft))

  // 按钮的点击事件处理函数
  const publish = (state: '草稿' | '已发布') => {
    if (!value) return message.error('请填写文章的内容！')
    setArticleState(state)
    submit(null, { method: 'PUT', navigate: false })
  }

  return (
    <div className={styles.artContent}>
      <Spin spinning={submitting} delay={200}>
        <Space direction="vertical" style={{ display: 'flex' }}>
          <ReactQuill theme="snow" value={value} onChange={setContent} modules={modules} />

          {/* 按钮区域 */}
          <Space direction="horizontal">
            <Button type="primary" onClick={() => updateCurrent(Move.prev)}>
              上一步
            </Button>
            <Button type="primary" onClick={() => publish('草稿')} style={{ display: isShowDarft.current ? '' : 'none' }}>
              存为草稿
            </Button>
            <Button type="primary" onClick={() => publish('已发布')}>
              发布
            </Button>
          </Space>
        </Space>
      </Spin>
    </div>
  )
}

export default EditContent
