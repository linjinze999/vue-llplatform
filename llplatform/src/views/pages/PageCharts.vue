<template>
  <div>
    <el-card>
      {{$t('else.learn')}}
      <a href="https://v-charts.js.org/#/" style="color: #409eff">v-charts</a><br/>
      {{$t('else.example')}}
      <a href="https://github.com/linjinze999/vue-llplatform/blob/vue-cli3/llplatform/src/views/pages/PageCharts.vue"
         style="color: #409eff" target="_blank">
        https://github.com/linjinze999/vue-llplatform/blob/vue-cli3/llplatform/src/views/pages/PageCharts.vue
      </a>
    </el-card>
    <br/>
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('charts.line')" name="first" :lazy="true">
          <el-card shadow="hover">
            <ve-line :data="chartData" :settings="chartSettings"></ve-line>
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('charts.bar')" name="second" :lazy="true">
          <el-card shadow="hover">
            <ve-histogram :data="chartData2" :settings="chartSettings2"></ve-histogram>
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('charts.gauge')" name="third" :lazy="true">
          <el-card shadow="hover">
            <ve-gauge
              :data="chartData3"
              background-color="#000"
              :settings="chartSettings3">
            </ve-gauge>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import VeGauge from 'v-charts/lib/gauge.common'

export default {
  name: 'PageCharts',
  components: {
    VeLine,
    VeHistogram,
    VeGauge
  },
  data () {
    return {
      activeName: 'first',
      chartData: {
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
      chartSettings: {
        axisSite: { right: ['下单率'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['数值', '比率']
      },
      chartData2: {
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
      chartSettings2: {
        axisSite: { right: ['下单率'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['数值', '比率']
      },
      chartData3: {
        columns: ['type', 'value'],
        rows: [
          { type: '速度', value: 60 },
          { type: '转速', value: 80 },
          { type: '油表', value: 6000 }
        ]
      },
      chartSettings3: {
        dataName: {
          '速度': 'km/h',
          '转速': 'x1000 r/min',
          '油表': 'gas'
        },
        seriesMap: {
          '速度': {
            min: 0,
            max: 220,
            splitNumber: 11,
            radius: '50%',
            axisLine: {
              lineStyle: {
                color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                width: 3,
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            axisLabel: {
              textStyle: {
                fontWeight: 'bolder',
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            axisTick: {
              length: 15,
              lineStyle: {
                color: 'auto',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            splitLine: {
              length: 25,
              lineStyle: {
                width: 3,
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            pointer: {
              shadowColor: '#fff',
              shadowBlur: 5
            },
            title: {
              textStyle: {
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: 'rgba(30,144,255,0.8)',
              borderWidth: 1,
              borderColor: '#fff',
              shadowColor: '#fff',
              shadowBlur: 5,
              offsetCenter: [0, '50%'],
              textStyle: {
                fontWeight: 'bolder',
                color: '#fff'
              }
            }
          },
          '转速': {
            center: ['10%', '55%'],
            radius: '25%',
            min: 0,
            max: 7,
            endAngle: 45,
            splitNumber: 7,
            axisLine: {
              lineStyle: {
                color: [[0.29, 'lime'], [0.86, '#1e90ff'], [1, '#ff4500']],
                width: 2,
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            axisLabel: {
              textStyle: {
                fontWeight: 'bolder',
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            splitLine: {
              length: 20,
              lineStyle: {
                width: 3,
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            pointer: {
              width: 5,
              shadowColor: '#fff',
              shadowBlur: 5
            },
            title: {
              offsetCenter: [0, '-30%'],
              textStyle: {
                fontWeight: 'bolder',
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            detail: {
              borderColor: '#fff',
              shadowColor: '#fff',
              shadowBlur: 5,
              width: 80,
              height: 30,
              offsetCenter: [25, '20%'],
              textStyle: {
                fontWeight: 'bolder',
                color: '#fff'
              }
            }
          },
          '油表': {
            center: ['84%', '50%'],
            radius: '30%',
            min: 0,
            max: 2,
            startAngle: 135,
            endAngle: 45,
            splitNumber: 2,
            axisLine: {
              lineStyle: {
                color: [[0.2, 'lime'], [0.8, '#1e90ff'], [1, '#ff4500']],
                width: 2,
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            axisLabel: {
              textStyle: {
                fontWeight: 'bolder',
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              },
              formatter: function (v) {
                switch (v + '') {
                  case '0':
                    return 'E'
                  case '1':
                    return 'Gas'
                  case '2':
                    return 'F'
                }
              }
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 3,
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            pointer: {
              width: 2,
              shadowColor: '#fff',
              shadowBlur: 5
            },
            title: {
              show: false
            },
            detail: {
              show: false
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
