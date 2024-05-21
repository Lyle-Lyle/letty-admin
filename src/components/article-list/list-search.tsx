import { useEffect, type FC } from 'react';
import { Button, Form, Select } from 'antd';
import { useLoaderData, useSearchParams } from 'react-router-dom';

const ArticleListSearch: FC = () => {
  const [, setSearchParams] = useSearchParams();
  const [formRef] = Form.useForm();
  const loaderData = useLoaderData() as null | {
    result: CateItem[];
    q: ArtListQuery;
  };
  console.log(loaderData?.q);
  const onFinish = (values: Pick<ArtListQuery, 'cate_id' | 'state'>) => {
    const params = { ...loaderData?.q, ...values, pagenum: 1 } as unknown as {
      [x: string]: string;
    };
    setSearchParams(params);
  };
  useEffect(() => {
    formRef.setFieldsValue(loaderData?.q);
  }, [formRef, loaderData?.q]);

  return (
    <Form layout='inline' onFinish={onFinish} autoComplete='off' form={formRef}>
      <Form.Item label='分类' name='cate_id'>
        <Select placeholder='请选择' style={{ width: 180 }} options={[]} />
      </Form.Item>

      <Form.Item label='状态' name='state'>
        <Select
          placeholder='请选择'
          style={{ width: 180 }}
          options={
            loaderData?.result
              ? [{ cate_name: '请选择', id: '' }, ...loaderData.result]
              : []
          }
          fieldNames={{ label: 'cate_name', value: 'id' }}
        />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit'>
          搜索
        </Button>
      </Form.Item>

      <Form.Item>
        <Button onClick={() => setSearchParams()}>重置</Button>
      </Form.Item>
    </Form>
  );
};

export default ArticleListSearch;
