import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestTransformer,
} from 'axios';
import config from '@/config.json';
import qs from 'qs';
import { message } from 'antd';
import useAppStore from '@/store/app-store';
import { resetAllStore } from '@/store/resetters';

const instance = axios.create({
  // timeout: 1000,
  baseURL: config.baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-api-key': 'ab428ee8-c6ae-4bee-86ca-a5bd3437cff5',
  },
});

instance.interceptors.request.use(
  function (config) {
    // config.transformRequest = () => {
    //   return qs.stringify({ name: 'lyle', age: 22 });
    // };
    const url = config.url;
    const method = config.method?.toUpperCase();
    // 判断是否需要 formData格式的数据
    if (
      (url === '/my/article/add' && method == 'POST') ||
      (url === '/my/article/info' && method === 'PUT')
    ) {
      config.transformRequest = [];
    } else {
      config.transformRequest = requestTransformer;
    }
    // 为 config 挂载请求头的 params 转换器，把 FormData 格式的请求头数据转换为 querystring 格式的查询字符串
    config.paramsSerializer = {
      serialize(params) {
        if (params instanceof FormData) {
          return qs.stringify(Object.fromEntries(params));
        } else {
          return qs.stringify(params);
        }
      },
    };
    // 为请求头按需挂载 token
    const token = useAppStore.getState().token;
    if (url?.includes('/my') && token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response.data) {
      // 有响应体的情况
      return response.data;
    } else {
      // 没有响应体，则自定义一个标准的响应体，并返回
      return { code: 0, message: response.statusText };
    }
  },
  function (error: AxiosError<{ code: number; message: string }>) {
    if (error.response && error.response.data) {
      // 有响应体的情况
      if (error.response.status === 401) {
        if (useAppStore.getState().token) {
          // token 过期了
          message.error('登录过期，请重新登录！');
          // 清空 store
          resetAllStore();
        }
      } else {
        message.error(error.response.data.message);
      }
      return Promise.reject(error.response.data);
    } else {
      // 没有响应体的情况
      console.log(error);
      message.error(error.message);
      return Promise.reject({ code: 1, message: error.message });
    }
  }
);

const requestTransformer: AxiosRequestTransformer = (data) => {
  if (data instanceof FormData) {
    return qs.stringify(Object.fromEntries(data));
  } else {
    return qs.stringify(data);
  }
};

export default instance;
