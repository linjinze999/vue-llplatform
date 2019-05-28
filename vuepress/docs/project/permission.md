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

我们可以修改一下底层的网络请求封装`src/utils/request.js`，拦截`axios`请求，在`header`中加入`token`。若后台校验token失效，则可以约定返回**指定的错误码**，如`{success: false, error: {code: 100000}}`，那么我们需要对响应进行处理（转向登录页面）：
``` js {2,,42-45,59-67}
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

```
此处使用`localStorage`存储token（使用`localStorage`下次登录仍可使用此token，达到下次自动登录的效果；你也可以使用`sessionStorage`，但下次需要重新登录），因此登录时需要存储一下token，假设约定后台返回格式如下：
``` js
{
  success: true,
  result: {token: 'xxxxxxxxxxxxxxxx'}
}
```
修改`src/api/user.js`：
``` js {4-7}
import {request} from '../utils/request'

export const requestLogin = params => {
  return request('/api/user/login', params).then(data => {
    localStorage.setItem('user-token', JSON.stringify(data.token))
    return data
  })
}
```

## 页面权限控制
上文提到本项目采用**后台记录权限表**的策略，思路大体为：登录成功后，前端继续请求获取权限表并存储（考虑到现在后端常常使用微服务，因此把token的获取和权限表的获取拆开，而不是登录后一起返回）。

当用户要访问某页面时，判断一下该页面是否在权限表中，若不在，则跳转至401（用户无权限）页面。

