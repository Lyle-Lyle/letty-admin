import axios from 'axios'
import type { AxiosRequestTransformer, AxiosError } from 'axios'
import config from '@/config.json'
import qs from 'qs'
import { message } from 'antd'
import useAppStore from '@/store/app-store'
import { resetAllStore } from '@/store/resetters.ts'

const instance = axios.create({
  baseURL: config.baseURL,
  // timeout: 1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-api-key': 'ab428ee8-c6ae-4bee-86ca-a5bd3437cff5'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    const url = config.url
    const method = config.method?.toUpperCase()

    // 为 config 挂载请求体转换器
    if ((url === '/my/article/add' && method === 'POST') || (url === '/my/article/info' && method === 'PUT')) {
      config.transformRequest = []
    } else {
      config.transformRequest = requestTransformer
    }

    // 为 config 挂载请求头的 params 转换器，把 FormData 格式的请求头数据转换为 querystring 格式的查询字符串
    config.paramsSerializer = {
      serialize(params) {
        if (params instanceof FormData) {
          return qs.stringify(Object.fromEntries(params))
        } else {
          return qs.stringify(params)
        }
      }
    }

    // 为请求头按需挂载 token
    const token = useAppStore.getState().token
    if (url?.includes('/my') && token) {
      config.headers.Authorization = token
    }

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data) {
      // 有响应体的情况
      return response.data
    } else {
      // 没有响应体，则自定义一个标准的响应体，并返回
      return { code: 0, message: response.statusText }
    }
  },
  function (error: AxiosError<{ code: number; message: string }>) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // 判断 error 对象中是否包含 response 响应对象
    // 如果包含，则以包含的 message 进行弹窗提示
    // 否则，需要自定义提示的消息
    if (error.response && error.response.data) {
      // 有响应体的情况
      if (error.response.status === 401) {
        if (useAppStore.getState().token) {
          // token 过期了
          message.error('登录过期，请重新登录！')
          // 清空 store
          resetAllStore()
        }
      } else {
        message.error(error.response.data.message)
      }

      return Promise.reject(error.response.data)
    } else {
      // 没有响应体的情况
      let msg = ''
      switch (error.code) {
        case 'ERR_NETWORK':
          msg = '您的网络似乎断开了...'
          break
        case 'ECONNABORTED':
          msg = '请求超时...'
          break
        default:
          msg = error.message
      }
      message.error(msg)
      return Promise.reject({ code: 1, message: error.message })
    }
  }
)

// 请求体转换器的函数
const requestTransformer: AxiosRequestTransformer = (data) => {
  if (data instanceof FormData) {
    return qs.stringify(Object.fromEntries(data))
  } else {
    return qs.stringify(data)
  }
}

export default instance
