<template>
  <el-header class="header">
    <router-link to="/index">
      <div class="logo" :class="{'logo-hide': !openNav}">
        <img src="../../assets/logo.png" class="image"/>
        <span class="text">LLPlatform</span>
      </div>
    </router-link>
    <div class="content">
      <i class="fa fa-outdent toggle" @click="navOpenToggle" :title="$t('header.toggleNav')" v-show="openNav"></i>
      <i class="fa fa-indent toggle" @click="navOpenToggle" :title="$t('header.toggleNav')" v-show="!openNav"></i>
    </div>
    <div class="right">
      <div class="right-item">
        <i class="fa fa-envelope-o fa-fw"></i>
        <el-badge :value="1" class="item"></el-badge>
      </div>
      <div class="right-item">
        <el-dropdown trigger="hover" @command="changeLanguage">
      <span class="user-info">
        {{ $t('header.languageSelect') }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh-cn" :disabled="this.lang==='zh-cn'">
              {{$t('header.langZh')}}
            </el-dropdown-item>
            <el-dropdown-item command="en" :disabled="this.lang==='en'">
              {{$t('header.langEn')}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="right-item">
        <el-dropdown trigger="hover">
      <span class="user-info">
        {{ user_name }}<i class="fa fa-user-o" style="margin-left: 10px"></i>
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/user/password">{{$t('header.modifyPass')}}</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/user/theme">{{$t('header.modifyTheme')}}</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <router-link to="/login">{{$t('header.logout')}}</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'TheLayoutHeader',
  props: ['openNav'],
  data () {
    const user_info = JSON.parse(sessionStorage.getItem('user-info'))
    const user_name = user_info['name']
    const lang = localStorage.getItem('user-language') || 'zh-cn'
    return {
      user_name: user_name,
      lang: lang
    }
  },
  methods: {
    navOpenToggle () {
      this.$emit('toggle-open')
    },
    changeLanguage (language) {
      localStorage.setItem('user-language', language)
      this.$i18n.locale = language
      this.lang = language
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
  .right {
    float: right;
    .right-item {
      display: inline-block;
      padding: 0 10px;
      min-width: 60px;
      text-align: center;
      cursor: pointer;
    }
    .right-item:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
    .user-info {
      color: #ffffff;
    }
  }
}
</style>
