# 性能优化
本章节介绍如何优化一个Vue项目。

## 打包优化
Webpack4在生产环境下的打包，提供了许多优化项：
### 1. 资源分离
使用[ExtractTextWebpackPlugin](https://www.webpackjs.com/plugins/extract-text-webpack-plugin/)分离css，使js和css并行加载，详情见[管理资源](https://www.webpackjs.com/guides/asset-management/)；
### 2. Tree shaking
使用[tree shaking](https://www.webpackjs.com/guides/tree-shaking/)删除无用代码；
### 3. 代码分离
使用[SplitChunksPlugin](https://www.webpackjs.com/plugins/split-chunks-plugin/)分离代码，可以分离vue官方源码从而使用官方的cdn，也可以结合【懒加载】或【缓存】使用；
### 4. 懒加载
利用[懒加载](https://www.webpackjs.com/guides/lazy-loading/)，在需要的时候再加载所需资源，如[路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)；
### 5. 缓存
借助[缓存相关技术](https://www.webpackjs.com/guides/caching/)，使代码分离后、没有代码变更的文件名字保持一致，再利用本地缓存加快速度；
### 6. 压缩
利用[CompressionWebpackPlugin](https://www.webpackjs.com/plugins/compression-webpack-plugin/)，开启gzip压缩减少文件体积；
### 7. SourceMap
当代码经过webpack转化后，调试将变得困难，使用SourceMap可以解决该问题，但也会增加代码量。webpack建议保留此配置。


## 源码优化
### 1. v-if 和 v-show选择调用
v-if是懒加载，当状态为true时才会加载，并且为false时不会占用布局空间；v-show是无论状态是true或者是false，都会进行渲染，并对布局占据空间对于在项目中，需要频繁调用，不需要权限的显示隐藏，可以选择使用v-show，可以减少系统的切换开销。
### 2. 为item设置唯一key值
在列表数据进行遍历渲染时，需要为每一项item设置唯一key值，方便vuejs内部机制精准找到该条列表数据。当state更新时，新的状态值和旧的状态值对比，较快地定位到diff。
### 3. 细分vuejs组件
在项目开发过程之中，第一版本把所有的组件的布局写在一个组件中，当数据变更时，由于组件代码比较庞大，vuejs的数据驱动视图更新比较慢，造成渲染比较慢。造成比较差的体验效果。所以把组件细分，比如一个组件，可以把整个组件细分成轮播组件、列表组件、分页组件等。
### 4. 减少watch的数据
当组件某个数据变更后需要对应的state进行变更，就需要对另外的组件进行state进行变更。可以使用watch监听相应的数据变更并绑定事件。当watch的数据比较小，性能消耗不明显。当数据变大，系统会出现卡顿，所以减少watch的数据。其它不同的组件的state双向绑定，可以采用事件中央总线或者vuex进行数据的变更操作。
### 5. 内容类系统的图片资源按需加载
对于内容类系统的图片按需加载，如果出现图片加载比较多，可以先使用v-lazy之类的懒加载库或者绑定鼠标的scroll事件，滚动到可视区域先再对数据进行加载显示，减少系统加载的数据。
### 6. keep-alive
需要频繁切换的组件可以使用keep-alive保留在内存中。
### 7. storage
利用`storage`缓存一些数据。
### 8. 计算
浏览器是单线程的，如果有耗时的计算（特别时游戏等），可以利用`worker`来另启线程计算，这样就不会影响主进程。
或者可以使用`webassembly`技术优化计算。

## 体验优化
### 1. 首屏加载
在首屏加载资源较多的情况下，可能会出现白屏和闪屏，体验不好。可以在首屏资源数据还没有加载完成时显示加载图，给到很好的体验效果。详情见[Vue页面显示骨架屏](https://www.cnblogs.com/xiaoxiaossrs/p/9936516.html)。
### 2. 页面跳转
页面跳转有时会需要一点时间，而这点时间若是页面毫无响应，体验会较差。可以利用nprogress，在跳转期间在页面顶端生成一个小进度条，模拟加载状态。详情见[Vue使用NProgress](https://blog.csdn.net/wn1245343496/article/details/82151273)。
### 3. 加载动效
每次请求或加载都应该显示一个加载效果（常见的菊花图），避免用户操作看起来无响应，这部分大多人都知道，不再多述。
### 4. 占位符
类似图片等元素，可以先使用一个占位符填充，请求成功后再替换。

## 语言优化
javascript是一门解释性语言，因此一些性能表现可能不太好。中大型应用可以使用TypeScript的强类型来优化。
