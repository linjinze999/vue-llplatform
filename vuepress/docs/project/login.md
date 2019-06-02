# 登录与注册
本章节介绍登录、注册页面的编写。

## 后台接口
修改`src/api/user.js`文件，提供登录与注册接口：
``` js
import { request } from '../utils/request'

export const requestLogin = params => {
  return request('/api/user/login', params)
}

export const requestRegister = params => {
  return request('/api/user/register', params)
}

```

## 模拟数据
修改`src/mock/index.js`文件，模拟登录与注册的返回数据：
``` js
import Mock from 'mockjs'

export default {
  mockData () {
    const BASE_PATH = process.env.BASE_URL.endsWith('/')
      ? process.env.BASE_URL.substr(0, process.env.BASE_URL.length - 1)
      : process.env.BASE_URL
    Mock.mock(BASE_PATH + '/api/user/login', {
      'code': 1,
      'result': {
        'id': '100001',
        'name': '林锦泽',
        'roles': ['admin']
      }
    })
    Mock.mock(BASE_PATH + '/api/user/register', {
      'code': 1
    })
  }
}

```

## 编写页面
::: tip 提示
在编写代码前，请阅读 [Vue代码风格指南](https://cn.vuejs.org/v2/style-guide/)
:::

### 页面说明
#### 1. 表单校验
登录、注册页面涉及表单提交，请注意表单输入值的校验，此处用了Element的[Form表单](http://element-cn.eleme.io/#/zh-CN/component/form)。

#### 2. 验证码
一般内部网站不需要使用验证码，因此这边没有实现。

若要实现，可以有两种方式：一是前端自我生成随机数，自我校验；二是向后台请求一个验证码，提交表单时一起返回给后台校验。考虑到验证码的目的是为了安全，推荐使用第二种方式来做验证。但无论哪种方式，验证码都应该处理成图片，避免用户直接赋值或爬虫脚本轻松拿到校验码，可以参考[identify插件](https://github.com/AiMe1991/identify)。

#### 3. 保存密码
为了让用户更方便地登录系统，我们常常提供记住密码/下次自动登录功能。

- 记住密码：利用cookie或者storage，我们可以记录下用户的账号和密码，在用户下次登录时自动写入到对应输入框。但直接记录用户密码是一个不安全的行为，因此建议记录密码时，更改为记录位数N和加密后的结果（如md5），加载页面时用N个*写入输入框，提交表单时密码提交的是md5值。

- 下次自动登录：我们可以保存此次登录的身份，如cookie或token，下次进入系统时继续使用此值（此时要注意后台token的失效逻辑）。

本项目自动使用第二种方案，我们将在下一章的[权限控制](/vue-llplatform/permission.html)中实现。

#### 4. 登录密码
安全起见，请求登录时不会发送明文密码，而是发送加密后的字符串，本项目采用sha256加密算法。

#### 5. 页面跳转
页面跳转使用Vue官方的路由管理器[Vue Router](https://router.vuejs.org/zh/)，下一小节会介绍如何配置。此处会利用到其`beforeRouteEnter`导航守卫，获取上一个页面的URL，以便登录后能跳转至该URL，而非固定的首页（注意忽略注册页面、错误页面的跳转）。


### 代码实现
1. 创建`src/views/login/AppLogin.vue`文件，编写登录页面：
``` vue
<template>
  <div class='page'>
    <div class="login-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px"
               class="demo-ruleForm login-container" status-icon>
        <h3 class="title">系统登录</h3>
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"
                    id="loginEmail"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"
                    id="loginPassword"></el-input>
          <label id="showPasswordToggle">
            <el-checkbox v-model="checked" id="showPasswordCheck">显示密码</el-checkbox>
          </label>
          <router-link to="/" style="float: right; color: #bbbbbb">忘记密码？</router-link>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">
            登录
          </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
          <router-link to="/register">
            <el-button style="width:100%;">
              注册
            </el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha256 from 'crypto-js/sha256'
import { requestLogin } from '@/api/user'

export default {
  name: 'app-login',
  data () {
    return {
      logining: false,
      fromUrl: '/',
      ruleForm: {
        account: 'admin',
        checkPass: '123456'
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      checked: false
    }
  },
  methods: {
    handleSubmit (ev) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.logining = true
          const loginParams = { username: this.ruleForm.account, password: sha256(this.ruleForm.checkPass) }
          requestLogin(loginParams).then(data => {
            this.logining = false
            this.$message({
              message: '登录成功！',
              type: 'success'
            })
            this.$router.push(this.fromUrl)
          }).catch(err => {
            this.logining = false
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.fullPath !== '/register' && !from.meta.errorPage) {
        vm.fromUrl = from.fullPath
      }
    })
  }
}

</script>

<style scoped>

.title {
  text-align: center;
  margin-bottom: 15px;
}

.page {
  background-color: #eff3f4;
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  display: block;
  width: 100%;
  max-width: 400px;
  background-color: #FFF;
  margin: 0;
  padding: 2.25em;
  box-sizing: border-box;
  border: solid 1px #DDD;
  border-radius: .5em;
  font-family: 'Source Sans Pro', sans-serif;
}
</style>

```

2. 创建`src/views/login/AppRegister.vue`文件，编写注册页面
``` vue
<template>
  <div class='page'>
    <div class="login-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px"
               class="demo-ruleForm login-container" status-icon>
        <h3 class="title">注册</h3>
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"
                    id="loginEmail"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"
                    id="loginPassword"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="重复密码"
                    id="loginCheckPass"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">
            注册
          </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
          <router-link to="/login">
            <el-button style="width:100%;">
              登录
            </el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {requestRegister} from '@/api/user'

export default {
  name: 'app-login',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      logining: false,
      ruleForm: {
        account: '',
        password: '',
        checkPass: ''
      },
      rules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleSubmit (ev) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.logining = true
          var registerParams = {
            username: this.ruleForm.account,
            password: this.ruleForm.password,
            checkPass: this.ruleForm.checkPass
          }
          requestRegister(registerParams).then(data => {
            this.logining = false
            this.$message({
              message: '注册成功！',
              type: 'success'
            })
            this.$router.push({path: '/login'})
          }).catch(err => {
            this.logining = false
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>

<style scoped>

.title {
  text-align: center;
  margin-bottom: 15px;
}

.page {
  background-color: #eff3f4;
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  display: block;
  width: 100%;
  max-width: 400px;
  background-color: #FFF;
  margin: 0;
  padding: 2.25em;
  box-sizing: border-box;
  border: solid 1px #DDD;
  border-radius: .5em;
  font-family: 'Source Sans Pro', sans-serif;
}

.login-box .svgContainer {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 1em;
  border-radius: 50%;
  pointer-events: none;
}
</style>

```

3. 取消`src/App.vue`自带的一些配置：
``` vue {3-8,14-35}
<template>
  <div id="app">
    <!-- 删除以下行
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    -->
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  height: 100%;
}
/* 删除以下行
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
*/
</style>

```

## 路由管理
以上我们编写完了页面，但却没有告诉系统什么时候去显示这些页面。
这时候我们就需要一个[路由管理器](https://router.vuejs.org/zh/)，来帮我们自动调用这些页面。
比如当URL是`/login`时，自动调用`src/pages/login/AppLogin.vue`页面并显示。

1. 创建一张静态路由表`src/router/staticRouter.js`：
``` js
/* 静态页面路由 */
const staticRouter = [
  {
    path: '/',
    redirect: '/index'
  }, {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login/AppLogin')
  }, {
    path: '/register',
    name: '注册',
    component: () => import('@/views/login/AppRegister')
  }, {
    path: '/index',
    name: '首页',
    component: () => import('@/components/HelloWorld')
  }
]

export default staticRouter

```
::: warning 警告
当页面较多时，要使用[路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)，
否则页面初始化时一次性加载太多组件会让页面初始化速度变得很慢。本示例的导入方式便是懒加载的方式。
:::

2. 修改`src/router/index.js`，导入路由表（这边将路由表单独拿出来配置，避免后续修改路由逻辑时，路由表夹杂其中，混淆不清）：
```
import Vue from 'vue'
import Router from 'vue-router'
import staticRouter from './staticRouter'

Vue.use(Router)

const router = new Router({
  base: process.env.BASE_URL,
  routes: staticRouter
})

export default router

```

3. 此时你已经配置好了路由，本地浏览器输入对应URL即可看到相关页面：

登录页面：[http://localhost:8080/#/login](http://localhost:8080/#/login)

<img :src="$withBase('/assets/img/vue-llplatform/login-login.png')" />

注册页面：[http://localhost:8080/#/register](http://localhost:8080/#/register)

<img :src="$withBase('/assets/img/vue-llplatform/login-register.png')" />

## 附录
推荐一个网址，可以找到许多纯由html + css + js编写的有趣的特效页面：[https://codepen.io/](https://codepen.io/)，你可以把它引入到你的页面中。

如我基于[yeti login](https://codepen.io/dsenneff/pen/2c3e5bc86b372d5424b00edaf4990173)，
修改了登录页面（具体代码[见此](https://github.com/linjinze999/vue-llplatform/tree/vue-cli3/llplatform/src/views/login/AppLogin.vue)）：
::: warning 注意
需执行`npm install gsap -S`。且最终代码已国际化。
:::

<img :src="$withBase('/assets/img/vue-llplatform/login-login2.gif')" />
