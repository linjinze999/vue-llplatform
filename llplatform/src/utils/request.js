import axios from 'axios'
import qs from 'qs'
import store from '../store/index'
import { MessageBox, Message } from 'element-ui'

/*
 * 一、request：
 *    1. 说明：封装对后台的请求，可以选择自动处理一些异常。
 *    2. 参数：
 *        - url：          后台地址，必填，String，如："/user/add"
 *        - params：       请求参数，选填，Object，，默认值：{}
 *        - config：       axios参数，选填，Object，默认值：{}
 *        - autoErrorRes： 是否自动处理响应错误，选填，Boolean，默认值：true
 *        - autoErrorData：是否自动处理后台错误，选填，Boolean，默认值：true
 *        - autoCancel：   离开路由时是否自动取消请求，选填，Boolean，默认值：true
 *    3. 返回：
 *        - 成功：Promise.resolve(请求成功后的结果：response.data)
 *        - 失败：
 *            - 请求异常：Promise.reject(http响应错误)
 *            - 请求失败：Promise.reject(请求失败后的结果：response.data)
 *    4. 约定后台返回数据格式：
 *        response.data = {
 *          "code": 1,                    // 成功/失败标识，1=成功，-1=失败
 *          "data": {},                   // 成功时可选参数，请求的响应数据
 *          "errorMessage": "用户名字重复"  // 失败时必需参数，错误提示
 *        }
 *
 * 二、sessionRequest：
 *    1. 说明：利用sessionStorage缓存请求，可以选择outTime，其他同request。
 *    2. 参数：
 *        - outTime：距离上次请求多少秒后需要重新请求，选填，Integer，小于0表示不重新请求，默认值：-1
 *
 * 三、localRequest：
 *    1. 说明：利用localStorage缓存请求，可以选择outTime，其他同request。
 *    2. 参数：
 *        - outTime：距离上次请求多少秒后需要重新请求，选填，Integer，小于0表示不重新请求，默认值：604800（一周）
 *
 **/

const axiosCustom = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true
})

axiosCustom.interceptors.request.use(function (config) {
  config.headers.token = localStorage.getItem('user-token')
  return config
})

/* 普通请求 */
export const request = (url, params = {}, config = {}, autoErrorRes = true, autoErrorData = true, autoCancel = true) => {
  if (autoCancel) {
    config = Object.assign({ cancelToken: store.state.source.token }, config)
  }
  const args = Object.assign({
    'method': 'post',
    'url': url,
    'data': params
  }, config)
  // 处理url传参
  if (!['put', 'post', 'patch'].includes(args.method.toLowerCase())) {
    args['params'] = args['params'] || args['data']
    args['paramsSerializer'] = args['paramsSerializer'] || function (params) {
      return qs.stringify(params, { arrayFormat: 'indices' })
    }
  }
  return axiosCustom(args).then((res) => {
    // 未登录
    if (res.data.type === 'login') {
      Message({ message: '登录失效，请重新登录', type: 'error' })
      window.location.href = res.data.url || '/#/login'
    }
    // 自动处理返回格式错误
    if (autoErrorData && res.data.hasOwnProperty('code') && res.data.code !== 1) {
      console.error(res.data)
      const errMsg = res.data.errorMessage || '未知的服务器错误，请联系管理员！'
      const errCod = res.data.code
      MessageBox.alert(errMsg, '请求异常：' + errCod, { confirmButtonText: '确定' })
      return Promise.reject(res.data)
    }
    return res.data
  }, (error) => {
    // 自动处理网络请求错误
    console.error(error)
    error.response = error.response || {}
    const errStatus = error.response.status || -100
    if (autoErrorRes && error.message) {
      MessageBox.alert('网络请求异常，请联系管理员！', '请求异常：' + errStatus, { confirmButtonText: '确定' })
    }
    return Promise.reject(error)
  })
}

/* 使用sessionStorage缓存的请求 */
export const sessionRequest = (url, params = {}, config = {}, outTime = -1, autoErrorRes = true, autoErrorData = true, autoCancel = true) => {
  const itemKey = url + '#' + JSON.stringify(params) + JSON.stringify(config)
  let itemVal = sessionStorage.getItem(itemKey)
  const nowTime = new Date().getTime()
  if (itemVal) {
    itemVal = JSON.parse(itemVal)
    const overTime = nowTime - itemVal.lastTime
    if (outTime < 0 || overTime < outTime * 1000) {
      return Promise.resolve(itemVal.data)
    }
  }
  return request(url, params, config, autoErrorRes, autoErrorData, autoCancel).then(data => {
    sessionStorage.setItem(itemKey, JSON.stringify({
      'lastTime': nowTime,
      'data': data
    }))
    return data
  })
}

/* 使用localStorage缓存的请求 */
export const localRequest = (url, params = {}, config = {}, outTime = 604800, autoErrorRes = true, autoErrorData = true, autoCancel = true) => {
  const itemKey = url + '#' + JSON.stringify(params) + JSON.stringify(config)
  let itemVal = localStorage.getItem(itemKey)
  const nowTime = new Date().getTime()
  if (itemVal) {
    itemVal = JSON.parse(itemVal)
    const overTime = nowTime - itemVal.lastTime
    if (outTime < 0 || overTime < outTime * 1000) {
      return Promise.resolve(itemVal.data)
    }
  }
  return request(url, params, config, autoErrorRes, autoErrorData, autoCancel).then(data => {
    localStorage.setItem(itemKey, JSON.stringify({
      'lastTime': nowTime,
      'data': data
    }))
    return data
  })
}
