import axios from 'axios'
import { isObject } from 'lodash-es'
import { encrypt, PASSWORD_KEYS } from '@/utils/safe.js'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10s
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么

    // 加密
    if (['put', 'post'].includes(config.method.toLowerCase()) && isObject(config.data)) {
      Object.keys(config.data()).forEach((key) => {
        if (PASSWORD_KEYS.includes(key)) {
          config.data[key] = encrypt(config.data[key])
        }
      })
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 对响应数据做点什么

    // 解密
    if (isObject(res.data)) {
      Object.keys(res.data).forEach((key) => {
        if (PASSWORD_KEYS.includes(key)) {
          res.data[key] = decrypt(res.data[key])
        }
      })
    }
    return res.data
  },
  (error) => Promise.reject(error),
)

export default service
