/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react'
import { Suspense, useMemo } from 'react'
import { Button, Flex, Space, message, Skeleton, Spin } from 'antd'
import { useNavigate, useLoaderData, redirect, defer, Await, useNavigation } from 'react-router-dom'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom'
import ArticleListSearch from '@/components/article-list/list-search'
import ArticleListTable from '@/components/article-list/list-table'
import { getCateListApi } from '@/api/cate-api.ts'
import { getArticleListApi, deleteArticleApi } from '@/api/article-api.ts'
import to from 'await-to-js'
import LoaderErrorElement from '@/components/common/loader-error-element'

const ArticleList: FC = () => {
  const navigate = useNavigate()
  const loaderData = useLoaderData() as { result: Promise<[BaseResponse<CateItem[]>, ArticleListResponse]>; q: ArtListQuery }
  const navigation = useNavigation()
  console.log(navigation)

  const navLoading = useMemo(() => {
    if (navigation.state === 'loading' && navigation.location.pathname === '/art-list') {
      return true
    }
    return false
  }, [navigation.state, navigation.location?.pathname])

  return (
    <Suspense fallback={<Skeleton active />}>
      <Await resolve={loaderData.result} errorElement={<LoaderErrorElement />}>
        {(result: [BaseResponse<CateItem[]>, ArticleListResponse]) => {
          const artListResult = result[1]
          return (
            <Spin spinning={navLoading}>
              <Space direction="vertical" style={{ display: 'flex' }}>
                {/* 搜索组件 */}
                <Flex justify="space-between">
                  <ArticleListSearch />
                  <Button type="primary" onClick={() => navigate('/art-add')}>
                    添加文章
                  </Button>
                </Flex>

                {/* 表格组件 */}
                <ArticleListTable dataSource={artListResult.data} rowKey="id" size="middle" bordered total={artListResult.total} {...loaderData?.q} />
              </Space>
            </Spin>
          )
        }}
      </Await>
    </Suspense>
  )
}

export default ArticleList

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // 解析 URL 中的查询参数，把字符串解析为查询参数对象 q
  const searchParams = new URL(request.url).searchParams

  const q: ArtListQuery = {
    pagenum: Number(searchParams.get('pagenum')) || 1,
    pagesize: Number(searchParams.get('pagesize')) || 2,
    cate_id: Number(searchParams.get('cate_id')) || '',
    state: searchParams.get('state') || ''
  }

  const result = Promise.all([getCateListApi(), getArticleListApi(q)])

  // return { result: res.data, q, list: res2.data, total: res2.total }
  return defer({ q, result })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData()

  const [err] = await to(deleteArticleApi(fd))
  if (err) return null
  message.success('删除成功！')

  // 如果删除成功了，我们需要先判断页码值是否需要回退
  const needBack = fd.get('needBack')
  if (needBack === 'true') {
    // 需要进行页码回退操作
    const url = new URL(request.url)
    const newPage = Number(url.searchParams.get('pagenum')) - 1
    url.searchParams.set('pagenum', newPage.toString())
    return redirect(url.toString())
  }

  return true
}
