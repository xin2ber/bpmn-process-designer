/**
 * ajax请求配置
 */
import axios from 'axios'
import { Message } from 'element-ui'

// axios默认配置
axios.defaults.timeout = 10000 // 超时时间
axios.defaults.baseURL = ''

// 整理数据
axios.defaults.transformRequest = function(data) {
  data = JSON.stringify(data)
  return data
}

// 路由请求拦截
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      const csrfElements = document.getElementsByName('_csrf')
      const csrfHeaderElements = document.getElementsByName('_csrf_header')
      if (csrfElements && csrfElements.length > 0 && csrfHeaderElements && csrfHeaderElements.length > 0) {
        const token = csrfElements[0].getAttribute('content')
        const header = csrfHeaderElements[0].getAttribute('content')
        if (token && header) {
          config.headers[header] = token
        }
      }
    }
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    return config
  },
  error => {
    return Promise.reject(error.response)
  }
)

// 路由响应拦截
axios.interceptors.response.use(
  response => {
    if (response.data.code === -1) {
      Message.error(response.data.msg)
      return false
    } else {
      return response.data
    }
  },
  error => {
    return Promise.reject(error.response) // 返回接口返回的错误信息
  }
)

export default axios
