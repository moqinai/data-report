<template>
<div>
  <a-card title="报表管理" :bordered="false"></a-card>
  <div class="dataOrigin" id="components-form-demo-advanced-search">
    <a-form layout='inline' class="ant-advanced-search-from" :form="form">
      <a-form-item :span="24">
        <a-input
          ref="sourceName"
          v-decorator="['sourceName']"
          placeholder="连接名" />
      </a-form-item>
      <a-form-item :span="24">
        <a-input
          ref="reportName"
          v-decorator="['reportName']"
          placeholder="报表名称" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch" :loading="searchLoading">搜索</a-button>
      </a-form-item>
    </a-form>
    <div class="operation">
      <a-row>
        <a-col :span="24" :style="{ textAling: 'right'}">
          <a-button type="primary" htmlType="button" @click="go">新增</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="search-result-list">
      <a-table :scroll="{x: true}" :columns="columns" :dataSource="data" bordered :pagination="pagination" @change="onChange" :loading="loading" :rowKey="record => record.report_id">
        <span slot="action" slot-scope="text, record">
          <a-button type="primary" size="small" @click="go($event, record)">编辑</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" @click="look($event, record)">查看</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small">添加到菜单</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" :loading="delBtnLoading" @click="deleteFun($event, record)">删除</a-button>
        </span>
      </a-table>
    </div>
  </div>
</div>
</template>

<script>
import { getQueryString } from '@/libs/util'
export default {
  name: 'statementManagement',
  data () {
    return {
      searchLoading: false, // 搜索按钮加载效果
      loading: true, // 初始化显示loading加载动画
      visible: false, // 控制模态框
      modalBtn: true, // 控制新增编辑时确认按钮
      modelCol: { // 设置栅格比例
        label: { span: 8 },
        wrapper: { span: 12 }
      },
      columns: [ // 定义表格表头
        { title: '报表名称', dataIndex: 'report_name' }, // fixed: 'left' 设置是否固定
        { title: '报表数据源名称', dataIndex: 'report_resource_name' },
        { title: '报表主表名称', dataIndex: 'main_table_name' },
        { title: '操作', dataIndex: '', width: '40%', scopedSlots: { customRender: 'action' } } // scopedSlots配置操作列
      ],
      data: [], // 定义表格内容
      modelTitle: '新增报表',
      modelFormDatas: {},
      reportResourceId: '', // 数据源id
      pagination: { // 定义分页数据
        current: 1,
        pageSize: 10,
        total: 1
      },
      delBtnLoading: false // 删除按钮加载
    }
  },
  beforeCreate () { // 挂载前创建ant form
    this.form = this.$form.createForm(this) // 定义搜索form
    this.modelForm = this.$form.createForm(this) // 定义modelform
  },
  mounted () {
    /* let testConnectDatas = this.form.getFieldsValue()
    console.log(testConnectDatas) */
    this.reportResourceId = getQueryString('reportResourceId') || '' // 获取url中的数据源id，用来区分是否是由数据源管理中跳转过来
    let sourceName = this.$refs.sourceName.value || '' // 连接名
    let reportName = this.$refs.reportName.value || '' // 报表名
    let params = { reportResourceId: this.reportResourceId, reportName: reportName, sourceName: sourceName, pageSize: 10, nowpage: 1 }
    this.initDataFun(params) // 请求表格数据
  },
  methods: {
    initDataFun (params) { // 初始化查询数据表方法
      this.$post('custom/ReportManage/getReportList', params).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          const pagination = { ...this.pagination }
          this.loading = false // 关闭加载动画
          pagination.total = res.data.count
          this.data = res.data.data
          this.pagination = pagination
        } else {
          this.loading = false
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
    handleSearch (e) { // 搜索方法
      e.preventDefault()
      let sourceName = this.$refs.sourceName.value || '' // 连接名
      let reportName = this.$refs.reportName.value || '' // 报表名
      let params = { reportResourceId: this.reportResourceId, reportName: reportName, sourceName: sourceName, pageSize: 10, nowpage: 1 }
      this.initDataFun(params) // 请求表格数据
    },
    go (e, record) {
      e.preventDefault()
      let reportId = record ? record.report_id : '' // 报表id
      // 打开报表制作
      window.open(window.location.origin + '/statementMake?reportId=' + reportId) // _target 表示只打开一个，重复点击会回到第一个打开的窗口
    },
    look (e, record) { // 查看
      e.preventDefault()
      let reportId = record ? record.report_id : '' // 报表id
      // 打开报表详情
      window.open(window.location.origin + '/reportTable?reportId=' + reportId) // _target 表示只打开一个，重复点击会回到第一个打开的窗口
    },
    onChange (pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      let sourceName = this.$refs.sourceName.value || '' // 连接名
      let reportName = this.$refs.reportName.value || '' // 报表名
      let params = { reportResourceId: this.reportResourceId, reportName: reportName, sourceName: sourceName, nowpage: pagination.current, pageSize: pagination.pageSize }
      this.initDataFun(params) // 请求表格数据
    },
    deleteFun (e, record) {
      e.preventDefault()
      this.delBtnLoading = !this.delBtnLoading
      let params = { reportId: record.report_id }
      this.showConfirm('提示', '确认要删除该报表么？', params)
    },
    showConfirm (title, content, params) { // 弹出确认对话框
      let _this = this
      this.$confirm({
        title: title,
        content: content,
        okType: 'danger',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          _this.delFieldFun(params)
        },
        onCancel () {
          _this.delBtnLoading = !_this.delBtnLoading
        }
      })
    },
    delFieldFun (params) {
      this.$post('custom/ReportManage/delReport', params).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          let sourceName = this.$refs.sourceName.value || '' // 连接名
          let reportName = this.$refs.reportName.value || '' // 报表名
          let params = { reportResourceId: this.reportResourceId, reportName: reportName, sourceName: sourceName, pageSize: 10, nowpage: 1 }
          this.initDataFun(params) // 请求表格数据
          this.$message.success(res.message, 3)
          this.delBtnLoading = !this.delBtnLoading
        } else {
          this.delBtnLoading = !this.delBtnLoading
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('删除失败', 3)
        }
        this.delBtnLoading = !this.delBtnLoading
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.ant-card-head-title {
  font-weight: bolder;
}
.dataOrigin {
  margin: 10px;
  .ant-form {
    max-width: none;
  }
  .ant-advanced-search-from {
    padding: 16px;
    background: #fbfbfb;
    border-radius: 6px 6px 0 0;
  }
  .operation {
    padding: 10px 10px;
  }
  .search-result-list {
    border-radius: 0 0 6px 6px;
    background-color: #fafafa;
    min-height: 200px;
    padding: 10px;
  }
}
</style>
