import axios from 'axios'
import config from '../config'
import router from '../router'
import storage from './storage'

import { ElMessage } from 'element-plus'

const TOKEN_ERROR = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 创建axios的示例对象
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000,
})

// 请求的拦截
service.interceptors.request.use((req) => {
    // 请求的机制
    const header = req.headers
    const { token } = storage.getItem('userInfo')
    if (!header.Authorization) header.Authorization = 'tom ' + token
    return req
})

// 响应的拦截
service.interceptors.response.use((res) => {
    // 响应的机制
    const { code, data, msg } = res.data
    console.log('响应的拦截:', res.data);
    if (code === 200) {
        return data
    } else if (code === 50001) {
        ElMessage.error(TOKEN_ERROR)
        setTimeout(() => {
            router.push('/login')
        }, 1500)
        return Promise.reject(TOKEN_ERROR)
    } else {
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

// 核心request的函数
function request(options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
    }
    if (typeof options.mock !== 'undefined') {
        config.mock = options.mock
    }
    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi
    } else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
    }
    console.log('options:', options);
    return service(options)
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

export default request