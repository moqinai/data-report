<template>
  <div ref="echart" style="width:700px;height: 500px">
  </div>
</template>
<script>
import echarts from 'echarts'

require('echarts/lib/chart/line')
// 引入提示框和标题组件
// require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  // @Prop()private datas!: any
  name: 'AreaBasic',
  props: {
    datas: Object
  },
  mounted () {
    this.$get(this.datas.url, this.datas.data).then((r) => {
      if (Object.prototype.toString.call(r).slice(8, -1) === 'Array') {
        let xAxisData = []
        let seriesData = []

        r.forEach((v) => {
          xAxisData.push(v.x)
          seriesData.push(v.y)
        })
        this.drawChartAreaBasic(xAxisData, seriesData)
      }
    })
  },
  drawChartAreaBasic (xAxisData, seriesData) {
    console.log(xAxisData, seriesData)
    const myChart = echarts.init(this.$refs.echart) // ts  (this as any).$refs.echart as HTMLDivElement
    myChart.setOption({
      // tooltip: {
      //   show: false,
      //   trigger: 'axis'
      // },
      title: {
        left: 'left',
        text: '当日时点报名情况',
        textStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: 'normal',
          fontSize: 16
        }
      },
      calculable: true,
      grid: {
        x: 40,
        y: 60,
        x2: 30,
        y2: 50,
        borderWidth: 0
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: '#5b6678',
            width: 1
          }
        },
        axisLabel: {
          textStyle: {
            color: 'rgba(255, 255, 255, 0.6)'
          }
        },
        data: xAxisData
      }],
      yAxis: {
        type: 'value',
        name: '金额(元)',
        splitLine: { show: false },
        nameTextStyle: {
          color: 'rgba(255, 255, 255, 0.6)'
        },
        axisLine: {
          lineStyle: {
            color: '#5b6678',
            width: 1
          }
        },
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: 'rgba(255, 255, 255, 0.6)'
          }
        }
      },
      series: [
        {
          name: '',
          type: 'line',
          itemStyle: {
            color: '#2187be'
          },
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#2187be',
            width: 1
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(2,161,222,.9)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(255,255,255,0)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          },
          z: 1,
          data: seriesData
        }
      ]
    })
  }
}
</script>
