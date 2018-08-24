import axios from 'axios'
import {MessageBox, Message} from 'element-ui'

/*
 * 一、request：
 *    1. 说明：封装对后台的请求，可以选择自动处理一些异常。
 *    2. 参数：
 *        - url：            后台地址，必填，String，如："/user/add"
 *        - params：         请求参数，必填，Object，如：{"name":"xxx"}
 *        - config：         axios参数，选填，Object，默认值：{}
 *        - auto_error_res： 是否自动处理响应错误，选填，Boolean，默认值：true
 *        - auto_error_data：是否自动处理后台错误，选填，Boolean，默认值：true
 *    3. 返回：
 *        - 成功：Promise.resolve(请求成功后的结果：response.data.result)
 *        - 失败：
 *            - 请求异常：Promise.reject(http响应错误)
 *            - 请求失败：Promise.reject(请求失败后的结果：response.data.error)
 *    4. 约定后台返回数据格式：
 *        response.data = {
 *          "success": true/false,         //请求成功或失败
 *          "result": {},                  //请求成功后的结果
 *          "error":{
 *            "code": 100001,              //请求失败错误码
 *            "message": "用户名字重复"    //请求失败描述
 *          }
 *        }
 *
 * 二、sessionRequest：
 *    1. 说明：利用sessionStorage缓存请求，可以选择out_time，其他同request。
 *    2. 参数：
 *        - out_time：距离上次请求多少秒后需要重新请求，选填，Integer，小于0表示不重新请求，默认值：-1
 *
 * 三、localRequest：
 *    1. 说明：利用localStorage缓存请求，可以选择out_time，其他同request。
 *    2. 参数：
 *        - out_time：距离上次请求多少秒后需要重新请求，选填，Integer，小于0表示不重新请求，默认值：604800（一周）
 *
 **/

/* 为每个请求设置默认baseURL，并添加token */
axios.defaults.baseURL = ''
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = localStorage.getItem('user-token')
  return config
})

/* 普通请求 */
export const request = (url, params, config = {}, auto_error_res = true, auto_error_data = true) => {
  const args = Object.assign({
    'method': 'post',
    'url': url,
    'data': params
  }, config)
  return axios(args).then((res) => {
    /* 后台返回指定错误 */
    if (!res.data.success) {
      res.data.error = res.data.error || {}
      console.error(res.data.error)
      /* token失效 */
      if (res.data.error.code === 100000) {
        Message({
          message: '登录失效，请重新登录',
          type: 'error'
        })
        window.location.href = '/#/login'
        return Promise.reject(res.data.error)
      }
      /* 其他错误 */
      if (auto_error_data) {
        const err_msg = res.data.error.message || '未知的服务器错误，请联系管理员！'
        const err_cod = res.data.error.code || -1
        MessageBox.alert(err_msg, '请求失败：' + err_cod, {confirmButtonText: '确定'})
      }
      return Promise.reject(res.data.error)
    }
    return res.data.result
  }, (error) => {
    /* 网络请求异常 */
    console.error(error)
    if (auto_error_res) {
      const err_status = error.response.status || -100
      MessageBox.alert('网络请求异常，请联系管理员！', '请求异常：' + err_status, {confirmButtonText: '确定'})
    }
    return Promise.reject(error)
  })
}

/* 使用sessionStorage缓存的请求 */
export const sessionRequest = (url, params, out_time = -1, config = {}, auto_error_res = true, auto_error_data = true) => {
  const item_key = url + '#' + JSON.stringify(params)
  let item_val = sessionStorage.getItem(item_key)
  const now_time = new Date().getTime()
  if (item_val) {
    item_val = JSON.parse(item_val)
    const over_time = now_time - item_val.last_time
    if (out_time < 0 || over_time < out_time * 1000) {
      return Promise.resolve(item_val.data)
    }
  }
  return request(url, params, config, auto_error_res, auto_error_data).then(data => {
    sessionStorage.setItem(item_key, JSON.stringify({
      'last_time': now_time,
      'data': data
    }))
    return data
  })
}

/* 使用localStorage缓存的请求 */
export const localRequest = (url, params, out_time = 604800, config = {}, auto_error_res = true, auto_error_data = true) => {
  const item_key = url + '#' + JSON.stringify(params)
  let item_val = localStorage.getItem(item_key)
  const now_time = new Date().getTime()
  if (item_val) {
    item_val = JSON.parse(item_val)
    const over_time = now_time - item_val.last_time
    if (out_time < 0 || over_time < out_time * 1000) {
      return Promise.resolve(item_val.data)
    }
  }
  return request(url, params, config, auto_error_res, auto_error_data).then(data => {
    localStorage.setItem(item_key, JSON.stringify({
      'last_time': now_time,
      'data': data
    }))
    return data
  })
}
