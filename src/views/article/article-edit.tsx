/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { initArticle } from '@/store/art-edit-store'
import { useBeforeUnload, useBlocker, defer } from 'react-router-dom'
import type { LoaderFunctionArgs } from 'react-router-dom'
import { stepItems } from './article-add'
import { Modal, Steps, message } from 'antd'
import useArticleEditStore, { selectCurrent, resetCurrent, updateCurrent } from '@/store/art-edit-store'
import { ArticleSteps } from '@/store/art-add-store'
import { getCateListApi } from '@/api/cate-api.ts'
import to from 'await-to-js'
import EditBase from '@/components/article-edit/art-base'
import EditCover from '@/components/article-edit/art-cover'
import EditContent from '@/components/article-edit/art-content'
import EditResult from '@/components/article-edit/art-result'
import { putArticleApi } from '@/api/article-api'

const ArticleEdit: FC = () => {
  const current = useArticleEditStore(selectCurrent)

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    // 如果 return 的值为 true，则需要在导航之前，弹框询问用户是否确认离开
    // 如果 return 的值为 false，则在导航离开的时候，不需要进行弹框的确认，用户可以直接离开
    return currentLocation.pathname !== nextLocation.pathname && current !== ArticleSteps.done
  })

  const modalRef = useRef<ReturnType<typeof Modal.confirm> | null>()

  useEffect(() => {
    // 1. 判断 blocker.state 是否等于 blocked，如果条件成立，则需要进行弹窗的询问
    if (blocker.state === 'blocked') {
      if (modalRef.current) return
      // 2. 需要展示确认的弹框
      modalRef.current = Modal.confirm({
        title: '温馨提示',
        content: '您所做的更改将会丢失，是否确认离开当前页面？',
        okText: '确认离开',
        cancelText: '取消',
        onOk() {
          // 允许离开
          blocker.proceed()
        },
        onCancel() {
          // 阻止离开
          blocker.reset()
          modalRef.current = null
        }
      })
    }
  }, [blocker.state, blocker])

  useBeforeUnload(
    useCallback((e) => {
      // 进行刷新的阻止
      e.preventDefault()
    }, [])
  )

  return (
    <div>
      {/* 步骤条 */}
      <Steps size="small" current={current} items={stepItems} />

      {/* 步骤条对应的组件 */}
      <div style={{ marginTop: 20 }}>
        {current === ArticleSteps.base && <EditBase />}
        {current === ArticleSteps.cover && <EditCover />}
        {current === ArticleSteps.content && <EditContent />}
        {current === ArticleSteps.done && <EditResult />}
      </div>
    </div>
  )
}

export default ArticleEdit

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // 回显文章的数据
  const flag = initArticle(params.id!)
  // 请求文章分类的数据
  const cates = getCateListApi()

  // 重置 current 值
  resetCurrent()

  // 1. 方案1：把多个 Promise 封装到 Promise.all([]) 的数组中，统一返回给组件使用
  // 2. 方案2：把多个 Promise，封装到 defer 对象的多个属性中，这样，在组件中，可以只使用 Await 组件，等待自己需要的数据
  return defer({ cates, flag })
}

export const action = async () => {
  // 1. 拿到全局 Store 中存储的文章信息
  // 2. 需要对文章的信息进行梳理，得到一个 FormData 对象
  // 3. 调用接口
  const article = useArticleEditStore.getState().article

  const keys = ['id', 'title', 'cate_id', 'content', 'state', 'cover_img']
  const fd = new FormData()
  keys.forEach((key) => {
    fd.append(key, article[key])
  })

  const [err] = await to(putArticleApi(fd))
  if (err) return null
  message.success('修改成功！')
  updateCurrent()
  return null
}
