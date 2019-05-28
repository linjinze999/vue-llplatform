# 网络请求
本章节介绍对底层请求的统一封装。

## 统一请求封装
虽然我们可以直接利用[axios](https://github.com/axios/axios)进行网络请求，但大多情况下我们希望进行请求时能自动对一些错误码进行处理。并且通常我们会和后台有一个约定的数据返回格式，当后台返回一个错误时，我们也希望有一个统一的函数进行处理。

另外为了加快访问速度，有时我们需要对请求进行缓存。以下内容就提供了统一的错误处理和请求缓存，只需将以下内容写入`src/utiles/request.js`即可：
``` js
import axios from 'axios'
import { MessageBox } from 'element-ui'

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
 *            "message": "用户名字重复"     //请求失败描述
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

axios.defaults.baseURL = ''

/* 普通请求 */
export const request = (url, params, config = {}, auto_error_res = true, auto_error_data = true) => {
  const args = Object.assign({
    'method': 'post',
    'url': url,
    'data': params
  }, config)
  return axios(args).then((res) => {
    if (!res.data.success) {
      res.data.error = res.data.error || {}
      console.error(res.data.error)
      if (auto_error_data) {
        const err_msg = res.data.error.message || '未知的服务器错误，请联系管理员！'
        const err_cod = res.data.error.code || -1
        MessageBox.alert(err_msg, '请求失败：' + err_cod, {confirmButtonText: '确定'})
      }
      return Promise.reject(res.data.error)
    }
    return res.data.result
  }, (error) => {
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
```

## 后台接口
在`src/api`目录下统一编写后台访问接口，提供给页面进行调用。

举例：在`src/api/user.js`下统一编写用户相关的接口，如下面的用户登录：
``` js
import {request} from '../utils/request'

export const requestLogin = params => {
  return request('/api/user/login', params)
}
```

## 模拟数据
在开发时我们需要模拟后台返回数据，而不是等后台写完接口。在`src/main.js`中启用模拟数据（见第4、8行）：
``` js {4,8}
import Vue from 'vue'
import App from './App'
import router from './router'
import Mock from './mock/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Mock.mockData()
Vue.config.productionTip = false
Vue.use(ElementUI)
```
在`src/mock/index.js`目录下统一编写mock数据，拦截请求并返回约定格式的模拟数据。正式使用时删除模拟数据即可。如以下就是拦截第2步中的登录请求并返回指定数据：
``` js {5}
import Mock from 'mockjs'

export default {
  mockData () {
    Mock.mock('/api/user/login', {
      'success': true,
      'result': {
        'id': '100001',
        'name': '林锦泽',
        'roles': ['admin']
      }
    })
  }
}
```

## 使用请求
修改`src/components/HelloWorld.vue`为以下内容：
``` js {3,8,14}
<template>
  <div class="hello">
    <el-button @click="login">按钮</el-button>
  </div>
</template>

<script>
import {requestLogin} from '../api/user'

export default {
  name: 'HelloWorld',
  methods: {
    login () {
      requestLogin({'name': 'linjinze999'}).then(data => this.$alert(data))
    }
  }
}
</script>
```
运行`npm run dev`，打开[localhost:8080](localhost:8080)，点击【按钮】即可看到返回数据：↓
<img src="/assets/img/vue-llplatform/request-demo-success.png" height="400" width="400" style="border: 1px solid #000">

你也可以修改返回数据`src/mock/index.js`，返回结果为：`'success': false`↓
<img src="/assets/img/vue-llplatform/request-demo-error-data.png" height="300" width="400" style="border: 1px solid #000">

或者修改`src/api/user.js`，请求无效的url：`/api/user/logout`↓
<img src="/assets/img/vue-llplatform/request-demo-error-res.png" height="300" width="420" style="border: 1px solid #000">
