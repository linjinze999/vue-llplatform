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
