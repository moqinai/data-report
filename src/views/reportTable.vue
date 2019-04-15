<template>
<div>
  <a-card :title="reportName" :bordered="false"></a-card>
  <div class="reportTable" id="components-form-demo-advanced-search">
    <a-form layout='inline' class="ant-advanced-search-from" :form="form" @submit="handleSearch" v-if="search.length">
      <a-row :gutter="24">
        <a-col :span="8" v-for="(item, i) in search" :key="i">
          <a-form-item>
            <a-input
              v-if="item.searchType === 'string'"
              v-decorator="[item.searchName, { rules: [{ required: false}] }]"
              :placeholder="item.showTitle" />
            <a-input
              v-if="item.searchType === 'num'"
              v-decorator="[item.searchName, { rules: [{ required: false}] }]"
              :placeholder="item.showTitle" />
            <a-select
              v-decorator="[item.searchName, { rules: [{ required: false}] }]"
              v-if="item.searchType === 'select'"
              showSearch
              allowClear
              :filterOption="filterOption"
              :placeholder="item.showTitle">
              <a-select-option v-for="(par, index) in item.searchParam" :key="index" :value="par.value">{{par.title}}</a-select-option>
            </a-select>
            <a-select
              v-decorator="[item.searchName, { rules: [{ required: false}] }]"
              v-if="item.searchType === 'checkbox'"
              mode="multiple"
              showSearch
              allowClear
              :filterOption="filterOption"
              :placeholder="item.showTitle">
              <a-select-option v-for="(par, index) in item.searchParam" :key="index" :value="par.value">{{par.title}}</a-select-option>
            </a-select>
            <a-range-picker
              v-if="item.searchType === 'date'"
              v-decorator="[item.searchName, { rules: [{ required: false}] }]"
              :placeholder="[item.showTitle+'开始', item.showTitle+'结束']"
              format="YYYY-MM-DD"/>
            <a-range-picker
              v-if="item.searchType === 'datetime'"
              v-decorator="[item.searchName, { rules: [{ required: false}] }]"
              :placeholder="[item.showTitle+'开始', item.showTitle+'结束']"
              :showTime="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'right' }">
          <a-button type="primary" html-type="submit" :loading="searchLoading">搜索</a-button>
          <a-button @click="handleReset" :style="{ marginLeft: '8px' }">重置</a-button>
        </a-col>
      </a-row>
    </a-form>
    <div class="operation">
      <a-row>
        <a-col :span="24" :style="{ textAling: 'right'}">
          <a-button type="primary" htmlType="button" @click.stop="exportFile" :loading="exportLoading">导出</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="search-result-list">
      <a-table :scroll="{x: true}" :columns="columns" :dataSource="data" bordered :pagination="pagination" @change="onChangeTab" :loading="loading" :rowKey="record => record.keyFlagId" />
    </div>
  </div>
</div>
</template>

