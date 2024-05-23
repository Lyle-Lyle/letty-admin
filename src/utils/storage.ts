import type { PersistStorage } from 'zustand/middleware'
import localforage from '@/utils/localforage'

export const createStorage = <T = unknown>() => {
  // 自定义 zustand 的存储引擎（存储器）
  const storage: PersistStorage<T> = {
    getItem(name) {
      return localforage.getItem(name)
    },
    setItem(name, value) {
      localforage.setItem(name, value)
    },
    removeItem(name) {
      localforage.removeItem(name)
    }
  }
  return storage
}
