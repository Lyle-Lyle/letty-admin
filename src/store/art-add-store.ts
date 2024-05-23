import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createStorage } from '@/utils/storage.ts'

export type ArtAddStore = {
  current: ArticleSteps
  article: ArticleAddForm
  // 如果 _hasHydrated 值为 true，证明已经异步的把数据加载到了 zustand 里面，可以去渲染组件了
  // 否则，如果 _hasHydrated 的值为 false，证明数据还在加载中，暂时先不渲染组件
  _hasHydrated: boolean
}

// current 自增的可选值
export enum Move {
  next = 1,
  prev = -1
}

// 发布文章所处的状态
export enum ArticleSteps {
  base = 0,
  cover = 1,
  content = 2,
  done = 3
}

const initState: ArtAddStore = {
  current: ArticleSteps.base,
  article: {} as ArticleAddForm,
  _hasHydrated: false
}

const useArtAddStore = create<ArtAddStore>()(
  immer(
    devtools(
      persist(
        () => {
          // 数据
          return {
            ...initState
          }
        },
        {
          name: 'art-add-store',
          storage: createStorage<ArtAddStore>(),
          onRehydrateStorage() {
            return () => {
              // 注意：只要这个函数被执行了，就证明数据已经异步的读取成功了！
              useArtAddStore.setState((state) => {
                state._hasHydrated = true
              })
            }
          }
        }
      ),
      { name: 'art-add-store' }
    )
  )
)

export default useArtAddStore

// selectors
export const selectCurrent = (state: ArtAddStore) => state.current
export const selectArticleBase = (state: ArtAddStore) => ({ title: state.article.title, cate_id: state.article.cate_id })
export const selectCover = (state: ArtAddStore) => {
  const cover = state.article.cover_img
  if (cover) {
    // 把封面的文件，转为 URL 字符串并 return
    return URL.createObjectURL(cover)
  } else {
    // 没有封面
    return null
  }
}
export const selectHasHydrated = (state: ArtAddStore) => state._hasHydrated
export const selectContent = (state: ArtAddStore) => state.article.content

// actions
export const setCurrent = (step: Move = Move.next) => {
  useArtAddStore.setState((state) => {
    state.current += step
  })
}

// 实时存储文章基本信息的数据
export const setArticleBase = (formData: ArticleAddBaseForm) => {
  useArtAddStore.setState((state) => {
    state.article = { ...state.article, ...formData }
  })
}

// 存储文章的封面
export const setArticleCover = (cover: Blob) => {
  useArtAddStore.setState((state) => {
    state.article.cover_img = cover
  })
}

// 存储文章内容
export const setContent = (content: string) => {
  useArtAddStore.setState((state) => {
    state.article.content = content
  })
}

// 存储文章的状态
export const setArticleState = (artState: '草稿' | '已发布') => {
  useArtAddStore.setState((state) => {
    state.article.state = artState
  })
}

// 清空本地存储的文章信息
export const clearArticle = () => {
  useArtAddStore.setState((state) => {
    state.article = {} as ArticleAddForm
  })
}

// 重置 current 的值
export const resetCurrent = () => {
  useArtAddStore.setState((state) => {
    state.current = ArticleSteps.base
    console.log('current 的新值是：' + state.current)
  })
}
