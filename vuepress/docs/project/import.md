# 按需引入组件
当你使用组件库的时候，有时可能只使用了部分组件，这时如果你引入了全部组件，就会导致项目变大。
本章节介绍如何按需导入组件。

## 按需引入
不同的组件库（如Element、Ant等），按需引入步骤可能不一样，你可以参考组件库官网的介绍。这里以
[Element 按需引入](https://element.eleme.io/#/zh-CN/component/quickstart#an-xu-yin-ru)为例：
1. 安装 babel-plugin-component：
```bash
npm install babel-plugin-component -D
```
2. 修改`babel.config.js`文件：
```javascript {5-13}
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ]
  ]
}

```
3. 接下来，如果你只希望引入部分组件，比如 Button 和 Select，那么需要在 main.js 中写入以下内容：
```javascript {2,5-10}
import Vue from 'vue';
import { Button, Select } from 'element-ui';
import App from './App.vue';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
/* 或写为
 * Vue.use(Button)
 * Vue.use(Select)
 */

new Vue({
  el: '#app',
  render: h => h(App)
});
```
::: warning 警告
如果你还使用了国际化方案，需要将`src/main.js`的
```javascript
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
```
修改为
```javascript
import ElementLocale from 'element-ui/lib/locale'
ElementLocale.i18n((key, value) => i18n.t(key, value))
```
详情见[Element 按需加载里定制 i18n](https://element.eleme.io/#/zh-CN/component/i18n#an-xu-jia-zai-li-ding-zhi-i18n)
:::

::: tip 提示
完整的组件列表见：[Element 按需引入](https://element.eleme.io/#/zh-CN/component/quickstart#an-xu-yin-ru)第4步说明。
:::
