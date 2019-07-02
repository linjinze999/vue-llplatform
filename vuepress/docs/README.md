# vue-llplatform

vue-llplatform，基于[vue](https://cn.vuejs.org/)、[element](http://element-cn.eleme.io/#/zh-CN)搭建的后台管理平台。

::: tip 提示
考虑到后台管理一般是在电脑端查看，因此本项目没有实现移动端的适配。
:::

## 简介
本文介绍如何从零开始搭建一个基于vue、element的管理平台。

教学说明：[https://linjinze999.github.io/vue-llplatform/](https://linjinze999.github.io/vue-llplatform/)

源码地址：[https://github.com/linjinze999/vue-llplatform](https://github.com/linjinze999/vue-llplatform)

在线预览：[https://linjinze999.github.io/vue-llplatform/preview/#/login](https://linjinze999.github.io/vue-llplatform/preview/#/login)

## 准备
本项目技术栈基于[ES6](http://es6.ruanyifeng.com/)、
[vue](https://cn.vuejs.org/index.html)、[vue-router](https://router.vuejs.org/zh-cn/)、
[vuex](https://vuex.vuejs.org/zh/)、
[axios](https://github.com/axios/axios)和[element-ui](http://element-cn.eleme.io/#/zh-CN/)，
所有的请求数据都使用[Mock.js](http://mockjs.com/)模拟，提前了解和学习这些知识会对使用本项目有很大的帮助。

<img :src="$withBase('/assets/img/vue-llplatform/llplatform-demo.png')"/>

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
  - 三级侧边栏
  - 收缩侧边栏
  - 自定义滚动条
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
