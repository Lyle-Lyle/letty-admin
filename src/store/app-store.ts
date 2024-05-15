import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type AppStoreType = typeof initState;

// 初始数据
const initState = {
  token: '',
  collapsed: false,
};

const useAppStore = create<AppStoreType>()(
  immer(
    devtools(
      persist(
        () => {
          // store 中的数据
          return {
            ...initState,
          };
        },
        { name: 'app-store' } // 数据持久化的配置
      ),
      { name: 'app-store' } // 调试工具的配置
    )
  )
);

export default useAppStore;

// 修改store数据的函数
export const setToken = (token: string) => {
  useAppStore.setState((state) => {
    state.token = token;
  });
};
