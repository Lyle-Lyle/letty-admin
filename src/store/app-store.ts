import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import resetters from './resetters';

type AppStoreType = typeof initState;

// 初始数据
const initState = {
  token: '',
  // 侧边栏折叠
  collapsed: false,
};

const useAppStore = create<AppStoreType>()(
  immer(
    devtools(
      persist(
        (set) => {
          // 重置当前 store 数据
          resetters.push(() => set(initState));

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

// 修改侧边栏折叠的函数
export const setCollapsed = (collapsed: boolean) => {
  useAppStore.setState((state) => {
    state.collapsed = collapsed;
  });
};

// ---------- 选取派生数据的 selector ----------
export const selectCollapsed = (state: AppStoreType) => state.collapsed;

export const selectToken = (state: AppStoreType) => state.token;
