import { create } from 'zustand';
import { ArticleSteps, Move } from './art-add-store';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStorage } from '@/utils/storage.ts';

import { getArticleApi } from '@/api/article-api';
import to from 'await-to-js';
import { config } from 'localforage';

type EditStore = {
  article: ArticleEditForm;
  current: ArticleSteps;
};

const initialState = {
  current: ArticleSteps.base,
  article: {} as ArticleEditForm,
};

const useArticleEditStore = create<EditStore>()(
  immer(
    devtools(
      persist(
        () => {
          // 这里 return 的对象，就是 store 中全局存储的数据
          return {
            ...initialState,
          };
        },
        {
          name: 'art-edit-store',
          // 自定义存储引擎
          storage: createStorage(),
          // 自定义要在本地持久化存储哪些数据
          partialize(state) {
            return { article: state.article };
          },
        }
      ),
      { name: 'art-edit-store' }
    )
  )
);

// actions
// 请求文章的初始数据，并存储到 Store
export const initArticle = async (id: string) => {
  // 1. 调用接口，获取文章详情
  // 2. 把文章详情的数据，存储到 Store
  const [err, res] = await to(getArticleApi(id));
  if (err) return null;
  useArticleEditStore.setState((state) => {
    if (res.data) {
      state.article = res.data;
    }
  });
};
// 把当前激活的 steps 步骤条的索引派生出去，给组件使用
export const selectCurrent = (state: EditStore) => state.current;

export const selectBase = (state: EditStore) => ({
  title: state.article.title, // 标题
  cate_id: state.article.cate_id, // 分类 id
});

export const updateBase = (values: ArticleEditBaseForm) => {
  useArticleEditStore.setState((state) => {
    state.article = { ...state.article, ...values };
  });
};

export const updateCurrent = (step: Move = Move.next) => {
  useArticleEditStore.setState((state) => {
    state.current += step;
  });
};
export const resetCurrent = () => {
  useArticleEditStore.setState((state) => {
    state.current = ArticleSteps.base;
  });
};

// 存储文章的封面
export const setArticleCover = (cover: Blob) => {
  useArticleEditStore.setState((state) => {
    state.article.cover_img = cover;
  });
};

// 派生文章的封面
export const selectCover = (state: EditStore) => {
  const cover = state.article.cover_img;
  if (cover) {
    // 把封面的文件，转为 URL 字符串并 return
    if (typeof cover === 'string') {
      return config.baseURL + cover;
    }
    return URL.createObjectURL(cover);
  } else {
    // 没有封面
    return null;
  }
};

// 存储文章内容
export const setContent = (content: string) => {
  useArticleEditStore.setState((state) => {
    state.article.content = content;
  });
};
// 存储文章的状态
export const setArticleState = (artState: '草稿' | '已发布') => {
  useArticleEditStore.setState((state) => {
    state.article.state = artState;
  });
};
// 派生文章的内容给组件使用
export const selectContent = (state: EditStore) => state.article.content;

export const selectIsShowDraft = (state: EditStore) =>
  state.article.state === '草稿';

export default useArticleEditStore;
