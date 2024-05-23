/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react'
import { Suspense } from 'react'
import { getCateListApi, postCateApi, editCateApi, delCateApi } from '@/api/cate-api.ts'
import to from 'await-to-js'
import { useLoaderData, defer, Await } from 'react-router-dom'
import type { ActionFunctionArgs } from 'react-router-dom'
import { Table, Space, message } from 'antd'
import type { TableProps } from 'antd'
import ButtonAdd from '@/components/article-cate/btn-add'
import ButtonEdit from '@/components/article-cate/btn-edit'
import ButtonDelete from '@/components/article-cate/btn-del'
import LoaderErrorElement from '@/components/common/loader-error-element'

const columns: TableProps<CateItem>['columns'] = [
  {
    title: '序号',
    render(_, __, index) {
      return index + 1
    }
  },
  {
    title: '分类名称',
    dataIndex: 'cate_name'
  },
  {
    title: '分类别名',
    dataIndex: 'cate_alias'
  },
  {
    title: '操作',
    render(_, record) {
      return (
        <>
          <ButtonEdit cate={record} />
          <ButtonDelete id={record.id} />
        </>
      )
    }
  }
]

const ArticleCate: FC = () => {
  const loaderData = useLoaderData() as { result: Promise<BaseResponse<CateItem[]>> }

  return (
    <Suspense fallback={<Table loading={true} />}>
      <Await resolve={loaderData.result} errorElement={<LoaderErrorElement />}>
        {(result: BaseResponse<CateItem[]>) => (
          <Space direction="vertical" style={{ display: 'flex' }}>
            <ButtonAdd />
            {/* 表格区域 */}
            <Table dataSource={result.data} columns={columns} size="middle" rowKey="id" pagination={false} bordered />
          </Space>
        )}
      </Await>
    </Suspense>
  )
}

export default ArticleCate

export const loader = async () => {
  // 调用接口，请求分类的列表数据
  const result = getCateListApi()

  // 如果想要减少 loader 的执行时间，那么异步的 Ajax 操作，可以不在 loader 中进行 await 等待
  // 而是直接把 Promise return 给组件，让组件自己进行 Promise 的等待
  return defer({ result })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData()
  // 获取请求的 method 类型
  const method = request.method.toUpperCase() as 'POST' | 'PUT' | 'PATCH' | 'DELETE'

  if (method === 'POST') {
    // 调用添加的 API 接口
    const [err] = await to(postCateApi(fd))
    if (err) return null
    message.success('添加成功!')
  } else if (method === 'PUT') {
    // 调用修改文章分类的接口
    const [err] = await to(editCateApi(fd))
    if (err) return null
    message.success('修改成功!')
  } else if (method === 'DELETE') {
    // 调用删除分类的接口
    // const [err] = await to(delCateApi(fd.get('id') as string))
    const [err] = await to(delCateApi(fd))
    if (err) return null
    message.success('删除成功!')
  }

  return true
}
