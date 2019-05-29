# 国际化
本章节介绍系统国际化，即提供各个国家语言的支持。

> [Element国际化](http://element-cn.eleme.io/#/zh-CN/component/i18n)介绍了如何实现系统国际化，其中一些细节可能不太清楚，因此本章节会详细说明。

## 说明
Element组件自身提供国际化，支持多种语言，可以在`src/main.js`添加如下代码，来令Element的组件使用指定语言。
``` js
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, { locale })
```
但上方代码只会令Element的组件使用指定语言，并不会让我们自己写的代码能支持国际化，因此我们要加入自己的`i18n`。

另外以上是使用指定的其他一种语言，为了能够切换多种语言，我们要导入多种语言。


## 实现
以下以实现中文和英文切换为例：

1. 安装`vue-i18n`：
``` bash
npm install vue-i18n --save
```
2. 创建本系统的中文语言文件`src/assets/lang/zh-cn.js`
``` js
export default {
  common: {
    ok: '确认',
    cancel: '取消'
  },
  login: {
    login: '登录',
    register: '注册',
    ...
  }
}
```
3. 创建本系统的英文语言文件`src/assets/lang/en.js`
``` js
export default {
  common: {
    ok: 'OK',
    cancel: 'Cancle'
  },
  login: {
    login: 'Login',
    register: 'Register',
    ...
  }
}
```
4. 修改`src/main.js`
``` js {8-13,24-42,47}
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.scss'
/* 1. 导入国际化相关依赖 */
import VueI18n from 'vue-i18n'
import myEnLocale from './assets/lang/en'
import myZhLocale from './assets/lang/zh-cn'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.config.productionTip = false
Vue.use(ElementUI)

// 根据环境变量决定是否引入mock
if (process.env.NODE_ENV !== 'production' && !process.env.VUE_APP_BACK_END_URL) {
  const Mock = require('./mock/index').default
  Mock.mockData()
}

/* vue-i18n */
Vue.use(VueI18n)
// 2.1 支持两种语言，每种语言需要合并自己书写的语言文件和element-ui的同语言文件
const messages = {
  'en': Object.assign(myEnLocale, enLocale),
  'zh-cn': Object.assign(myZhLocale, zhLocale)
}
// 2.2 加载用户语言设置，你也可以把此值存放在后台
const lang = localStorage.getItem('user-language') || 'zh-cn'
// 2. 实例化VueI18n
const i18n = new VueI18n({
  locale: lang,
  messages
})
/* element-ui */
Vue.use(ElementUI, {
  // 3. element-ui默认支持vue-i18n@5.x版本，6.x以上的版本需要添加此配置项，当前已8.x
  i18n: (key, value) => i18n.t(key, value)
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

```
5. 使用：以下代码举例了在vue组件中如何使用语言文件配置的值
``` vue {4,6,14}
<template>
  <div>
  <!-- 1. 属性中使用，记得使用v-bind，即不要遗漏前面的冒号 -->
  <input :placeholder="$t('login.login')"/>
  <!-- 2. HTML中使用 -->
  <button>{{ $t("common.ok") }}</button>
  </div>
</template>

<script>
export default {
  data () {
    // 3. js中使用
    const cancel = this.$t('common.cancel')
  }
}
</script>
```
6. 切换语言：记录并切换语言
``` js
localStorage.setItem('user-language', 'zh-cn')
this.$i18n.locale = 'zh-cn'
```

