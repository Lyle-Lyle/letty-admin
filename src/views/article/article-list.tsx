import type { FC } from 'react';
import ArticleListSearch from '@/components/article-list/list-search';
import { Button, Flex, Space, message } from 'antd';
import {
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { getCateListApi } from '@/api/cate-api.ts';
import to from 'await-to-js';
import { getArticleListApi } from '@/api/article-api';
import ArticleListTable from '@/components/article-list/list-table';
import type { ActionFunctionArgs } from 'react-router-dom';
import { deleteArticleApi } from '@/api/article-api.ts';
import { useNavLoading } from '@/utils/hooks';

const ArticleList: FC = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as {
    list: Article[];
    total: number;
    q: ArtListQuery;
  } | null;

  const location = useLocation();
  const loading = useNavLoading('DELETE', location.pathname + location.search);
  return (
    <div>
      <Space direction='vertical' style={{ display: 'flex' }}>
        <Flex justify='space-between'>
          {/* 搜索组件 */}
          <ArticleListSearch />
          <Button type='primary' onClick={() => navigate('/art-add')}>
            添加文章
          </Button>
        </Flex>
        <div>{loaderData?.list.length}</div>
        {/* 表格组件 */}
        <ArticleListTable
          dataSource={loaderData?.list}
          rowKey='id'
          size='middle'
          bordered
          total={loaderData?.total}
          {...loaderData?.q}
          loading={loading}
        />
      </Space>
    </div>
  );
};

export default ArticleList;
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // 解析 URL 中的查询参数，把字符串解析为查询参数对象 q
  const searchParams = new URL(request.url).searchParams;

  const q: ArtListQuery = {
    pagenum: Number(searchParams.get('pagenum')) || 1,
    pagesize: Number(searchParams.get('pagesize')) || 2,
    cate_id: Number(searchParams.get('cate_id')) || '',
    state: searchParams.get('state') || '',
  };
  // 获取文章分类的列表数据
  const [err, res] = await to(getCateListApi());
  if (err) return null;
  // 获取分页的文章列表数据
  const [err2, res2] = await to(getArticleListApi(q));
  if (err2) return null;
  return { result: res.data, q, list: res2.data, total: res2.total };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();

  const [err] = await to(deleteArticleApi(fd));
  if (err) return null;
  message.success('删除成功！');
  // 如果删除成功了，我们需要先判断页码值是否需要回退
  const needBack = fd.get('needBack');
  if (needBack === 'true') {
    // 需要进行页码回退操作
    const url = new URL(request.url);
    const newPage = Number(url.searchParams.get('pagenum')) - 1;
    url.searchParams.set('pagenum', newPage.toString());
    return redirect(url.toString());
  }

  return true;
};
