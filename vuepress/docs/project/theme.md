# 主题定制
本章节介绍如何定制系统主题。

> 正常各个系统都有自己的设计风格，使用组件库默认的色彩风格可能与系统并不搭配，此时就需要定制化我们的主题。
>
> 并且有时候为了满足用户的个性化需求，我们还会支持主题切换，但正常情况下不会特别提供此功能。


主题定制有多种理解方式：
## 一、不同皮肤切换
提供完全不同的皮肤给用户使用，这需要我们提取style样式，形成多套皮肤，动态加载。请参考[vue vue-cli 应用 实现换肤功能 主题切换](https://blog.csdn.net/qq_35319282/article/details/79483931)

示例：

<img :src="$withBase('/assets/img/vue-llplatform/theme-skin-demo1.png')" width="49%"/>
<img :src="$withBase('/assets/img/vue-llplatform/theme-skin-demo2.png')" width="49%"/>

## 二、指定主题色
更换组件库的默认主题色，此方式只是修改了一下组件的色彩样式，我们只要引入指定的样式文件即可（参考[Element 自定义主题](http://element.eleme.io/#/zh-CN/component/custom-theme)），如：
``` js {3,4}
import ElementUI from 'element-ui'
// 默认样式改为指定样式
// import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
```
<img :src="$withBase('/assets/img/vue-llplatform/theme-one.png')" />

**定制化的样式文件有以下几种办法生成：**

### 一）在线生成
访问[Element在线主题生成工具](https://elementui.github.io/theme-chalk-preview)，选择自己所需的颜色，下载主题压缩包，解压到系统中，按如下方式引入系统：
``` js
import Vue from 'vue'
import Element from 'element-ui'
import '../theme/index.css'

Vue.use(Element)
```

### 二）直接修改 SCSS 变量
新建文件`element-variables.scss`
``` scss
/* 改变主题色变量 */
$--color-primary: teal;

/* 改变 icon 字体路径变量，必需 */
$--font-path: '~element-ui/lib/theme-chalk/fonts';

@import "~element-ui/packages/theme-chalk/src/index";
```
之后，在项目的入口文件`src/main.js`中，直接引入以上样式文件即可（无需引入 Element 编译好的 CSS 文件，因为已经 import 了）：
``` js
import Vue from 'vue'
import Element from 'element-ui'
import './element-variables.scss'

Vue.use(Element)
```

### 三）使用Element的命令行主题工具
**1. 安装工具**

a) 首先安装[主题生成工具](https://github.com/ElementUI/element-theme)，可以全局安装或者安装在当前项目下，推荐安装在项目里，方便别人 clone 项目时能直接安装依赖并启动，这里以全局安装做演示。
``` bash
npm i element-theme -g
```
b) 安装白垩主题，可以从 npm 安装或者从 GitHub 拉取最新代码。
``` bash
# 从 npm
npm i element-theme-chalk -D

# 从 GitHub
npm i https://github.com/ElementUI/theme-chalk -D
```

**2. 初始化变量文件**

主题生成工具安装成功后，如果全局安装可以在命令行里通过`et`调用工具，如果安装在当前目录下，需要通过`node_modules/.bin/et`访问到命令。执行`-i`初始化变量文件。默认输出到`element-variables.scss`，当然你可以传参数指定文件输出目录。
``` bash
et -i [可以自定义变量文件]

> ✔ Generator variables file
```
如果使用默认配置，执行后当前目录会有一个 element-variables.scss 文件。内部包含了主题所用到的所有变量，它们使用 SCSS 的格式定义。大致结构如下：
``` scss
$--color-primary: #409EFF !default;
$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default; /* 53a8ff */
$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default; /* 66b1ff */
$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default; /* 79bbff */
$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default; /* 8cc5ff */
$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default; /* a0cfff */
$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default; /* b3d8ff */
$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default; /* c6e2ff */
$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default; /* d9ecff */
$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default; /* ecf5ff */

$--color-success: #67c23a !default;
$--color-warning: #e6a23c !default;
$--color-danger: #f56c6c !default;
$--color-info: #909399 !default;

...
```

**3. 修改变量**

直接编辑`element-variables.scss`文件，例如修改主题色为红色。
```scss
$--color-primary: red;
```

**4. 编译主题**

保存文件后，到命令行里执行`et`编译主题，如果你想启用`watch`模式，实时编译主题，增加`-w`参数；如果你在初始化时指定了自定义变量文件，则需要增加`-c`参数，并带上你的变量文件名
``` bash
et

> ✔ build theme font
> ✔ build element theme
```

**5. 引入自定义主题**

默认情况下编译的主题目录是放在`./theme`下，你可以通过`-o`参数指定打包目录。像引入默认主题一样，在代码里直接引用`theme/index.css` 文件即可。
``` js
import '../theme/index.css'
import ElementUI from 'element-ui'
import Vue from 'vue'

Vue.use(ElementUI)
```

## 三、主题色切换
### （一）简述

这是比较常见的主题切换功能：系统内置多种主题颜色，用户选择其中一种作为本地主题。（参考[这篇文章](https://segmentfault.com/a/1190000009762198#articleHeader2)）

<img :src="$withBase('/assets/img/vue-llplatform/theme-change.gif')" />

**实现思路大体为**：本地存放多套主题，两者有不同的命名空间，如写两套主题，一套叫`day-theme`，放在命名空间`.day-theme`下；一套叫`night-theme`，放在命名空间`night-theme`下。我们动态的在`body`的`class`上添加`day-theme`或者`night-theme`，达到切换主题的目的。
``` css
/* day-theme */
.day-theme .element-class { bascground-color: #ffffff }
/* night-theme */
.night-theme .element-class { bascground-color: #000000 }
```

### （二）实现

1. 参考[2.3 使用Element的命令行主题工具](/vue-llplatform/theme.html#三）使用element的命令行主题工具)编译出一套主题。
2. 使用[gulp-css-wrap](https://npm.taobao.org/package/gulp-css-wrap)来批量为css文件扩展命名空间：
  - 安装gulp
``` bash
npm install  gulp gulp-clean-css gulp-css-wrap -g
```

  - 在项目根目录下创建一个名为`gulpfile.js`的文件

``` js
var path = require('path')
var gulp = require('gulp')
var cleanCSS = require('gulp-clean-css');
var cssWrap = require('gulp-css-wrap');

var customThemeName='.custom-theme' // 命名空间

gulp.task('css-wrap', function() {
  return gulp.src( path.resolve('./theme/index.css')) // 目标css文件
    .pipe(cssWrap({selector:customThemeName}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist')); //输出文件夹
});

gulp.task('move-font', function() {
  return gulp.src(['./theme/fonts/**']).pipe(gulp.dest('dist/fonts')); // 字体文件
});

gulp.task('default',['css-wrap','move-font']);
```

  - 执行gulp输出
``` bash
gulp
```
3. 为`body`添加不同的命名空间：
``` js
document.body.classList.remove("old_namespace_name");
document.body.classList.add("new_namespace_name");
```

### （三）注意

1. 这种模式实现换肤有一个弊端的，它等于把这多个主题都打包在了项目里，如果你的项目主题需要七八种，这种模式就不适合了。我们就需要动态的加载css，下面就是最简单的动态添加css的例子，当然你可以封装一下，增加成功或者失败回调，判断是否加载过改资源等等。
``` js
var head = document.getElementsByTagName('HEAD').item(0);
var style = document.createElement('link');
style.href = 'style.css';
style.rel = 'stylesheet';
style.type = 'text/css';
head.appendChild(style);
```
2. 系统内置的主题色彩，最好保持视觉的连续性，即同一套色彩，尽量采取同一色环的色值。详情见：[Ant Design 视觉-色彩](https://ant.design/docs/spec/colors-cn)

<img :src="$withBase('/assets/img/vue-llplatform/theme-change-color1.png')"/>
<img :src="$withBase('/assets/img/vue-llplatform/theme-change-color2.png')" />


## 四、自定义主题色
### （一）简述

这种方式比较灵活，用户可以自定义任意一种主题颜色。
本项目就是采用这种方式。
这种方式的优点是我们无需准备多套主题，用户可以自由动态换肤；缺点是自定义不够，只支持基础颜色的切换。

<img :src="$withBase('/assets/img/vue-llplatform/theme-any.gif')" />

::: tip 提示
参考[vue-element-admin 更换主题](https://panjiachen.github.io/vue-element-admin-site/zh/guide/advanced/theme.html)
:::

### （二）原理

element-ui 2.0 版本之后所有的样式都是基于 SCSS 编写的，所有的颜色都是基于几个基础颜色变量来设置的，所以就不难实现动态换肤了，只要找到那几个颜色变量修改它就可以了。

Element官方实现了一个demo：[在线主题生成工具](https://elementui.github.io/theme-chalk-preview)。作者在[issue](https://github.com/ElemeFE/element/issues/3054)中回复了他的方案：
1. 先把默认主题文件中涉及到颜色的 CSS 值替换成关键词：[源码](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L250-L274)
2. 根据用户选择的主题色生成一系列对应的颜色值：[源码](https://github.com/ElementUI/theme-preview/blob/master/src/utils/formula.json)
3. 把关键词再换回刚刚生成的相应的颜色值：[源码](https://github.com/ElementUI/theme-preview/blob/master/src/utils/color.js)
4. 直接在页面上加 style 标签，把生成的样式填进去[源码](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L198-L211)

**根据以上方案，简单说明一下我们的原理**：

首先我们需要通过 package.json 拿到 element-ui 的版本号，根据该版本号去请求相应的样式。拿到样式之后将样色，通过正则匹配和替换，将颜色变量替换成你需要的，之后动态添加 style 标签来覆盖原有的 css 样式。
::: tip 提示
这里需要获取 element-ui 的版本号，从而锁定版本，以免将来 Element 升级时受到非兼容性更新的影响。
:::

### （三）实现

1. 创建`ThemePicker`组件（创建`src/components/ThemePicker.vue`文件）：
``` vue
<template>
  <el-color-picker
    v-model="theme"
    class="theme-picker"
    :predefine="predefineColors"
    popper-class="theme-picker-dropdown"/>
</template>

<script>
const version = require('element-ui/package.json').version // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF' // default color
export default {
  data () {
    return {
      chalk: '', // content of theme-chalk css
      predefineColors: [
        '#409EFF',
        '#fa541c',
        '#fa8c16',
        '#faad14',
        '#fadb14',
        '#a0d911',
        '#52c41a',
        '#13c2c2',
        '#1890ff',
        '#2f54eb',
        '#722ed1',
        '#eb2f96',
        '#f5222d'
      ],
      theme: ORIGINAL_THEME
    }
  },
  watch: {
    theme (val, oldVal) {
      if (typeof val !== 'string') return
      const themeCluster = this.getThemeCluster(val.replace('#', ''))
      const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))
      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''))
          const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster)
          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.setAttribute('id', id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle
        }
      }
      const chalkHandler = getHandler('chalk', 'chalk-style')
      if (!this.chalk) {
        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
        this.getCSSString(url, chalkHandler, 'chalk')
      } else {
        chalkHandler()
      }
      const styles = [].slice.call(document.querySelectorAll('style'))
        .filter(style => {
          const text = style.innerText
          return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
        })
      styles.forEach(style => {
        const {innerText} = style
        if (typeof innerText !== 'string') return
        style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
      })
      localStorage.setItem('user-theme', val)
    }
  },
  methods: {
    updateStyle (style, oldCluster, newCluster) {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    },
    getCSSString (url, callback, variable) {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
          callback()
        }
      }
      xhr.open('GET', url)
      xhr.send()
    },
    getThemeCluster (theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)
        if (tint === 0) { // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))
          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)
          return `#${red}${green}${blue}`
        }
      }
      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)
        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)
        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)
        return `#${red}${green}${blue}`
      }
      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    }
  },
  mounted () {
    const lastTheme = localStorage.getItem('user-theme') || ORIGINAL_THEME
    this.theme = lastTheme
  }
}
</script>

<style>
.theme-picker .el-color-picker__trigger {
  vertical-align: middle;
  background-color: rgba(255, 255, 255, 0.7);
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
```
::: tip 提示
此处使用了Element的[颜色选择器](http://element-cn.eleme.io/#/zh-CN/component/color-picker)组件。
以上源码基于[vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/)的[ThemePicker组件](https://github.com/PanJiaChen/vue-element-admin/blob/master/src/components/ThemePicker/index.vue)作了相应修改：支持记住用户上次使用的主题；添加显示推荐颜色；修改颜色选择器的背景颜色。
:::

2. 在指定地方（`src/views/layout/TheLayoutHeader.vue`）添加`ThemePicker`组件，提供主题切换功能：
``` vue {4,9,14}
<template>
  <div>
    ...
    <theme-picker></theme-picker>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  ...
  components: {
    ThemePicker
  }
}
</script>
```

3. 自定义的vue组件中支持换肤：

  - 在`import`到项目的样式文件（`src/assets/css/common.scss`）中添加和element一致的颜色类：
``` scss
/* [theme] support theme change */
.theme-bg-blue{
  background-color: #409eff;
}
```
若用户切换了主题，此处就会自动被替换为新的颜色。
::: warning 警告
初始颜色（如`#409eff`）要和`ThemePicker.vue`中定义的默认颜色一致，否则将无法被替换。
:::

  - vue组件中直接使用该样式即可：`<div class="theme-bg-blue"></div>`。

::: tip 提示
如果你想直接在vue组件中的`<style>`标签中定义可更换的颜色，你需要修改`webpack`的配置，取消组件中的 CSS 提取。

因为我们自定义主题的原理是找到`<html>`中的`<style>`标签，将指定的颜色替换成新的颜色。
但该配置会将我们的vue组件中的`<style>`内容提取到一个`css`文件中，使用`<link>`引入。这会导致我们无法正确找到指定颜色并修改它。

使用这种方法会导致其他使用指定颜色的组件都被修改，这很可能不是我们希望的。因此还是推荐使用抽取`theme`公共类导入的方式。
:::
