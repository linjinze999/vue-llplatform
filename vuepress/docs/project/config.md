# 配置
本章节介绍配置初步的项目环境。

## 安装axios
本项目使用[axios](https://github.com/axios/axios)（基于 promise 的 HTTP 库）来做网络请求。
``` bash
npm install axios hq -S
```
创建`src/utils/request.js`文件，后续我们将对request请求进行统一封装。

## 安装mockjs
为了方便调试，本项目使用[mockjs](http://mockjs.com/)来拦截请求，生成模拟数据并返回给前端页面。
``` bash
npm install mockjs -D
```
创建`src/mock/index.js`文件，用于模拟后台返回数据。


## 修改eslint
项目默认使用了[eslint](http://eslint.cn/docs/rules/)检测规则，有些规则可能跟我们的编程习惯不一样。
你可以通过修改`.eslintrc.js`文件来修改检测规则。以下修改允许在正式环境进行日志打印，方便调试：
```javascript {11}
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

```

另外 vue eslint规则和idea冲突：如果你使用IDEA或webstorm编辑代码，会发现其内置规则与vue eslint规则有所冲突，需要我们修改一下。
你可以直接右键`.eslintrc.js`文件，点击`Apply ESLint Code Style Rules`；也可以手动修改配置：
- script、style标签缩进：IDEA会在vue文件的`script`标签里，为所有代码进行缩进，但vue eslint规则是不缩进，此时就会报错`expected indentation of 0 spaces but found 2`。可以修改IDEA或webstorm配置：File => Setting => Editor => Code Style => HTML => Other，找到 `Do not indent children of` 的选项，添加`script`和`style`标签就完美解决缩进问题。
- 行末`;`符号和单引号问题：vue eslint不允许末尾有`;`，且字符串使用单引号。设置：File => Setting => Editor => Code Style => JavaScript => Punctuation，修改为`Don't use` semicolon to terminate statements `always`；Use `single` quotes `always`。
- 函数后空格：vue eslint规定函数名与`()`之间需有空格。File => Setting => Editor => Code Style => JavaScript => Spaces，勾选`Function declaration parentheses`。
- 缩进问题：vue eslint默认缩进两个空格。File => Setting => Editor => Code Style => CSS、HTML、JavaScript => Tabs and Indents，将三种语言的缩进设置改为：Tab size=2；Indent=2；Continuation indent=4
- 不允许连续两个空行：vue eslint默认不允许有连续两个空行。File => Setting => Editor => Code Style => JavaScript => Blank Lines，设置Keep Maximum Blank Lines => In code：1。


## 其他依赖
- [crypto-js](https://github.com/brix/crypto-js)：加密算法，登录时使用
- `common.scss`：创建一个统一的初始样式

**步骤如下**：
1. 安装依赖
``` bash
npm install crypto-js -S
```
2. 创建统一样式文件 `src/assets/css/common.scss`：
``` scss
html, body {
  height: 100%;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Chrome 滚动条优化 */
* {
  &::-webkit-scrollbar { /*滚动条整体样式*/
    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;
  }

  &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 8px;
    background-color: hsla(220, 4%, 58%, .3);
    transition: background-color .3s;

    &:hover {
      background: #bbb;
    }
  }

  &::-webkit-scrollbar-track { /*滚动条里面轨道*/
    background: #EDEDED;
  }
}

```

## 目录结构
1. 创建以下目录/文件：
 - `src/api`目录：用于编写后台请求js
 - `src/assets/css`目录：用于存放公共css文件
 - `src/assets/img`目录：用于存放公共图片
 - `src/mock`目录：用于编写模拟后台数据
 - `src/router`目录：路由管理（将`src/router.js`移动为`src/router/index.js`）
 - `src/store`目录：状态管理（将`src/store.js`移动为`src/store/index.js`）
 - `src/utils`目录：用于存放公共工具文件
 - `.env`文件：项目全局环境变量
 - `.env.development`文件：项目开发环境变量
 - `.env.development.local`文件：项目开发环境变量（本地）
 - `.env.production`文件：项目生产环境变量
 - `vue.config.js`文件：Vue-cli配置文件

整体目录结构如下：
``` {6,9-12,18-19,26}
llplatform
|— dist                 // 构建产物
|— node_modules         // npm依赖包
|— public               // 第三方不打包资源
|— src                  // 源代码
|   |— api              // 接口处理（自行创建）
|   |— assets           // 资源文件
|   |— components       // 全局公用组件
|   |— router           // 路由规则（原文件router.js，建立文件夹管理）
|   |— store            // 状态管理（原文件store.js，建立文件夹管理）
|   |— views            // 所有视图页面
|   |— utils            // 公共工具（自行创建）
|   |— App.vue          // 入口页面
|   └─ main.js          // 入口 加载组件 初始化等
|— tests                // 自动化测试
|— .browserslistrc      //浏览器兼容配置
|— .editorconfig        //编辑器风格配置
|— .env.development     //开发环境变量配置（自行创建）
|— .env.production      //生产环境变量配置（自行创建）
|— .eslintrc.js         //ESLint规则配置
|— .gitignore           //git忽略配置
|— babel.config.js      //babel配置
|— package.json         //npm配置
|— package-lock.json    //npm依赖包锁定
|— postcss.config.js    //webpack的css-loader配置
|— vue.config.js        //vue-cli配置（自行创建）
└─ README.md            //项目简介
```

2. 修改以下5个文件：
- `src/router/index.js`文件：
```javascript {3,19}
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ]
})

```
- `src/store/index.js`文件：
```javascript {8-11}
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    source: {
      token: null,
      cancel: null
    }
  },
  mutations: {

  },
  actions: {

  }
})

```
- `src/main.js`文件：
```javascript {3,4,7}
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```
- `.env`文件：全局环境变量，此处设置了全局根路径（多数项目为`/`路径，部分项目包含子路径，如`/preview/`）
```
# 项目根路径
VUE_APP_BASE_PATH=/

```
- `vue.config.js`文件：vue-cli配置文件，此处设置了一些路径别名和利用`VUE_APP_BASE_PATH`环境变量设置系统路径
```javascript
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // 设置路径别名
      .set('@pages', resolve('src/views/pages')) // 设置路径别名
  },
  publicPath: process.env.VUE_APP_BASE_PATH || '/' // 系统路径
}

```
