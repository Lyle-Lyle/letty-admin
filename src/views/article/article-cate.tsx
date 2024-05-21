/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react';
import { editCateApi, getCateListApi } from '@/api/cate-api.ts';
import to from 'await-to-js';
import { useLoaderData } from 'react-router-dom';

import { Button, Table } from 'antd';
import type { TableProps } from 'antd';

import { Space } from 'antd';
import ButtonAdd from '@/components/article-cate/btn-add';

import type { ActionFunctionArgs } from 'react-router-dom';
import { postCateApi } from '@/api/cate-api.ts';
import { message } from 'antd';

import ButtonEdit from '@/components/article-cate/btn-edit';
import ButtonDelete from '@/components/article-cate/btn-del';

import { delCateApi } from '@/api/cate-api.ts';

const columns: TableProps<CateItem>['columns'] = [
  {
    title: '序号',
    render(_, __, index) {
      return index + 1;
    },
  },
  {
    title: '分类名称',
    dataIndex: 'cate_name',
  },
  {
    title: '分类别名',
    dataIndex: 'cate_alias',
  },
  {
    title: '操作',
    render(_, record) {
      return (
        <>
          <ButtonEdit cate={record} />
          <ButtonDelete id={record.id} />
        </>
      );
    },
  },
];

const ArticleCate: FC = () => {
  const loaderData = useLoaderData() as { cates: CateItem[] } | null;
  return (
    loaderData && (
      <Space direction='vertical' style={{ display: 'flex' }}>
        <ButtonAdd />
        {/* 表格区域 */}
        <Table
          dataSource={loaderData.cates}
          columns={columns}
          size='middle'
          rowKey='id'
          pagination={false}
          bordered
        />
      </Space>
    )
  );
};

export default ArticleCate;

export const loader = async () => {
  const [err, res] = await to(getCateListApi());

  if (err) return null;
  return { cates: res.data };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  // 获取请求的 method 类型
  const method = request.method.toUpperCase() as
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';

  if (method === 'POST') {
    // 调用添加的 API 接口
    const [err] = await to(postCateApi(fd));
    if (err) return null;
    message.success('添加成功!');
  } else if (method === 'PUT') {
    // 调用修改文章分类的接口
    const [err] = await to(editCateApi(fd));
    if (err) return null;
    message.success('修改成功!');
  } else if (method === 'DELETE') {
    // 调用删除分类的接口
    const [err] = await to(delCateApi(fd));
    if (err) return null;
    message.success('删除成功!');
  }
  return true;
};
