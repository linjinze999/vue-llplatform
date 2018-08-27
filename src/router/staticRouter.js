import AppLogin from '@/pages/main/AppLogin'
import AppRegister from '@/pages/main/AppRegister'
import AppIndex from '@/pages/main/AppIndex'
import AppError401 from '@/pages/main/AppError401'
import AppError404 from '@/pages/main/AppError404'

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
    component: AppIndex
  }, {
    path: '/error/401',
    name: '错误401',
    component: AppError401
  }, {
    path: '*',
    name: '错误404',
    component: AppError404
  }
]

export default staticRouter
