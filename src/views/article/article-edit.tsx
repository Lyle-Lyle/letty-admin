import { useCallback, useEffect, useRef, type FC } from 'react';

import { initArticle, updateCurrent } from '@/store/art-edit-store';
import {
  useBeforeUnload,
  useBlocker,
  type LoaderFunctionArgs,
} from 'react-router-dom';
import { stepItems } from './article-add';
import { Modal, Steps, message } from 'antd';
import useArticleEditStore, { selectCurrent } from '@/store/art-edit-store';
import { ArticleSteps, resetCurrent } from '@/store/art-add-store';
import { getCateListApi } from '@/api/cate-api.ts';
import to from 'await-to-js';
import EditBase from '@/components/article-base/art-base';
import EditCover from '@/components/article-edit/art-cover';
import EditContent from '@/components/article-edit/art-content';
import { putArticleApi } from '@/api/article-api';
import EditResult from '@/components/article-edit/art-result';

const ArticleEdit: FC = () => {
  const current = useArticleEditStore(selectCurrent);
  const modalRef = useRef<ReturnType<typeof Modal.confirm> | null>();
  useBeforeUnload(
    useCallback((e) => {
      // 进行刷新的阻止
      e.preventDefault();
    }, [])
  );
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    // 如果 return 的值为 true，则需要在导航之前，弹框询问用户是否确认离开
    // 如果 return 的值为 false，则在导航离开的时候，不需要进行弹框的确认，用户可以直接离开
    return (
      currentLocation.pathname !== nextLocation.pathname &&
      current !== ArticleSteps.done
    );
  });

  useEffect(() => {
    // 1. 判断 blocker.state 是否等于 blocked，如果条件成立，则需要进行弹窗的询问
    if (blocker.state === 'blocked') {
      if (modalRef.current) return;
      // 2. 需要展示确认的弹框
      modalRef.current = Modal.confirm({
        title: '温馨提示',
        content: '您所做的更改将会丢失，是否确认离开当前页面？',
        okText: '确认离开',
        cancelText: '取消',
        onOk() {
          // 允许离开
          blocker.proceed();
        },
        onCancel() {
          // 阻止离开
          blocker.reset();
          modalRef.current = null;
        },
      });
    }
  }, [blocker.state, blocker]);
  return (
    <div>
      {/* 步骤条 */}
      <Steps size='small' current={current} items={stepItems} />
      <div style={{ marginTop: 20 }}>
        {current === ArticleSteps.base && <EditBase />}
        {current === ArticleSteps.cover && <EditCover />}
        {current === ArticleSteps.content && <EditContent />}
        {current === ArticleSteps.done && <EditResult />}
      </div>
    </div>
  );
};

export default ArticleEdit;
export const loader = async ({ params }: LoaderFunctionArgs) => {
  // 回显文章的数据
  await initArticle(params.id!);
  // 请求文章分类的数据
  const [err, res] = await to(getCateListApi());
  if (err) return null;

  // 重置 current 值
  resetCurrent();
  return { cates: res.data };
};

export const action = async () => {
  // 1. 拿到全局 Store 中存储的文章信息
  // 2. 需要对文章的信息进行梳理，得到一个 FormData 对象
  // 3. 调用接口
  const article = useArticleEditStore.getState().article;

  const keys = ['id', 'title', 'cate_id', 'content', 'state', 'cover_img'];
  const fd = new FormData();
  keys.forEach((key) => {
    fd.append(key, article[key]);
  });

  const [err] = await to(putArticleApi(fd));
  if (err) return null;
  message.success('修改成功！');
  updateCurrent();
  return null;
};
