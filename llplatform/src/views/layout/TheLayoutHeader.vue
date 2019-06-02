<template>
  <el-header class="header el-button--primary">
    <router-link to="/index">
      <div class="logo" :class="{'logo-hide': !openNav}">
        <img src="../../assets/logo.png" class="image"/>
        <span class="text">LLPlatform</span>
      </div>
    </router-link>
    <div class="content">
      <i class="el-icon-s-fold toggle" @click="navOpenToggle" :title="$t('header.toggleNavHide')" v-show="openNav"></i>
      <i class="el-icon-s-unfold toggle" @click="navOpenToggle" :title="$t('header.toggleNavShow')"
         v-show="!openNav"></i>
    </div>
    <div class="right max-right">
      <div class="right-item">
        <i class="el-icon-message" style="font-size: 18px;"></i>
        <el-badge :value="1" class="item"></el-badge>
      </div>
      <div class="right-item">
        {{ $t('header.themeChange') }}
        <theme-picker></theme-picker>
      </div>
      <div class="right-item" @click="clickLangue">
        <el-dropdown trigger="click" @command="changeLanguage" id="langDropDown">
          <p class="user-info">
            {{ $t('header.languageSelect') }}
            <i class="el-icon-arrow-down el-icon--right drop-icon" id="langDropIcon"></i>
          </p>
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
        <el-dropdown trigger="click">
          <p class="user-info">
            {{ user.name }}<i class="el-icon-s-custom" style="margin-left: 10px"></i>
          </p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/user/password">
                <el-link :underline="false">{{$t('header.modifyPass')}}</el-link>
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout()">
              {{$t('header.logout')}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="right min-right">
      <el-dropdown trigger="click" :hide-on-click="false">
        <p class="user-info">
          <i class="el-icon-s-custom"></i>
        </p>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            {{ user.name }}
          </el-dropdown-item>
          <el-dropdown-item divided>
            {{ $t('header.themeChange') }}
            <theme-picker></theme-picker>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-dropdown trigger="click" @command="changeLanguage" placement="left">
              <p class="user-info">
                {{ $t('header.languageSelect') }}
                <i class="el-icon-arrow-down el-icon--right drop-icon"></i>
              </p>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh-cn" :disabled="this.lang==='zh-cn'">
                  {{$t('header.langZh')}}
                </el-dropdown-item>
                <el-dropdown-item command="en" :disabled="this.lang==='en'">
                  {{$t('header.langEn')}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout()">
            {{$t('header.logout')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { mapState } from 'vuex'
import ThemePicker from '@/components/ThemePicker'

export default {
  name: 'TheLayoutHeader',
  props: ['openNav'],
  components: {
    ThemePicker
  },
  data () {
    const lang = localStorage.getItem('user-language') || 'zh-cn'
    return {
      langDrop: false,
      lang: lang
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    navOpenToggle () {
      this.$emit('toggle-open')
    },
    logout () {
      // do something
      this.$router.push('/login')
    },
    changeLanguage (language) {
      localStorage.setItem('user-language', language)
      this.$i18n.locale = language
      this.lang = language
    },
    clickLangue () {
      let langDropIcon = document.getElementById('langDropIcon')
      if (this.langDrop) {
        langDropIcon.style.transform = 'rotate(0deg)'
      } else {
        langDropIcon.style.transform = 'rotate(-180deg)'
      }
      this.langDrop = !this.langDrop
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  color: #ffffff;
  line-height: 60px;
  user-select: none;

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

    .text {
      color: #ffffff;
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
      font-size: 22px;
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
      font-size: 14px;
      cursor: pointer;

      .drop-icon {
        transition: transform 0.2s;
      }
    }

    .right-item:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .user-info {
      color: #ffffff;
    }
  }

  .min-right {
    display: none;
  }
}

@media (max-width: 768px) {
  .header {
    .logo {
      border: none;
      display: contents;

      .text {
        display: inline-block !important;
      }
    }

    .content {
      float: left;
      margin-left: -20px;
    }
  }

  .max-right {
    display: none !important;
  }

  .min-right {
    display: inline-block !important;
  }
}
</style>