<script>
import { getQueryString } from '@/libs/util'
export default {
  name: 'report',
  data () {
    return {
      searchLoading: false, // 搜索按钮加载效果
      loading: true, // 初始化显示loading加载动画
      modalBtn: true, // 控制新增编辑时确认按钮
      exportLoading: false, // 导出按钮
      reportName: '报表详情', // 报表名称
      columns: [], // 定义表格表头
      data: [], // 定义表格内容
      search: [], // 定义搜索条件
      reportId: 0,
      pagination: { // 定义分页数据
        current: 1,
        pageSize: 10,
        total: 1
      },
      searchParam: [] // 请求表格参数
    }
  },
  beforeCreate () { // 挂载前创建ant form
    this.form = this.$form.createForm(this) // 定义搜索form
  },
  created () {
    this.reportId = this.$route.query.reportId || getQueryString('reportId') // 获取传递过来的reportId
  },
  mounted () {
    let searchParam = { reportId: this.reportId, searchParam: '', pageSize: 10, nowpage: 1 }
    this.initDataFun(searchParam) // 请求表格数据
  },
  /* get searchFilter () { // computed计算属性， 过滤出不是时间类型的选项
      if (this.search.length) {
        return this.search.filter(item => item.searchType.indexOf('date') === -1)
      }
  } */
  methods: {
    initDataFun (searchParam) {
      this.loading = true
      this.$post('custom/Report/getReportDetail', searchParam).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          this.loading = false
          this.columns = res.data.columns
          this.data = res.data.data
          this.search = res.data.search
          this.data.map((v, i) => {
            v.keyFlagId = i
          })
          const pagination = { ...this.pagination }
          pagination.total = res.data.count
          this.pagination = pagination
          this.reportName = res.data.reportName
        } else {
          this.loading = false
          this.data = []
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('请求失败', 3) // 弹出错误message
        }
        this.loading = false
        this.data = []
      })
    },
    filterOption (input, option) { // 搜索框输入搜索 过滤方法
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    /* 搜索条件 */
    handleReset () { // 重置方法
      this.searchParam = []
      this.form.resetFields()
    },
    handleSearch (e) { // 搜索方法
      e.preventDefault()
      this.searchParam = []
      this.form.validateFields((err, values) => {
        this.search.map((v, i) => {
          let key = v.searchName.split('.')[0]
          let zhi = v.searchName.split('.')[1]
          let searchName = ''
          if (v.searchName === key + '.' + zhi) {
            searchName = values[key][zhi] || ''
            if (values[key][zhi]) {
              if (v.searchType === 'datetime') {
                const rangeValue = values[key][zhi]
                searchName = rangeValue[0].format('YYYY-MM-DD HH:mm') + ',' + rangeValue[1].format('YYYY-MM-DD HH:mm')
              } else if (v.searchType === 'date') {
                const rangeValue = values[key][zhi]
                searchName = rangeValue[0].format('YYYY-MM-DD') + ',' + rangeValue[1].format('YYYY-MM-DD')
              }
            }
            this.searchParam.push({ logic: v.logic, name: v.searchName, search_type: v.searchType, search_param: searchName })
          }
        })
        let searchParam = JSON.stringify(this.searchParam)
        if (!err) {
          let params = { reportId: this.reportId, searchParam: searchParam, pageSize: 10, nowpage: 1 }
          this.initDataFun(params)
        }
      })
    },
    onChangeTab (pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      let searchParam = JSON.stringify(this.searchParam) || ''
      let params = { reportId: this.reportId, searchParam: searchParam, nowpage: pagination.current, pageSize: pagination.pageSize }
      this.initDataFun(params)
      // this.reportParams = { reportId: this.reportId, searchParam: this.searchParam, nowpage: pagination.current, pageSize: pagination.pageSize }
    },
    exportFile () { // 导出
      let searchParam = this.searchParam.length ? JSON.stringify(this.searchParam) : ''
      // let params = { reportId: this.reportId, searchParam: searchParam }
      this.exportLoading = true
      const url = location.href.indexOf('test') !== -1 ? 'http://test.report.pxjy.com' : 'http://report.staff.pxjy.com'
      window.open(url + '/custom/Report/exportReport?reportId=' + this.reportId + '&searchParam=' + searchParam)
      let _this = this
      setTimeout(() => {
        _this.exportLoading = false
      }, 500)
      /* this.$post('custom/Report/exportReport', params).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          this.exportLoading = false
        } else {
          this.exportLoading = false
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
            this.$message.error('请求超时', 3) // 弹出错误message
          }
        this.exportLoading = false
        this.$message.error('导出请求失败', 3) // 弹出错误message
      }) */
    }
  }
}
</script>
<style lang='scss'>
.ant-card-head-title {
  font-weight: bolder;
}
.reportTable {
  margin: 10px;
  .ant-form {
    max-width: none;
  }
  .ant-advanced-search-from{
    padding: 16px;
    background: #fbfbfb;
    border-radius: 6px 6px 0 0;
    .ant-form-item {
      display: flex;
      /* .ant-form-item-label {
        flex: 0 0 88px;
      } */
      .ant-form-item-control-wrapper {
        flex: 1;
        .ant-calendar-picker {
          width: 100%;
        }
      }
    }
  }
  .operation {
    padding: 10px;
  }
  .search-result-list {
    border-radius: 0 0 6px 6px;
    background-color: #fafafa;
    min-height: 200px;
    padding: 10px;
  }
}
</style>