**备注**：记录权限表时，还要将数据级的权限数据放置到路由表中，以便页面能够根据此权限数据进行渲染。此处会利用到Vue Router的[路由元信息](https://router.vuejs.org/zh/guide/advanced/meta.html)。

### 实现
约定后台返回权限表格式，修改`src/mock/index.js`如下：
``` js {8,21-30}
import Mock from 'mockjs'

export default {
  mockData () {
    Mock.mock('/api/user/login', {
      'success': true,
      'result': {
        'token': 'fdsjfhjkdshfkldsajfjasdfbjsdkfhsdajfj'
      }
    })
    Mock.mock('/api/user/register', {
      'success': true,
      'result': {}
    })
    Mock.mock('/api/user/info', {
      'success': true,
      'result': {
        'id': '100001',
        'name': '林锦泽',
        'roles': ['admin'],
        'permissions': [
          {
            // 一个路径一个对象，路径名为完整路径名
            path: '/index'
          }, {
            path: '/user/show',
            // permission存储数据级权限控制
            permission: ['modify', 'delete']
          }
        ]
      },
      'error': {
        'code': 100000,
        'message': '无效的token'
      }
    })
  }
}
```

编写导航钩子，载入权限表（从sessionStorage获取，若没有则发起请求获取），判断页面权限，并将数据级权限数据保存至router.meta。修改`src/router/index.js`
``` js {3,5,13-65}
import Vue from 'vue'
import Router from 'vue-router'
import whiteList from './whiteList'
import staticRouter from './staticRouter'
import {requestUserInfo} from '@/api/user'

Vue.use(Router)

const router = new Router({
  routes: staticRouter
})

/* 利用router.meta保存数据级权限 */
const router_init = (permissions) => {
  permissions.forEach(function (v) {
    let routeItem = router.match(v.path)
    if (routeItem) {
      routeItem.meta.permission = v.permission ? v.permission : []
    }
  })
}

/* 检测用户是否有权限访问页面 */
const page_permission = (permissions, to_path, next) => {
  let allow_page = false
  permissions.forEach(function (v) {
    if (v.path === to_path) {
      allow_page = true
    }
  })
  allow_page ? next() : next({path: '/error/401'})
}

/* 权限控制 */
router.beforeEach((to, from, next) => {
  /* 忽略错误页面的权限判断 */
  if (to.meta.errorPage) {
    return next()
  }
  /* 进入登录页面将注销用户信息 */
  if (to.path === '/login') {
    sessionStorage.removeItem('user-info')
    localStorage.removeItem('user-token')
  }
  /* 免登录页面 */
  if (whiteList.indexOf(to.fullPath) >= 0) {
    return next()
  }
  let user_info = JSON.parse(sessionStorage.getItem('user-info'))
  /* 上次会话结束，重新获取用户信息 */
  if (!user_info) {
    requestUserInfo({}).then(user_info => {
      const permissions = user_info.permissions || []
      router_init(permissions)
      page_permission(permissions, to.path, next)
    }).catch((err) => {
      /* 获取用户信息异常 */
      console.error(err)
    })
  } else {
    /* 已登录时判断页面权限 */
    const permissions = user_info.permissions || []
    page_permission(permissions, to.path, next)
  }
})

export default router
```

以上代码引入一个白名单机制，即指定页面不需要权限即可访问，创建以上代码引用的`src/router/whiteList.js`文件：
``` js
/* 免登录白名单页面 */
const whiteList = [
  '/login',
  '/register'
]

export default whiteList
```

另外需要修改接口函数，分离**登录**与**获取用户信息**接口，并在请求**获取用户信息**成功后，将信息存入`sessionStorage`，以便后续能快速获取用户名和权限表。修改`src/api/user.js`：
``` js {14-18}
import {request} from '../utils/request'

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
  return request('/api/user/info', params).then((data) => {
    sessionStorage.setItem('user-info', JSON.stringify(data))
    return data
  })
}
```

::: tip 提示
以上方法限制了用户访问的URL。但页面权限还会涉及菜单的显示，可以通过读取sessionStorage中用户的权限列表，利用`v-if`只显示有权限的菜单。后续讲述菜单栏时会进行说明。
:::

## 数据权限控制
我们已在上一小节里将用户的数据级权限数据存入了`$route.meta.permission`，因此只要在页面渲染时使用`v-if`判断是否显示即可。比如：
``` html
<div v-if="$route.meta.permission.includes('delete')">删除</div>
```

## 错误页面
当用户输入未知的URL时，我们希望系统能跳转至指定的404页面。另外基于我们的权限控制设置，用户在没有权限访问页面时也需要跳转至指定页面。创建以下两个错误页面：
1. 401用户无权限页面：`pages/error/AppError401.vue`
``` vue
<template>
  <div>401用户无权限</div>
</template>

<script>
export default {
  name: 'AppError401'
}
</script>

<style scoped>

</style>
```

2. 404找不到资源页面：`pages/error/AppError404.vue`
``` vue
<template>
  <div>404找不到资源</div>
</template>

<script>
export default {
  name: 'AppError404'
}
</script>

<style scoped>

</style>
```

修改路由配置`src/router/staticRouter.js`：
``` js {4,5,24-34}
import AppLogin from '@/pages/login/AppLogin'
import AppRegister from '@/pages/login/AppRegister'
import HelloWorld from '@/components/HelloWorld'
import AppError401 from '@/pages/error/AppError401'
import AppError404 from '@/pages/error/AppError404'

/* 静态页面路由 */
const staticRouter = [
  {
    path: '/',
    redirect: '/index'
  }, {
    path: '/login',
    name: '登录',
    component: AppLogin
  }, {
    path: '/register',
    name: '注册',
    component: AppRegister
  }, {
    path: '/index',
    name: '首页',
    component: HelloWorld
  }, {
    path: '/error/401',
    name: '错误401',
    meta: {errorPage: true},
    component: AppError401
  }, {
    path: '*',
    name: '错误404',
    meta: {errorPage: true},
    component: AppError404
  }
]

export default staticRouter

```
::: tip 提示
我们在上方编写导航钩子时，忽略了`to.meta.errorPage`页面的权限检测，因此错误页面都要加上此值。
:::

## 流程示意图
页面权限流程控制大体如下：

<img src="/assets/img/vue-llplatform/permission-process.png" style="border: 1px solid #000"/>