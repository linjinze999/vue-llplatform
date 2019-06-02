# 权限控制
本章节介绍如何实现前端的权限控制。
::: tip 提示
真正的权限应该由后端来控制，前端权限控制是为了更好的展示，让交互变的友好。
:::

## 权限说明
### 权限策略
前端权限策略大体分为两种：
1. 前端记录页面和权限表，后台返回用户角色，前端根据角色分配权限；
2. 前端记录页面表，后台记录权限表，用户登录时后台返回用户权限，前端根据权限表显示页面。

两种方案各有优缺点：

第一种方案：前端可以自己维护权限，不用依赖后端（想想前后端不分离时被后端支配的恐惧吧）。但是采用这种方式，每次角色的权限变更可能都需要更新代码。因此在**权限变更较不频繁**的时候可以采用这种方式。

第二种方案：可以较为方便的增删改权限。缺点权限表依赖后台，并且需要开发一个[权限配置页面](/vue-llplatform/functions.html#权限配置)。在**权限变更比较频率**的时候较为适用。

**本项目采用第二种方案**。对第一种方案有兴趣的人可以参考[此文章](https://juejin.im/post/591aa14f570c35006961acac)。

### 权限层级
权限层级大体分为**接口级权限**、**页面级权限**、**数据级权限**。

其中接口级的权限（真正能实现安全的权限控制）由后端来控制，前端只需能显示后台返回的结果即可。

页面级和数据级的权限决定了前端的显示。前端可以通过路由表来实现页面级的权限控制，数据级的权限控制（如某按钮权限）可以通过代码判断（如：`v-if`）来实现。

## 接口权限控制
如上文所说，**接口级的权限**是真正能实现安全的权限控制，由后端来控制。

现在用的比较多的是[jwt ](https://www.jianshu.com/p/576dbf44b2ae)，即登录时后台返回一个token，以后前端每次调用接口都带上此token，服务器获得请求后比较token从而进行权限控制。

我们可以修改一下底层的网络请求封装`src/utils/request.js`，拦截`axios`请求，在`header`中加入`token`。
若后台校验token失效，则可以约定返回**指定的错误结果**，如`{type: 'login', url: '/#/login'}`，那么我们需要对响应进行处理（转向登录页面）：
``` js {4,,45-48,68-72}
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

```
此处使用`localStorage`存储token（使用`localStorage`下次登录仍可使用此token，达到下次自动登录的效果；你也可以使用`sessionStorage`，但下次需要重新登录），因此登录时需要存储一下token，假设约定后台返回格式如下：
``` js
{
  code: 1,
  token: 'xxxxxxxxxxxxxxxx'
}
```
修改`src/api/user.js`：
``` js {4-7}
import { request } from '../utils/request'

export const requestLogin = params => {
  return request('/api/user/login', params).then(data => {
    localStorage.setItem('user-token', JSON.stringify(data.token))
    return data
  })
}

export const requestRegister = params => {
  return request('/api/user/register', params)
}

```

## 页面权限控制
上文提到本项目采用**后台记录权限表**的策略，思路大体为：登录成功后，前端继续请求获取权限表并存储
（考虑到现在后端常常使用微服务，因此把token的获取和权限表的获取拆开，而不是登录后一起返回）。

当用户要访问某页面时，判断一下该页面是否在权限表中，若不在，则跳转至403（用户无权限）页面。

**备注**：记录权限表时，还要将数据级的权限数据放置到路由表中，以便页面能够根据此权限数据进行渲染。
此处会利用到Vue Router的[路由元信息](https://router.vuejs.org/zh/guide/advanced/meta.html)。

### 实现
1. 约定后台返回权限表格式，修改`src/mock/index.js`如下：
``` js {10,20-35}
import Mock from 'mockjs'

export default {
  mockData () {
    const BASE_PATH = process.env.BASE_URL.endsWith('/')
      ? process.env.BASE_URL.substr(0, process.env.BASE_URL.length - 1)
      : process.env.BASE_URL
    Mock.mock(BASE_PATH + '/api/user/login', {
      'code': 1,
      'token': 'fdsjfhjkdshfkldsajfjasdfbjsdkfhsdajfj',
      'result': {
        'id': '100001',
        'name': '林锦泽',
        'roles': ['admin']
      }
    })
    Mock.mock(BASE_PATH + '/api/user/register', {
      'code': 1
    })
    Mock.mock('/api/user/info', {
      'code': 1,
      'id': '100001',
      'name': '林锦泽',
      'roles': ['admin'],
      'permissions': [
        {
          // 一个页面权限一个对象，name为静态路由表里面的name
          name: '/index'
        }, {
          name: '/user/show',
          // permission存储数据级权限控制
          permission: ['modify', 'delete']
        }
      ]
    })
  }
}

```

2. 编写导航钩子，载入权限表（从vuex获取，若没有则发起请求获取），判断页面权限，并将数据级权限数据保存至router.meta。修改`src/router/index.js`
``` js {2,4,13-65}
import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
import whiteList from './whiteList'
import staticRouter from './staticRouter'

Vue.use(Router)

const router = new Router({
  base: process.env.BASE_URL,
  routes: staticRouter
})

/* 利用router.meta保存数据级权限 */
const routerInit = (permissions) => {
  permissions.forEach(function (v) {
    let routeItem = router.match(v.name)
    if (routeItem) {
      routeItem.meta.permission = v.permission ? v.permission : []
    }
  })
}

/* 检测用户是否有权限访问页面 */
const pagePermission = (permissions, to, next) => {
  const allowPage = permissions.some(function (v) {
    return v.name === to.name
  })
  allowPage ? next() : next({ path: '/error/403' })
}

/* 权限控制 */
router.beforeEach((to, from, next) => {
  /* 取消旧请求 */
  const CancelToken = axios.CancelToken
  router.app.$options.store.state.source.cancel && router.app.$options.store.state.source.cancel()
  router.app.$options.store.commit('updateSource', { source: CancelToken.source() })
  /* 进入登录页面将注销用户信息 */
  if (to.path === '/login') {
    router.app.$options.store.commit('deleteUser')
    localStorage.removeItem('user-token')
  }
  /* 免登录页面 */
  if (whiteList.indexOf(to.fullPath) >= 0) {
    return next()
  }
  let permissions = router.app.$options.store.state.user.permissions
  /* 上次会话结束，重新获取用户信息 */
  if (!permissions.length) {
    /* 获取用户信息和权限 */
    router.app.$options.store.dispatch('requestUserInfo').then(() => {
      permissions = router.app.$options.store.state.user.permissions || []
      routerInit(permissions)
      pagePermission(permissions, to, next)
    }).catch((err) => {
      /* 获取用户信息异常 */
      console.error(err)
      return next({ path: '/error/500' })
    })
  } else {
    /* 已登录时判断页面权限 */
    pagePermission(permissions, to, next)
  }
})

export default router

```

以上代码引入一个白名单机制，即指定页面不需要权限即可访问，创建以上代码引用的`src/router/whiteList.js`文件：
``` js
/* 免登录白名单页面 */
const whiteList = [
  '/error/403',
  '/error/404',
  '/error/500',
  '/login',
  '/register'
]

export default whiteList

```

3. 修改`src/store/index.js`，添加 user 用于存储用户信息
```javascript {3,9-13,20-29,35-39}
import Vue from 'vue'
import Vuex from 'vuex'
import { requestUserInfo } from '@/api/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: '',
      permissions: [],
      accessMenu: []
    },
    source: {
      token: null,
      cancel: null
    }
  },
  mutations: {
    setUser (state, { user }) {
      state.user.name = user.name
      state.user.permissions = user.permissions
      state.user.accessMenu = user.accessMenu
    },
    deleteUser (state) {
      state.user.name = ''
      state.user.permissions = []
      state.user.accessMenu = []
    },
    updateSource (state, { source }) {
      state.source = source
    }
  },
  actions: {
    requestUserInfo ({ commit }) {
      return requestUserInfo().then(user => {
        commit('setUser', { user })
      })
    }
  }
})

```

4. 另外需要修改接口函数，分离**登录**与**获取用户信息**接口。修改`src/api/user.js`：
``` js {14-16}
import { request } from '../utils/request'

export const requestLogin = params => {
  return request('/api/user/login', params).then(data => {
    localStorage.setItem('user-token', JSON.stringify(data.token))
    return data
  })
}

export const requestRegister = params => {
  return request('/api/user/register', params)
}

export const requestUserInfo = params => {
  return request('/api/user/info', params)
}

```

::: tip 提示
以上方法限制了用户访问的URL。但页面权限还会涉及菜单的显示，可以通过读取用户的权限列表，对比所有菜单，过滤出用户拥有权限的页面。
后续讲述菜单栏时会进行说明。
:::

## 数据权限控制
我们已在上一小节里将用户的数据级权限数据存入了`$route.meta.permission`，因此只要在页面渲染时使用`v-if`判断是否显示即可。比如：
``` html
<div v-if="$route.meta.permission.includes('delete')">删除</div>
```

## 错误页面
当用户输入未知的URL时，我们希望系统能跳转至指定的404页面。另外基于我们的权限控制设置，用户在没有权限访问页面时也需要跳转至指定页面。创建以下3个错误页面：
1. 403用户无权限页面：`src/views/error/AppError403.vue`
``` vue
<template>
  <div>403用户无权限</div>
</template>

<script>
export default {
  name: 'AppError403'
}
</script>

<style scoped>

</style>

```

2. 404找不到资源页面：`src/views/error/AppError404.vue`
``` vue
<template>
  <div>404找不到资源</div>
</template>

<script>
export default {
  name: 'AppError404'
}
</script>

<style scoped lang="scss">

</style>

```

3. 500服务器错误：`src/views/error/AppError500.vue`
``` vue
<template>
  <div>500服务器错误</div>
</template>

<script>
export default {
  name: 'AppError500'
}
</script>

<style scoped lang="scss">

</style>

```

修改路由配置`src/router/staticRouter.js`：
``` js {18-30}
/* 静态页面路由 */
const staticRouter = [
  {
    path: '/',
    redirect: '/index'
  }, {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login/AppLogin')
  }, {
    path: '/register',
    name: '注册',
    component: () => import('@/views/login/AppRegister')
  }, {
    path: '/index',
    name: '首页',
    component: () => import('@/components/HelloWorld')
  }, {
    path: '/error/403',
    name: '错误403',
    component: () => import('@/views/error/AppError403')
  }, {
    path: '/error/500',
    name: '错误500',
    component: () => import('@/views/error/AppError500')
  }, {
    path: '*',
    name: '错误404',
    component: () => import('@/views/error/AppError404')
  }
]

export default staticRouter

```

## 流程示意图
页面权限流程控制大体如下：

<img :src="$withBase('/assets/img/vue-llplatform/permission-process.png')" style="border: 1px solid #000"/>
