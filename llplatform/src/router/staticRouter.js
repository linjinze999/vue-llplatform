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
