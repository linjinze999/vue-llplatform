# vue-llplatform

> 别忘记点右上角的Star哦~

## 简介
> vue-llplatform，基于[vue](https://cn.vuejs.org/)、[element](http://element-cn.eleme.io/#/zh-CN)搭建的后台管理平台。
> 考虑到后台管理一般是在电脑端查看，因此本项目没有实现移动端的适配。

教学说明：[https://linjinze999.github.io/vue-llplatform/](https://linjinze999.github.io/vue-llplatform/)

源码地址：[https://github.com/linjinze999/vue-llplatform](https://github.com/linjinze999/vue-llplatform)

在线预览：[https://linjinze999.github.io/vue-llplatform/preview/#/login](https://linjinze999.github.io/vue-llplatform/preview/#/login)

## 准备
你需要在本地安装[node]()。本项目技术栈基于[ES6](http://es6.ruanyifeng.com/)、
[vue](https://cn.vuejs.org/index.html)、[vue-router](https://router.vuejs.org/zh-cn/)、
[axios](https://github.com/axios/axios)和[element-ui](http://element-cn.eleme.io/#/zh-CN/)，
所有的请求数据都使用[Mock.js](http://mockjs.com/)模拟，提前了解和学习这些知识会对使用本项目有很大的帮助。

同时配套一个系列的教程文章，如何从零构建后一个完整的后台项目，建议大家先看完这些文章再来实践本项目：
[https://linjinze999.github.io/vue-llplatform/](https://linjinze999.github.io/vue-llplatform/)

![vue-llplatform](https://i.imgur.com/CSK6Ag8.png)

## 功能
```
- 登录
 - 登录 / 注册 / 注销
 - 自动登录
 - 密码加密

- 权限验证
  - 页面权限
  - 指令权限

- 全局功能
  - 国际化多语言
  - 自定义主题
  - 本地mock数据
  - 侧边栏无限菜单
  - 收缩侧边栏
  - 请求错误自动处理
  - 请求支持sessionStorage、localStorage

- 功能页面
  - 表格table
  - 表单form
  - 富文本编辑器
  - 图表
  - 拖曳
  - 权限设置
  - 错误页面


```

## 构建
进入项目目录
``` bash
cd llplatform
```
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
