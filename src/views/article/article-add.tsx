import { FC, useEffect, useRef } from 'react';
import { useState } from 'react';
import { Steps, Button, message } from 'antd';
import ArticleBase from '@/components/article-add/art-base';
import { getCateListApi } from '@/api/cate-api.ts';
import to from 'await-to-js';
import useArtAddStore, {
  selectCurrent,
  ArticleSteps,
  setCurrent,
  selectHasHydrated,
  resetCurrent,
  clearArticle,
} from '@/store/art-add-store';
import ArticleCover from '@/components/article-add/art-cover';
import ArticleContent from '@/components/article-add/art-content';
import { postArticleApi } from '@/api/article-api';
import type { ArtAddStore } from '@/store/art-add-store.ts';
import localforage from '@/utils/localforage';
import type { StorageValue } from 'zustand/middleware';

import { FloatButton, Modal } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
// 静态的数据源，没必要定义到组件中
export const stepItems = [
  {
    title: '基本信息',
  },
  {
    title: '文章封面',
  },
  {
    title: '文章内容',
  },
  {
    title: 'Done',
  },
];

const ArticleAdd: FC = () => {
  // const [current, setCurrent] = useState(0);
  const current = useArtAddStore(selectCurrent);
  const hasHydrated = useArtAddStore(selectHasHydrated);
  const modalRef = useRef<() => void>();
  const HandleClean = () => {
    // 1. 弹框询问用户是否确认清空表单
    modalRef.current = Modal.confirm({
      title: '操作提示',
      content: '此操作会清空表单中填写的所有数据，确认清空吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 2. 执行具体的清空操作
        // 2.1 清空文章内容
        clearArticle();
        // 2.2 重置 steps
        resetCurrent();
        // 2.3 提示清空成功
        message.success('表单清空完毕！');
      },
    }).destroy;
  };

  useEffect(() => {
    // 返回一个清理函数，当组件卸载的时候，会被执行
    return () => modalRef.current && modalRef.current();
  }, []);

  return (
    hasHydrated && (
      <div>
        {/* 步骤条 */}
        <Steps size='small' current={current} items={stepItems} />

        <div style={{ marginTop: 20 }}>
          {/* 根据 current 的值，按需渲染对应的组件 */}
          {current === ArticleSteps.base && <ArticleBase />}
          {current === ArticleSteps.cover && <ArticleCover />}
          {current === ArticleSteps.content && <ArticleContent />}
        </div>
        {/* 浮动按钮 */}
        <FloatButton
          type='primary'
          icon={<ClearOutlined />}
          tooltip='清空表单'
          onClick={HandleClean}
        />

        <Button onClick={() => setCurrent((prev) => prev - 1)}>上一步</Button>
        <Button type='primary' onClick={() => setCurrent((prev) => prev + 1)}>
          下一步
        </Button>
      </div>
    )
  );
};

export const loader = async () => {
  // 获取 Store 中 current 的值，进行判断，
  // 如果值等于 Done 这种状态，就立即把状态重置为 base 状态（0）
  // 这样，在真正渲染 ArticleAdd 组件的时候，
  // 默认会展示基本信息对应的 Steps 组件
  const localData = await localforage.getItem<StorageValue<ArtAddStore>>(
    'art-add-store'
  );
  const current = localData?.state.current;
  if (current === ArticleSteps.done) {
    resetCurrent();
  }
  console.log(current);
  const [err, res] = await to(getCateListApi());

  if (err) return null;
  return { cates: res.data };
};

export default ArticleAdd;

// 派生文章内容
export const selectContent = (state: ArtAddStore) => state.article.content;

// 存储文章内容
export const setContent = (content: string) => {
  useArtAddStore.setState((state) => {
    state.article.content = content;
  });
};

export const action = async () => {
  const article = useArtAddStore.getState().article;
  // 需要把对象格式的请求体数据，转为 FormData 格式的请求体
  const fd = new FormData();
  for (const key in article) {
    fd.append(key, article[key]);
  }
  // 调用接口
  const [err] = await to(postArticleApi(fd));
  if (err) return null;
  // 添加文章成功
  setCurrent();
  message.success(
    article.state === '草稿' ? '草稿保存成功！' : '文章发表成功！'
  );
  const msg = article.state === '草稿' ? '草稿保存成功！' : '文章发表成功！';
  message.success(msg);
  clearArticle();
  return { msg };
};
