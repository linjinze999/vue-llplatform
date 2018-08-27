<template>
  <el-header class="header">
    <router-link to="/index">
      <div class="logo">
        <img src="../../assets/logo.png" class="image"/>
        LLPlatform
      </div>
    </router-link>
    <div class="content">
      <i class="fa fa-align-justify toggle"></i>
    </div>
    <el-dropdown trigger="hover" class="user">
      <span class="user-info">
        王小虎<i class="fa fa-user-circle-o fa-2x" style="margin-left: 10px"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>我的账号</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>

<script>
export default {
  name: 'the-header'
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
    box-sizing: border-box;
    color: #fff;
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
