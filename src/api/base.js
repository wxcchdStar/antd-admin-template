import axios from 'axios';
import UserUtils from '../utils/UserUtils';
import { isDebug } from '../utils/CommonUtils';

// TODO:通过环境变量控制API使用测试环境还是正式环境的接口
const API_BASE_URL = isDebug()
  ? 'http://testapi.xxx.com'
  : 'http://api.xxx.com';

const api = axios.create({
  baseURL: API_BASE_URL
});

//请求拦截器
api.interceptors.request.use(
  function(config) {
    let token = UserUtils.getToken();
    config.headers.Authorization = 'Bearer ' + token;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  res => {
    // 请求出错
    if (res.status < 200 || res.status > 299) {
      return Promise.reject({
        code: res.status
      });
    }
    // 请求成功
    try {
      let response = JSON.parse(res.request.response);
      if (response.code != null) {
        if (response.code === 1000) {
          // 逻辑成功
          return response.data;
        } else if (response.code === 1002 || response.code === 1004) {
          // 登录过期或用户被禁用，需要重定向到登录页
          logout();
        } else if (response.code === 1003) {
          // 无权限
          setTimeout(() => {
            window.location.href = '/403';
          }, 1500);
        }
        return Promise.reject({
          code: response.code,
          message: response.message
        });
      } else {
        return response;
      }
    } catch (e) {
      return res;
    }
  },
  function(err) {
    // 登录鉴权失败
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 403)
    ) {
      logout();
      return Promise.reject({
        code: 99999,
        message: '登录失效，请重新登录'
      });
    }
    return Promise.reject(err);
  }
);

function logout() {
  UserUtils.logout();
  setTimeout(() => {
    window.location.href = '/login';
  }, 1500);
}

export default api;

export function getBaseUrl() {
  return API_BASE_URL;
}

export function getCancelToken() {
  return axios.CancelToken;
}

export function isCancel(err) {
  return axios.isCancel(err);
}

export function getErrorMessage(err) {
  if (err != null && err.code != null) {
    return err.message;
  } else {
    return '网络请求出错，请重试！';
  }
}
