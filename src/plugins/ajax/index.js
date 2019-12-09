/**
 * Created by alex on 2017/5/5.
 */
import axios from 'axios';
import { merge } from 'lodash'
// import CryptoJS from 'crypto-js'

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
});

// axios.interceptors.response.use(response => response, error => Promise.resolve(error.response));
// axios.defaults.withCredentials = true;

const globalOptions = {
  baseURL: process.env.BASE_API,
  timeout: 60000
};

/**
 * 对所有请求添加时间戳
 */
function convertURL(url) {
  // 获取时间戳
  let timstamp = (new Date()).valueOf();
  // 将时间戳信息拼接到url上
  if (url.indexOf('?') >= 0) {
    url = url + '&t=' + timstamp;
  } else {
    url = url + '?t=' + timstamp;
  }
  if (url.indexOf('http:') !== -1 || url.indexOf('https:') !== -1) {
    return url
  }
  return url;
}

function checkStatus(response) {
  if (response && response.status === 200 && response.data.exception_code && response.data.exception_code === 500) {
    window.$message({
      showClose: true,
      message: '请求接口出现异常，请联系管理员！',
      type: 'error'
    });
    return;
  }
  if (!response || response.status === 200 || response.status === 304) {
    return response
  }
  return {
    data: {
      code: -404,
      message: response.statusText,
      data: response.statusText
    }
  }
}

function checkCode(res) {
  if (res && res.data.code === -404) {
    console.error(res.data.message)
  }
  return res
}

function checkTimeout(res) {
  if (res && res.data === 'timeout') {
    let theme = localStorage.getItem('theme')
    localStorage.clear()
    if (theme !== null) {
      localStorage.setItem('theme', theme)
    }
    location.reload('/login');
    return res
  } else {
    return res
  }
}

export default {
  basePath() {
    return globalOptions.baseURL;
  },
  wsPath() {
      return globalOptions.baseURL.replace(/http/, 'ws');
  },
  post(url, data, config) {
    let options = {};
    if (typeof config !== 'undefined') {
      options = merge(globalOptions, config);
    } else {
      options = globalOptions;
    }
    return axios.post(convertURL(url), data, options).then(checkStatus).then(checkCode).then(checkTimeout);
  },
  get(url, params, config) {
    let options = {};
    if (typeof config !== 'undefined') {
      if (params && params.logTemplate) {
        options = merge({}, globalOptions, config)
      } else {
        options = merge({}, globalOptions, { params: params }, config)
      }
    } else {
      if (params && params.logTemplate) {
        options = merge({}, globalOptions);
      } else {
        options = merge({}, globalOptions, { params: params });
      }
    }
    return axios.get(convertURL(url), options).then(checkStatus).then(checkCode).then(checkTimeout);
  },
  delete(url, params, config) {
      let options = {};
      if (typeof config !== 'undefined') {
          if (params && params.logTemplate) {
              options = merge({}, globalOptions, config)
          } else {
              options = merge({}, globalOptions, { params: params }, config)
          }
      } else {
          if (params && params.logTemplate) {
              options = merge({}, globalOptions);
          } else {
              options = merge({}, globalOptions, { params: params });
          }
      }
      return axios.delete(convertURL(url), options).then(checkStatus).then(checkCode).then(checkTimeout);
  }
}
