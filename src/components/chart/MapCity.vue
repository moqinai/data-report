<template>
  <div id="map" ref="echart" :style="{width:datas.w, height: datas.h}">
  </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts/lib/chart/map';
import 'echarts/map/js/china.js';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip'

export default {
	name: 'MapCity',
	props: {
    datas: Object
  },
	data () {
		return {
			baseUrl: process.env.BASE_URL
		}
	},
	watch: {
		datas: {
        handler (newVal, oldVal) {
          
        },
        deep: true,
        immediate: true
      } 
	},
	methods: {
		watchDatas () {
			if (!this.datas) return;
			this.$get(this.baseUrl+'json/'+this.datas.name+'.json').then((r) => {
				this.drawChartAreaBasic(r)
			})
		},
		drawChartAreaBasic (geoJson) {
			const myChart = echarts.init(this.$refs.echart)
			myChart.resize()
			echarts.registerMap('henan', geoJson);
			myChart.setOption({
				tooltip: {
					trigger: 'item',
					formatter: '{b}<br/>{c} (p / km2)'
				},
				visualMap: {
					min: 800,
					max: 50000,
					text: ['High', 'Low'],
					realtime: false,
					calculable: true,
					inRange: {
						color: ['lightskyblue', 'yellow', 'orangered']
					}
				},
				series: [
					{
						name: 'title',
						type: 'map',
						mapType: 'henan', // 自定义扩展图表类型
						itemStyle: {
							normal: { label: { show: true } },
							emphasis: { label: { show: true } }
						},
						data: [
							{ name: '金水区', value: 20057.34 },
							{ name: '中原区', value: 15477.48 }
						]
					}
				]
			}, true)
		}
	}
}
</script>
