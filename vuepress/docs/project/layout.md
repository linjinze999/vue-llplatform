# 页面布局
本章节介绍系统主界面的布局。

## 布局选择
界面布局有许多种（可参考 [Element 布局容器](http://element-cn.eleme.io/#/zh-CN/component/container)），本项目选择了以下这种：
<img src="/assets/img/vue-llplatform/layout-demo.png" />

这里有一个要注意的点是，如何把一个页面嵌套在框架布局中？

这里利用到了Vue Router的[嵌套路由](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)。当你书写了一个类似下面的嵌套路由配置：
``` js {3,7}
{
  path: '/',
  component: TheLayout,
  children: [{
    path: '/index',
    name: '首页',
    component: PageHome
  }]
}
```
路由匹配URL地址符合`/index`，就会先渲染外面的`/`指定的`TheLayout`组件，然后将`/index`的`PageHome`渲染在`TheLayout`组件的`<router-view>`标签中，如：
``` vue {5}
<template>
  <div>
    <header></header>
    <div class="main">
      <router-view></router-view>
    </div>
    <footer></footer>
  </div>
</template>
```

这样只要我们将要嵌入框架布局的页面都写入根路径`/`的`children`中，并且指定根路径`/`的`component`是我们写的`TheLayout`，即可实现页面嵌套在框架布局的效果。

## 主页面
### 描述
主页面用来包含各个布局的组件（顶部栏、菜单、主体、底部栏），你也可以选择将所有组件内容写到本页面，但如果内容较多，建议还是拆分为多个组件会比较好管理。

为了实现菜单栏可以折叠收起的效果，在主页面统一维护了一个`openNav`的变量，表示是否展开菜单。该值会传递给其他组件，涉及到vue的父子组件通信，具体可以参考[vue Prop](https://cn.vuejs.org/v2/guide/components-props.html)和[vue 自定义事件](https://cn.vuejs.org/v2/guide/components-custom-events.html)。

页面高度和浏览器高度一致，**菜单栏**或者**主体+底部栏**超出高度时，使用自定义滚动条内部滚动。其中**菜单栏**自己会实现；此处为`main`和`footer`添加`<vue-scroll>`标签使用自定义滚动条。

### 实现
创建`src/pages/layout/TheLayout.vue`：
``` vue
<template>
  <el-row class="page">
    <el-col :span="24">
      <the-header :open-nav="openNav" @toggle-open="toggleOpen"></the-header>
    </el-col>
    <el-col :span="24" class="page-main">
      <the-sidebar :open-nav="openNav"></the-sidebar>
      <section class="page-content" :class="{'page-content-hide-aside': !openNav}">
        <vue-scroll>
          <the-main></the-main>
          <the-footer></the-footer>
        </vue-scroll>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import TheLayoutHeader from './TheLayoutHeader'
import TheLayoutSidebar from './TheLayoutSidebar'
import TheLayoutFooter from './TheLayoutFooter'
import TheLayoutMain from './TheLayoutMain'

export default {
  name: 'TheLayout',
  data () {
    return {
      openNav: true
    }
  },
  methods: {
    toggleOpen () {
      this.openNav = !this.openNav
    }
  },
  components: {
    'the-header': TheLayoutHeader,
    'the-sidebar': TheLayoutSidebar,
    'the-footer': TheLayoutFooter,
    'the-main': TheLayoutMain
  }
}
</script>

<style scoped lang="scss">
.page {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  .page-main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0;
    .page-content {
      position: absolute;
      left: 240px;
      right: 0;
      height: 100%;
    }
    .page-content-hide-aside {
      left: 65px;
    }
  }
}
</style>
```

## 顶部栏
### 描述
我们将顶部栏分为三部分：**左边Logo**，**中间主体**，**右边用户**。

**主体**提供触发菜单栏展开收起的按钮，收起菜单的同时，**左边Logo**的文字也会隐藏起来，令Logo宽度和左侧折叠的菜单宽度一致。**右边用户**，当鼠标悬浮时可以操作退出登录（利用[Element 下拉菜单组件](http://element-cn.eleme.io/#/zh-CN/component/dropdown)）

<img src="/assets/img/vue-llplatform/layout-header.png" />

### 实现
需要操作父组件的`openNav`；用户名字从`sessionStorage`中获取（登录后有存储用户信息）。创建`src/pages/layout/TheLayoutHeader.vue`：

``` vue
<template>
  <el-header class="header">
    <router-link to="/index">
      <div class="logo" :class="{'logo-hide': !openNav}">
        <img src="../../assets/logo.png" class="image"/>
        <span class="text">LLPlatform</span>
      </div>
    </router-link>
    <div class="content">
      <i class="fa fa-align-justify toggle" @click="navOpenToggle" title="显示/隐藏菜单"></i>
    </div>
    <el-dropdown trigger="hover" class="user">
      <span class="user-info">
        {{ user_name }}<i class="fa fa-user-circle-o fa-2x" style="margin-left: 10px"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>我的账号</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item divided>主题设置</el-dropdown-item>
        <el-dropdown-item>语言选择</el-dropdown-item>
        <el-dropdown-item divided>
          <router-link to="/login">退出登录</router-link>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>

<script>
export default {
  name: 'TheLayoutHeader',
  props: ['openNav'],
  data () {
    const user_info = JSON.parse(sessionStorage.getItem('user-info'))
    const user_name = user_info['name']
    return {
      user_name: user_name
    }
  },
  methods: {
    navOpenToggle () {
      this.$emit('toggle-open')
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  line-height: 60px;
  background-color: #409EFF;
  color: #ffffff;
  div {
    display: inline-block;
  }
  .logo {
    width: 240px;
    border-right: 1px solid #C0C4CC;
    margin-left: -20px;
    text-align: center;
    font-size: 25px;
    cursor: pointer;
    .image {
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }
  }
  .logo-hide {
    width: 65px;
    .text {
      display: none;
    }
  }
  .content {
    padding: 0 20px;
    .toggle {
      font-size: 14px;
      cursor: pointer;
    }
  }
  .user {
    float: right;
    cursor: pointer;
    .user-info {
      color: #ffffff;
      i {
        vertical-align: middle;
      }
    }
  }
}
</style>
```

## 菜单栏
### 描述
菜单栏有一些要注意的点：

1. 我们通过遍历`router`页面表来显示菜单目录，因此要约定`src/router/staticRouter.js`的书写规范。
``` js
{
    path: '/',
    component: TheLayout,
    menu: true,              //菜单目录要添加此值，login等非菜单目录不需要
    children: [              //一级菜单，children[0]即是链接，要指明名字、图标、组件
      {
        path: '/index',
        name: '首页',
        icon: 'el-icon-menu',
        component: FuncHome
      }
    ]
  }, {
    path: '/',
    component: TheLayout,
    menu: true
    name: '表单',              //多级菜单，在父path指明上级目录的名字和图标
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
}
```
2. 支持展开/收起（绑定父组件的`openNav`）。本项目利用了[Element 导航菜单](http://element-cn.eleme.io/#/zh-CN/component/menu)实现，该组件本身支持通过`collapse`属性控制展开/收起。
3. 权限控制：有些页面用户是没有权限看到的。本项目读取存储在`sessionStorage`中的权限表，判断用户是否有权限看到某个页面，然后再进行显示。你可以通过设置某目录为不可点击状态来限制权限（`<el-menu-item disabled>`），或者干脆不要显示这个目录（`v-if`），在页面比较多的时候建议采用后者。本项目采用后者。
4. 本项目支持三级菜单。
5. 添加`<vue-scroll>`，当菜单过长时，使用自定义滚动条。

### 实现
1. 创建`src/pages/layout/TheLayoutSidebar.vue`：
``` vue
<template>
  <aside class="sidebar" :class="{'sidebar-hide': !openNav}">
    <vue-scroll>
      <el-menu :default-active="$route.path" class="sidebar-menu" :collapse="!openNav"
               @select="menuSelect" :collapse-transition="false">
        <template v-for="(level1, index1) in $router.options.routes" v-if="level1.menu">
          <!-- 一级菜单 -->
          <el-menu-item v-if="level1.children.length === 1 && permissions.includes(level1.children[0].path)"
                        :index="level1.children[0].path" :key="index1">
            <i :class="level1.children[0].icon"></i><span slot="title">{{level1.children[0].name}}</span>
          </el-menu-item>
          <el-submenu :index="index1+''" v-if="level1.children.length > 1" :key="index1+''">
            <template slot="title"><i :class="level1.icon"></i><span slot="title">{{level1.name}}</span></template>
            <template v-for="(level2, index2) in level1.children">
              <!-- 二级菜单 -->
              <el-menu-item v-if="!level2.children && permissions.includes(level2.path)"
                            :index="level2.path" :key="index1+'-'+index2">
                {{level2.name}}
              </el-menu-item>
              <el-submenu :index="index1+'-'+index2" v-if="level2.children" :key="index1+'-'+index2">
                <!-- 三级菜单 -->
                <template slot="title"><i :class="level2.icon"></i>{{level2.name}}</template>
                <el-menu-item v-for="(level3, index3) in level2.children" :index="level3.path"
                              :key="index1+'-'+index2+'-'+index3" v-if="permissions.includes(level3.path)">
                  {{level3.name}}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </vue-scroll>
  </aside>
</template>

<script>
export default {
  name: 'TheLayoutSidebar',
  props: ['openNav'],
  data () {
    let user_info = JSON.parse(sessionStorage.getItem('user-info')).permissions || []
    let permissions = []
    user_info.forEach(p => {
      permissions.push(p.path)
    })
    return {
      permissions
    }
  },
  methods: {
    menuSelect (index) {
      this.$router.push(index)
    }
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 240px;
  position: absolute;
  top: 0;
  bottom: 0;
  border-right: 1px solid #e6e6e6;
  .sidebar-menu {
    border: none;
    height: 100%;
  }
}
.sidebar-hide {
  width: 65px;
}
</style>
```

2. 修改`src/router/staticRouter.js`：
``` js {6-8,23-53}
import TheLayout from '@/pages/layout/TheLayout'
import AppLogin from '@/pages/login/AppLogin'
import AppRegister from '@/pages/login/AppRegister'
import AppError401 from '@/pages/error/AppError401'
import AppError404 from '@/pages/error/AppError404'
import FuncHome from '@/pages/functions/home/FuncHome'
import FuncFormsBase from '@/pages/functions/forms/FuncFormsBase'
import FuncFormsEdit from '@/pages/functions/forms/FuncFormsEdit'

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
```

3. 创建被引入的`src/pages/functions/home/FuncHome.vue`、`src/pages/functions/forms/FuncFormsBase.vue`、`src/pages/functions/forms/FuncFormsEdit.vue`三个不同的页面，显示不同的内容：
``` vue {2,7}
<template>
  <div>首页/基础表单/富文本编辑器</div>
</template>

<script>
export default {
  name: 'FuncHome'
}
</script>

<style scoped>
</style>
```

4. 修改模拟权限返回数据`src/mock/index.js`：
``` js {23-31}
import Mock from 'mockjs'

export default {
  mockData () {
    Mock.mock('/api/user/login', {
      'success': true,
      'result': {
        'token': 'fdsjfhjkdshfkldsajfjasdfbjsdkfhsdajfj'
      }
    })
    Mock.mock('/api/user/register', {
      'success': true,
      'result': {
        'token': 'fdsjfhjkdshfkldsajfjasdfbjsdkfhsdajfj'
      }
    })
    Mock.mock('/api/user/info', {
      'success': true,
      'result': {
        'id': '100001',
        'name': '林锦泽',
        'roles': ['admin'],
        'permissions': [
          {
            path: '/index'
          }, {
            path: '/forms/base'
          }, {
            path: '/forms/edit'
          }
        ]
      },
      'error': {
        'code': 100000,
        'message': '无效的token'
      }
    })
  }
}
```

## 主体
### 描述
实体部分主要是为了使用`<router-view>`嵌套其他页面，额外注意以下两点点即可：
1. 最小高度限制（避免页面过矮时，`footer`跑到上方）；
2. 背景颜色置浅灰色（让用户一眼区分空白处和内容）；

### 实现
创建`src/pages/layout/TheLayoutMain.vue`：
``` vue
<template>
  <el-main :style="mainStyle" class="page-sub-main">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-main>
</template>

<script>
export default {
  name: 'TheLayoutMain',
  data () {
    const win_height = window.innerHeight - 100 + 'px'
    return {
      mainStyle: {
        minHeight: win_height
      }
    }
  }
}
</script>

<style scoped>
.page-sub-main {
  background-color: #EBEEF5;
  color: #666666;
}
</style>
```

## 底部栏
创建`src/pages/layout/TheLayoutFooter.vue`：
``` vue
<template>
  <footer class="footer">
    Copyright © linjinze999@163.com
  </footer>
</template>

<script>
export default {
  name: 'TheLayoutHeader'
}
</script>

<style scoped>
.footer {
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-top: 1px solid #e6e6e6;
}
</style>
```

## 效果预览
最终预览效果大体如下：

<img src="/assets/img/vue-llplatform/layout-init.gif" />