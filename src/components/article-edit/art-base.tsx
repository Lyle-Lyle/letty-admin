import type { FC } from 'react'
import { Suspense, useEffect } from 'react'
import { Button, Select, Form, Input } from 'antd'
import { useLoaderData, Await } from 'react-router-dom'
import useArticleEditStore, { selectBase, updateBase, updateCurrent } from '@/store/art-edit-store'
import { LoadingOutlined } from '@ant-design/icons'

const EditBase: FC = () => {
  const [formRef] = Form.useForm()
  const loaderData = useLoaderData() as { cates: Promise<BaseResponse<CateItem[]>>; flag: Promise<true | null> }
  const baseForm = useArticleEditStore(selectBase)

  useEffect(() => {
    formRef.setFieldsValue(baseForm)
  }, [baseForm, formRef])

  const onFinish = () => {
    updateCurrent()
  }

  const handleValuesChange = (values: ArticleEditBaseForm) => {
    updateBase(values)
  }

  return (
    <>
      <Form
        form={formRef}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
        onValuesChange={handleValuesChange}
        initialValues={baseForm}
      >
        <Suspense
          fallback={
            <Form.Item label="文章标题" rules={[{ required: true, message: '请填写文章标题!' }]}>
              <Input placeholder="请填写文章标题" suffix={<LoadingOutlined style={{ fontSize: 12, color: '#d3d3d3' }} />} />
            </Form.Item>
          }
        >
          <Await resolve={loaderData.flag}>
            {() => {
              return (
                <Form.Item label="文章标题" name="title" rules={[{ required: true, message: '请填写文章标题!' }]}>
                  <Input placeholder="请填写文章标题" maxLength={30} showCount allowClear />
                </Form.Item>
              )
            }}
          </Await>
        </Suspense>

        <Suspense
          fallback={
            <Form.Item label="文章分类" rules={[{ required: true, message: '请选择文章分类!' }]}>
              <Select placeholder="请选择文章分类" options={[]} loading />
            </Form.Item>
          }
        >
          <Await resolve={loaderData.cates}>
            {(cates: BaseResponse<CateItem[]>) => {
              return (
                <>
                  <Form.Item label="文章分类" name="cate_id" rules={[{ required: true, message: '请选择文章分类!' }]}>
                    <Select placeholder="请选择文章分类" allowClear options={cates.data} fieldNames={{ label: 'cate_name', value: 'id' }} />
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                      下一步
                    </Button>
                  </Form.Item>
                </>
              )
            }}
          </Await>
        </Suspense>
      </Form>
    </>
  )
}

export default EditBase
