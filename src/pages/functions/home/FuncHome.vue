<template>
  <div class="m-home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="fa fa-tasks" style="color: #F56C6C;"></i>
          </div>
          <div class="m-content">
            <p>待办事项</p>
            <p class="m-count">{{ info.tasks }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="fa fa-envelope-o fa-fw" style="color: #E6A23C;"></i>
          </div>
          <div class="m-content">
            <p>系统消息</p>
            <p class="m-count">{{ info.message }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="fa fa-file-code-o" style="color: #67C23A;"></i>
          </div>
          <div class="m-content">
            <p>代码量</p>
            <p class="m-count">{{ info.code }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="fa fa-snowflake-o" style="color: #409EFF;"></i>
          </div>
          <div class="m-content">
            <p>天气</p>
            <p>{{ info.weather }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="18">
        <el-card class="m-box-card" shadow="hover">
          <div style="height: 400px;">
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="6">
        <el-row :gutter="20" align>
          <el-col :sm="12" :lg="24">
            <el-card class="m-box-card" shadow="hover" style="height: 215px;">
              <div slot="header">
                <p style="text-align: center">
                  <i class="fa fa-address-card-o" style="color: rgb(216, 151, 235);font-size: 35px;"></i>
                </p>
                <div style="padding-top: 10px;">
                  <p>账号：{{ user.name }}</p>
                  <p>时间：{{ user.loginTime }}</p>
                  <p>地址：{{ user.loginIp }}</p>
                </div>
              </div>
              <div style="font-size: 12px;">
                <p>上次登录时间：{{ user.lastTime }}</p>
                <p>上次登录地址：{{ user.lastIp }}</p>
              </div>
            </el-card>
          </el-col>
          <el-col :sm="12" :lg="24">
            <el-card class="m-box-card" shadow="hover">
              <div style="height: 215px; margin: -20px;">
                <vue-scroll>
                  <div style="padding: 20px;">
                    <p style="font-weight: bold;text-align: center">重要通知</p>
                    <p v-for="index in 20" :key="index">{{index}}. 这是一条通知；</p>
                  </div>
                </vue-scroll>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'FuncHome',
  data () {
    return {
      info: {
        tasks: parseFloat(12).toLocaleString(),
        message: parseFloat(6).toLocaleString(),
        code: parseFloat(5234).toLocaleString(),
        weather: '深圳，26℃，多云'
      },
      user: {
        name: '林锦泽',
        loginTime: '2018-01-05 12:00:00',
        loginIp: '172.28.12.34',
        lastTime: '2018-01-01 12:00:00',
        lastIp: '172.28.12.34'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.m-home {
  .m-box-card {
    margin-bottom: 10px;
    color: #666666;
    .m-icon {
      float: left;
      width: 60px;
      i {
        font-size: 40px;
      }
    }
    .m-content {
      margin-left: 60px;
      .m-count{
        font-size: 20px;
      }
    }
  }
}
</style>
