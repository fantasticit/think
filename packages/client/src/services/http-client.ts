import { Toast } from '@douyinfe/semi-ui';
import axios, { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toLogin } from 'data/user';

type WithCookieAxiosRequestConfig = AxiosRequestConfig & { cookie?: string };

interface AxiosInstance extends Axios {
  request<T>(config: WithCookieAxiosRequestConfig): Promise<T>;
}

export const HttpClient = axios.create({
  baseURL: process.env.SERVER_API_URL,
  timeout: process.env.NODE_ENV === 'production' ? 10 * 60 * 1000 : 3000,
  withCredentials: true,
}) as AxiosInstance;

const isBrowser = typeof window !== 'undefined';

HttpClient.interceptors.request.use(
  (config: WithCookieAxiosRequestConfig) => {
    const cookie = config.cookie;
    if (cookie) {
      if (typeof window === 'undefined' && !config.headers.cookie) {
        config.headers.cookie = cookie;
      }
      delete config.cookie;
    }
    return config;
  },
  () => {
    throw new Error('发起请求出错');
  }
);

HttpClient.interceptors.response.use(
  (data) => {
    if (data.status && +data.status === 200 && data.data.status === 'error') {
      isBrowser && Toast.error(data.data.message);
      return null;
    }

    const res = data.data;

    if (!res.success) {
      Toast.error(res.msg);
      return null;
    }
    return res.data;
  },
  (err) => {
    if (err && err.response && err.response.status) {
      const status = err.response.status;

      switch (status) {
        case 504:
        case 404:
          isBrowser && Toast.error((err.response && err.response.data && err.response.data.message) || '服务器异常');
          break;
        case 401:
          if (isBrowser) {
            toLogin();
          }
          break;
        case 429:
          Toast.error('请求过于频繁，请稍候再试！');
          break;
        default:
          isBrowser && Toast.error((err.response && err.response.data && err.response.data.message) || '未知错误!');
      }
      return Promise.reject({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }

    return Promise.reject(err);
  }
);
