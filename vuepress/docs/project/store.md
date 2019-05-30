# 状态管理

本章节介绍如何管理数据状态，本项目使用了 Vuex 管理一些全局数据（如用户权限列表、用户名）。
::: warning 警告
当你不觉得维护数据麻烦的时候，你可以不引入状态管理。因为引入状态管理需要额外学习一些概念和框架，这对你的项目来说可能是不必要的成本。
:::

#### 导语

如果不做处理，系统的状态是零散地分布在许多组件和组件之间的交互中的。

> 如本项目的表格、表单页面各自存储了自己的数据，侧边栏的伸缩状态在顶部栏、侧边栏、主页面等地方被引用。前者在大型应用中会让系统变得复杂，各个页面的数据会非常多，让你难以管理；后者数据的管理和交互本身就显得复杂。 
> 
> 此时若有一个类似全局变量的东西，可以统一维护这些数据，那我们的管理将变得方便很多（各组件只需要调用、修改这个全局变量即可）。


以下介绍两种状态管理模式：
## 一、简单Store

当你需要维护少部分全局数据的时候（中小型应用），你可以使用[简单的Store模式](https://cn.vuejs.org/v2/guide/state-management.html#%E7%AE%80%E5%8D%95%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E8%B5%B7%E6%AD%A5%E4%BD%BF%E7%94%A8)：
定义一个全局store数据，让各个组件都使用这个数据。这样可以比较好的管理一些全局数据，也能减少一些复杂的组件数据交互。看一下官网的例子：

首先创建一个store（你可以创建一个`src/store/index.js`文件来维护这个store）：
``` js
const store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}

export default store
```
::: danger 我们约定：
1. 所有要使用的属性都应该预先在`store.state`中声明好（[避免后续声明的属性不是响应式](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%A3%B0%E6%98%8E%E5%93%8D%E5%BA%94%E5%BC%8F%E5%B1%9E%E6%80%A7)）；
2. 所有值的修改都要通过`store`的 `action`函数来触发，而不能直接通过`store.state.xxx = xxx`来修改值（这将导致我们跟踪不到哪里修改了值，也不会留下任何操作记录，这对调试来说会是噩梦。而通过`action`来触发值的变更，我们可以额外做一些处理，如上方的`action`就打印了log）
:::
然后在`src/main.js`中将`store`写入到Vue实例（参考[Vue定义全局变量](https://blog.csdn.net/yanby921005/article/details/80532984)）：
``` js
import store from 'store/index'
Vue.prototype.store = store
```
::: tip 提示
如果你不是一个Vue CLI应用，只是单纯的引用vue.js，定义一个全局变量`var store`后就可以直接在js里引用该`store`全局变量，而不用将`store`写入Vue实例。
:::
之后你就可以在任意vue组件中通过如下方式来调用、修改message了（**注意如果没有组件data引用`store.state`，则`store.state`是非响应式的**）：
``` vue {3-5,13-17,21-28}
<template>
  <div>
    <p>全局变量：{{ store.state.message }}（等于共享状态）</p>
    <p>共享状态：{{ sharedState.message }}（等于全局变量）</p>
    <p>私有状态：{{ privateState.message }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 共享状态数据，指向全局store.state引用，并使其变为响应式，二者同步更新数据
      // 若无此声明，则store.state是非响应式的，即你无法同步其数据变更
      sharedState: this.store.state,
      // 私有状态数据，通过深拷贝复制一份数据，不影响全局store.state
      privateState: JSON.parse(JSON.stringify(store.state))
    }
  },
  methods: {
    changeSharedState (newMessage) {
      // 修改全局变量、共享状态数据：调用store的action
      this.store.setMessageAction(newMessage)
    },
    changePrivateState (newMessage) {
      // 修改私有状态数据：正常赋值
      this.privateState.message = newMessage
    }
  }
}
</script>
```


## 二、Vuex
当你需要管理一个大型应用数据的时候，以上简单Store模式可能就无法满足你的需求了（比如你的数据需要划分一下模块）。官网提供专为 Vue.js 应用程序开发的状态管理模式——[Vuex](https://vuex.vuejs.org/zh/)，它其实就是对以上简单Store模式的扩展，有了更多的功能（如响应式数据、模块划分、time-travel 调试、状态快照导入导出等高级调试功能）。

具体介绍见[官网](https://vuex.vuejs.org/zh/)，以下是一些简介。

**Vuex由以下5大核心组成：**
1. [State](https://vuex.vuejs.org/zh/guide/state.html)：存储数据，唯一数据源；
2. [Getter](https://vuex.vuejs.org/zh/guide/getters.html)：store 的计算属性。state中存储了数据，但你可能在很多地方需要对这个数据做同样的处理（如获取某个数组中的指定数据），通过Getter定义一个函数做这个处理，就可以避免大量的重复代码。
``` js
// 定义
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

//使用
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```
3. [Mutation](https://vuex.vuejs.org/zh/guide/mutations.html)：更改 Vuex 的 store 中的状态的唯一方法（**必须是同步的**）；
``` js
// 定义
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})

// 使用
store.commit('increment')
```

4. [Action](https://vuex.vuejs.org/zh/guide/actions.html)：通过调用`Mutation`更改 Vuex 的 store 中的状态（**可以是异步的**）
``` js
// 定义
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})

// 使用
store.dispatch('increment')
```

5. [Module](https://vuex.vuejs.org/zh/guide/modules.html)：将 store 分割成模块。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：
``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

**项目结构：**

Vuex 并不限制你的代码结构。但是，它规定了一些需要遵守的规则：
1. 应用层级的状态应该集中到单个 store 对象中。
2. 提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。
3. 异步逻辑都应该封装到 action 里面。
只要你遵守以上规则，如何组织代码随你便。如果你的 store 文件太大，只需将 action、mutation 和 getter 分割到单独的文件。

对于大型应用，我们会希望把 Vuex 相关代码分割到模块中。下面是[官方购物车项目结构示例](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart)：
```
├── index.html
├── main.js
├── api
│   └── ... # 抽取出API请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── cart.js       # 购物车模块
        └── products.js   # 产品模块
```
