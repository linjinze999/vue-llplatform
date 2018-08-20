import AppLogin from '@/pages/main/AppLogin'
import AppIndex from '@/pages/main/AppIndex'
import AppError404 from '@/pages/main/AppError404'

/* 静态页面路由 */
const staticRoute = [
  {
    path: '/',
    redirect: '/index'
  }, {
    path: '/login',
    name: '登录',
    component: AppLogin
  }, {
    path: '/index',
    name: '首页',
    component: AppIndex
  }, {
    path: '*',
    name: '404',
    component: AppError404
  }
]

export default staticRoute
