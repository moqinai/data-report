<template>
  <div>
    <a-card title="制作报表" :bordered="false"></a-card>
    <div class="reportmaking">
      <a-card :bordered="false" class="padding0">
      <a-steps class="steps" :current="current">
        <a-step title="填写库信息" />
        <a-step title="配置操作" />
      </a-steps>
      <div class="content">
        <keep-alive>
          <step1 v-if="current === 0" @reportId="reportIdEmit" :dataSourceList="dataSourceList" @nextStep="nextStep()"></step1>
        </keep-alive>
        <step2 v-if="current === 1" :reportId="reportId" @prevStep="prevStep"></step2>
        <!-- <step3 v-if="current === 2" @prevStep="prevStep" @finish="finish"></step3> -->
      </div>
    </a-card>
    </div>
  </div>
</template>

<script>
import Step1 from '@/components/report/step1.vue'
import Step2 from '@/components/report/step2.vue'

export default {
  name: 'statementMake',
  data () {
    return {
      current: 0,
      dataSourceList: [], // 存放数据源
      reportId: ''
    }
  },
  components: {
    Step1, Step2
  },
  created () {
    this.initDataFun()
  },
  methods: {
    reportIdEmit (val) { // step1 传过来的reportid
      console.log('父组件接收到的reportId' + val)
      this.reportId = val // 接收子组件传过来的参数，用于第二步请求
    },
    nextStep () { // 下一步
      if (this.current < 2) {
        this.current += 1
      }
    },
    prevStep () { // 上一步
      if (this.current > 0) {
        this.current -= 1
      }
    },
    /* finish ():void { // 配置完成，重新配置
      this.current = 0
    } */
    initDataFun () {
      this.$post('custom/Datasmanage/getAllSourrceList').then((res) => { // 请求表格数据
        if (res.state === 2000) {
          this.dataSourceList = res.data
        } else {
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('请求失败', 3) // 弹出错误message
        }
        this.dataSourceList = []
      })
    }
  }
}
</script>

<style lang='scss'>
.ant-card-head-title {
  font-weight: bolder;
}
.reportmaking {
  padding: 10px;
  border-radius: 6px;
  .padding0 {
    .ant-card-body {
      padding: 0!important;
     /*  height: calc(90vh - 130px);
      height: -webkit-calc(90vh - 130px); //chrome
      height: -moz-calc(90vh - 130px); //firefox */
    }
    .steps {
      max-width: 750px;
      margin: 16px auto;
    }
  }
}
</style>
