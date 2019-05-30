<template>
  <div class="m-home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="el-icon-set-up" style="color: #F56C6C;"></i>
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
            <i class="el-icon-message" style="color: #E6A23C;"></i>
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
            <i class="el-icon-document" style="color: #67C23A;"></i>
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
            <i class="el-icon-sunrise-1" style="color: #409EFF;"></i>
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
          <ve-line :data="chartData1" :settings="chartSettings1"></ve-line>
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="6">
        <el-row :gutter="20" align>
          <el-col :sm="12" :lg="24">
            <el-card class="m-box-card" shadow="hover"
                     style="height: 215px;background-color: rgb(143, 201, 251);color:#ffffff;">
              <div slot="header">
                <p style="text-align: center">
                  <i class="el-icon-user-solid" style="color: #F56C6C;font-size: 35px;"></i>
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
              <div style="height: 215px; margin: -20px;background-color: rgb(247, 151, 214);color:#ffffff;overflow: auto">
                <div style="padding: 20px;">
                  <p style="font-weight: bold;text-align: center">重要通知</p>
                  <p v-for="index in 20" :key="index">{{index}}. 帅哥/美女出没，请注意！</p>
                  <p>~(˘▾˘~)~(˘▾˘~)</p>
                  <p>对面的帅哥/美女，你好啊。</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12">
        <el-card class="m-box-card" shadow="hover" style="height: 300px;">
          <el-table :data="tableData2" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column prop="date" label="日期" width="130"></el-table-column>
            <el-table-column prop="name" label="姓名" width="80"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="12">
        <el-card class="m-box-card" shadow="hover" style="height: 300px">
          <p style="text-align: center;font-size: 25px;padding: 20px;">任务进度</p>
          <div class="m-task-box">
            <div class="m-task-text">语文：</div>
            <div class="m-task-pro">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="0"></el-progress>
            </div>
          </div>
          <div class="m-task-box">
            <div class="m-task-text">数学：</div>
            <div class="m-task-pro">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
            </div>
          </div>
          <div class="m-task-box">
            <div class="m-task-text">英语：</div>
            <div class="m-task-pro">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="80"
                           color="rgba(142, 113, 199, 0.7)"></el-progress>
            </div>
          </div>
          <div class="m-task-box">
            <div class="m-task-text">生物：</div>
            <div class="m-task-pro">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="100" status="success"></el-progress>
            </div>
          </div>
          <div class="m-task-box">
            <div class="m-task-text">地理：</div>
            <div class="m-task-pro">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="50" status="exception"></el-progress>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="m-box-card" shadow="hover">
          <ve-scatter :data="chartData2" :settings="chartSettings2"></ve-scatter>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import VeScatter from 'v-charts/lib/scatter.common'

export default {
  name: 'PageHome',
  components: {
    VeLine,
    VeScatter
  },
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
      },
      chartData1: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
          { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
          { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
          { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
          { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
          { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
        ]
      },
      chartSettings1: {
        axisSite: { right: ['下单率'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['数值', '比率']
      },
      chartData2: {
        columns: ['日期', '访问用户', '下单用户', '年龄'],
        rows: {
          '上海': [
            { '日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244 },
            { '日期': '1/2', '访问用户': 1223, '年龄': 6, '下单用户': 2344 },
            { '日期': '1/3', '访问用户': 7123, '年龄': 9, '下单用户': 3245 },
            { '日期': '1/4', '访问用户': 4123, '年龄': 12, '下单用户': 4355 },
            { '日期': '1/5', '访问用户': 3123, '年龄': 15, '下单用户': 4564 },
            { '日期': '1/6', '访问用户': 2323, '年龄': 20, '下单用户': 6537 }
          ],
          '北京': [
            { '日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244 },
            { '日期': '1/2', '访问用户': 1273, '年龄': 6, '下单用户': 2344 },
            { '日期': '1/3', '访问用户': 3123, '年龄': 15, '下单用户': 4564 },
            { '日期': '1/4', '访问用户': 2123, '年龄': 9, '下单用户': 3245 },
            { '日期': '1/5', '访问用户': 4103, '年龄': 12, '下单用户': 4355 },
            { '日期': '1/6', '访问用户': 7123, '年龄': 10, '下单用户': 3567 }
          ],
          '广州': [
            { '日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244 },
            { '日期': '1/2', '访问用户': 1223, '年龄': 6, '下单用户': 2344 },
            { '日期': '1/3', '访问用户': 2123, '年龄': 30, '下单用户': 3245 },
            { '日期': '1/5', '访问用户': 4123, '年龄': 12, '下单用户': 4355 },
            { '日期': '1/4', '访问用户': 5123, '年龄': 18, '下单用户': 4564 },
            { '日期': '1/6', '访问用户': 3843, '年龄': 30, '下单用户': 4850 }
          ]
        }
      },
      chartSettings2: {
        dimension: '日期',
        metrics: ['年龄', '下单用户']
      },
      tableData2: [{
        date: '2013-07-21',
        name: '张三',
        address: '你是我的小苹果'
      }, {
        date: '2014-12-24',
        name: '李四',
        address: '怎么爱你都不嫌多'
      }, {
        date: '2017-07-01',
        name: '王五',
        address: '有了滑板鞋'
      }, {
        date: '2018-09-03',
        name: '666',
        address: '天黑都不怕'
      }]
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
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

      .m-count {
        font-size: 20px;
      }
    }
  }

  .m-task-box {
    margin-bottom: 20px;

    .m-task-text {
      float: left;
      line-height: 16px;
    }

    .m-task-pro {
      margin-left: 60px;
    }
  }
}
</style>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
