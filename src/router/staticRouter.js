import TheLayout from '@/pages/layout/TheLayout'
import AppLogin from '@/pages/login/AppLogin'
import AppRegister from '@/pages/login/AppRegister'
import AppError401 from '@/pages/error/AppError401'
import AppError404 from '@/pages/error/AppError404'
import FuncHome from '@/pages/functions/home/FuncHome'
import FuncUserPassword from '@/pages/functions/user/FuncUserPassword'

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
    path: '/',
    component: TheLayout,
    children: [
      {
        path: '/index',
        alias: '/home',
        name: '首页',
        component: FuncHome
      }, {
        path: '/user/password',
        name: '用户密码',
        component: FuncUserPassword
      }
    ]
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
