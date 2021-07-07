import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 实例化Axios对象
const service = axios.create({
  // 获取`.env`中定义的BaseUrl，实际发送请求的URL=baseUrl+api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // request timeout
})

/**
 * 全局request拦截器
 * 作用：当发送请求时，首先要经过此拦截器
 *    判断当前Token是否失效，没失效就每次都添加到request header上，保证每次request，请求头都携带Token
 */
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // 在请求头中设置Token key 和 value
      // 对于后端Spring Security框架，默认Key是`Authorization`
      config.headers['Authorization'] = 'Bearer ' + getToken()
      // config.headers['Authorization'] = 'Basic Y2xpZW50OnNlY3JldA=='
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

/**
 * 全局response拦截器
 * 作用：当request结束后，后端response首先经过此拦截器
 *    全局封装请求响应数据
 *    全局判断请求是否成功（1.请求失败走error方法；2.请求成功但后端发生错误走success方法）
 *    根据请求是否成功全局展示message。请求成功则继续判断code，不同状态的code再进行相应逻辑处理
 */
service.interceptors.response.use(
  response => {
    /**
     * 这里注意明确axios响应结果格式：
     * {
     *   "xx": "xx",
     *   "data": 后端真正返回的JSON格式响应结果,
     *   "xx": "xx"
     * }
     * 因此`res`要先从`response.data`中拿到后端真正响应的JSON数据
     */
    const res = response.data

    /**
     * 因为使用了Security-oAuth2，需要单独处理OAuth2的请求响应
     * oAuth获取token的响应格式为：
     * {
     *    "access_token": "zQcz-j4uj2ZNOUJJDxPc9Erfch8",
     *    "token_type": "bearer",
     *    "expires_in": 43199,
     *    "scope": "app"
     * }
     */
    if (res.code === undefined && res.access_token != null) {
      return res
    }

    /**
     * 本项目中后端响应结果格式为：
     *   {
     *     "code": "200",
     *     "data": {},
     *     "msg": "success"
     *   }
     * 这里是对请求成功时，后端响应code判断。当前设定`code=200`为正常，其他状态码再做相应判断
     * 发送错误时全局展示message错误信息（此时后端message字段为`msg`）
     * =====
     * 以上开发者请根据后端响应格式进行相应修改
     */
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 对于一些特殊的`code`状态码做具体处理
      if (res.code === 403) {
        // to re-login
        MessageBox.confirm('当前登录状态已失效，是否重新登录？', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const err = error.response
    console.log(error)
    if (err.status === 426) {
      Message({
        message: '用户名或密码错误',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: err.data.msg || '服务连接异常，请稍后再试~',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
