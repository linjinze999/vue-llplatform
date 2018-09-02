import TheLayout from '@/pages/layout/TheLayout'
import AppLogin from '@/pages/login/AppLogin'
import AppRegister from '@/pages/login/AppRegister'
import AppError401 from '@/pages/error/AppError401_1'
import AppError404 from '@/pages/error/AppError404_3'
import FuncHome from '@/pages/functions/home/FuncHome'
import FuncCharts from '@/pages/functions/charts/FuncCharts'
import FuncFormsBase from '@/pages/functions/forms/FuncFormsBase'
import FuncFormsEdit from '@/pages/functions/forms/FuncFormsEdit'
import FuncUserPassword from '@/pages/functions/user/FuncUserPassword'
import FuncUserLanguage from '@/pages/functions/user/FuncUserLanguage'
import FuncUserTheme from '@/pages/functions/user/FuncUserTheme'

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
    menu: true,
    children: [
      {
        path: '/index',
        alias: '/home',
        name: '首页',
        icon: 'el-icon-menu',
        component: FuncHome
      }
    ]
  }, {
    path: '/',
    component: TheLayout,
    menu: true,
    name: '表单',
    icon: 'el-icon-tickets',
    children: [
      {
        path: '/forms/base',
        name: '基本表单',
        component: FuncFormsBase
      }, {
        path: '/forms/edit',
        name: '富文本编辑器',
        component: FuncFormsEdit
      }
    ]
  }, {
    path: '/',
    component: TheLayout,
    menu: true,
    children: [
      {
        path: '/charts',
        name: '图表',
        icon: 'el-icon-picture',
        component: FuncCharts
      }
    ]
  }, {
    path: '/',
    component: TheLayout,
    menu: true,
    name: '个人设置',
    icon: 'el-icon-setting',
    children: [
      {
        path: '/user/language',
        name: '语言设置',
        component: FuncUserLanguage
      }, {
        path: '/user/theme',
        name: '主题设置',
        component: FuncUserTheme
      }, {
        path: '/user/password',
        name: '密码设置',
        component: FuncUserPassword
      }
    ]
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
