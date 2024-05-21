import type { FC } from 'react';
import { Button, Select, Form, Input } from 'antd';
import { useLoaderData } from 'react-router-dom';
import useArticleEditStore, {
  selectBase,
  updateBase,
  updateCurrent,
} from '@/store/art-edit-store';

const EditBase: FC = () => {
  const [formRef] = Form.useForm();
  const loaderData = useLoaderData() as { cates: CateItem[] } | null;
  const baseForm = useArticleEditStore(selectBase);
  const onFinish = () => {
    updateCurrent();
  };

  const handleValuesChange = (values: ArticleEditBaseForm) => {
    updateBase(values);
  };

  return (
    <>
      <Form
        form={formRef}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete='off'
        onValuesChange={handleValuesChange}
        initialValues={baseForm}
      >
        <Form.Item
          label='文章标题'
          name='title'
          rules={[{ required: true, message: '请填写文章标题!' }]}
        >
          <Input
            placeholder='请填写文章标题'
            maxLength={30}
            showCount
            allowClear
          />
        </Form.Item>

        <Form.Item
          label='文章分类'
          name='cate_id'
          rules={[{ required: true, message: '请选择文章分类!' }]}
        >
          <Select
            placeholder='请选择文章分类'
            allowClear
            options={loaderData?.cates}
            fieldNames={{ label: 'cate_name', value: 'id' }}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            下一步
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default EditBase;
