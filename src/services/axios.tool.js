import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import qs from 'qs'
import store from '../store'

// 设置默认请求头
// axios.defaults.headers = {
//   'X-Requested-With': 'XMLHttpRequest',
//   'Content-Type': 'application/x-www-form-urlencoded',
// }
axios.defaults.baseURL = store.state.domain
// axios.defaults.baseURL = location.href.indexOf('test') !== -1 ? 'http://test.report.pxjy.com' : 'http://report.staff.pxjy.com'

// 请求超时的时间限制
axios.defaults.timeout = 120000

// 开始设置请求 发起的拦截处理
// config 代表发起请求的参数的实体
/* let requestName: any
const CancelToken = axios.CancelToken // 取消请求
axios.interceptors.request.use((config: any) => {
  // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
  // 如果没有 requestName 就默认添加一个 不同的时间戳
  if (config.method === 'post') {
    if (config.data && qs.parse(config.data).requestName) {
      requestName = qs.parse(config.data).requestName
    } else {
      requestName = new Date().getTime()
    }
  } else {
    if (config.params && config.params.requestName) {
      requestName = config.params.requestName
    } else {
      requestName = new Date().getTime()
    }
  }
  // 判断，如果这里拿到的参数中的 requestName 在上一次请求中已经存在，就取消上一次的请求
  if (requestName) {
    if (axios[requestName] && axios[requestName].cancel) {
      axios[requestName].cancel('取消了请求')
    }
    config.cancelToken = new CancelToken( (c: any) => {
      axios[requestName] = {}
      axios[requestName].cancel = c
    })
  }
  return config
}, (error: any) => {
  return Promise.reject(error)
}) */

// 请求到结果的拦截处理
axios.interceptors.response.use((config) => {
  // 返回请求正确的结果
  if (config.data.code === -1) {
    router.push({ path: '/login' }) // 进入登陆页面
  }
  return config.data
}, (error) => {
  return Promise.reject(error)
  // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
})
// 将axios的post方法，绑定到vue实例上面的$post
Vue.prototype.$post = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params)).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}
// 将axios的get方法，绑定到vue实例上面的$get
Vue.prototype.$get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}
