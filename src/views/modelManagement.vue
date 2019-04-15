<template>
<div>
  <a-card title="模型管理" :bordered="false"></a-card>
  <div class="dataOrigin" id="components-form-demo-advanced-search">
    <div class="operation">
      <a-row>
        <a-col :span="24" :style="{ textAling: 'right'}">
          <a-button type="primary" htmlType="button" @click="changeState('start')" :loading="startBtnLoading" :disabled="!hasSelected">启用</a-button>
          <a-button type="primary" htmlType="button" @click="changeState('forbiden')" :loading="forbidenBtnLoading" :disabled="!hasSelected">禁用</a-button>
          <a-button type="primary" htmlType="button" @click="showModel">生成</a-button>
        </a-col>
      </a-row>
    </div>
    <!-- 表格 -->
    <div class="search-result-list">
      <a-table bordered :scroll="{x: true}" :pagination="pagination" :loading="loading" @change="onChange" :columns="columns" :dataSource="data" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"><!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
        <span slot="action" slot-scope="text, record">
          <a-button type="primary" size="small" @click="editFun($event, record)">编辑</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" @click="go($event, record)">字段管理</a-button>
          <a-divider type="vertical" />
          <a-button type="primary" size="small" :loading="delBtnLoading" @click="deleteFun($event, record)">删除</a-button>
        </span>
      </a-table>
    </div>
     <!-- 弹窗层 -->
    <a-modal
        :visible="visible"
        :title="modelTitle"
        okText='确认'
        cancelText='取消'
        @cancel="handleCancel"
        @ok="handleCreate"
      >
        <a-form id="collectionForm" :form="modelForm">
          <a-form-item label='模型标识' :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
            <a-input
              ref="name"
              v-decorator="['name', { initialValue: editDataEcho.name, rules: [{ required: true, message: '请输入连接名' }]}]"
              placeholder="模型标识"
            />
          </a-form-item>
          <a-form-item label='模型名称' :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
            <a-input
              ref="title"
              v-decorator="['title', { initialValue: editDataEcho.title, rules: [{ required: true, message: '请输入数据库地址' }]}]"
              placeholder="模型名称"
            />
          </a-form-item>
          <a-form-item label="数据表" :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
            <a-select
              :disabled="selectDisabled"
              placeholder="数据表"
              v-decorator="['table', { initialValue: editDataEcho.table, rules: [{ required: true, message: '请选择数据表' }]}]"
              showSearch
              optionFilterProp="children"
              :filterOption="filterOption"
            >
              <a-select-option v-for="(item,i) in dbDataTabSelect" :value="item" :key="i">{{item}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
  </div>
</div>
</template>

<script>
import { getQueryString } from '@/libs/util'

export default {
  name: 'modelManagement',
  data () {
    return {
      loading: true,
      visible: false, // 控制模态框
      modelTitle: '生成模型',
      modelCol: { // 设置栅格比例
        label: { span: 8 },
        wrapper: { span: 12 }
      },
      columns: [
        { title: '编号', dataIndex: 'key' }, // fixed: 'left' 设置是否固定
        { title: '标识', dataIndex: 'name' },
        { title: '名称', dataIndex: 'title' },
        { title: '创建时间', dataIndex: 'create_time' },
        { title: '状态', dataIndex: 'status' },
        { title: '操作', dataIndex: '', width: '30%', scopedSlots: { customRender: 'action' } } // scopedSlots配置操作列
      ],
      data: [], // 表格内容数据
      selectedRowKeys: [], // 存放表格选中的数据key
      selectedRows: [], // 存放选中的表格的数据
      reportId: '', // 从数据源页带过来的id
      dbDataTabSelect: [], // 数据表
      selectDisabled: false, // 数据表下拉框是否禁用
      modelId: '', // 判断是新增或是编辑
      editDataEcho: {},
      delBtnLoading: false, // 删除按钮
      forbidenBtnLoading: false, // 禁用按钮
      startBtnLoading: false, // 启用按钮
      pagination: { // 定义分页数据
        current: 1,
        pageSize: 10,
        total: 1
      }
    }
  },
  beforeCreate () { // 挂载前创建ant form
    this.modelForm = this.$form.createForm(this) // 定义modelform
  },
  mounted () {
    this.reportId = getQueryString('reportId') || ''
    let params = { report_source_id: this.reportId, pageSize: 10, nowpage: 1 }
    this.initDataFun(params) // 请求表格数据
    this.initDbTabFun() // 请求数据表接口方法
  },
  methods: {
    initDataFun (params) {
      this.loading = true
      this.$post('/custom/Modelcon/modelList', params).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          const pagination = { ...this.pagination }
          // pagination.current = res.data.nowpage
          // pagination.pageSize = 10
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
    initDbTabFun () {
      this.$get('/custom/Modelcon/getTables', { report_source_id: this.reportId }).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          this.dbDataTabSelect = res.data
        } else {
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('数据表请求失败', 3)
        }
      })
    },
    // 表格选中与否改变事件
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onChange (pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      let params = { report_source_id: this.reportId, nowpage: pagination.current, pageSize: pagination.pageSize }
      this.initDataFun(params)
    },
    showModel () { // 模态框
      this.modelTitle = '生成模型'
      this.visible = true
    },
    handleCancel () { // 隐藏模态框
      this.visible = false
      this.selectDisabled = false // 模态框隐藏时将其重置
      this.modelId = '' // 将判断id重置为空
      this.editDataEcho = {}
      this.modelForm.resetFields() // 重置输入控件的值
    },
    handleCreate (e) { // 点击模态框确认方法
      e.preventDefault()
      this.modelForm.validateFields((err, values) => {
        if (!err) {
          let params = values
          if (!this.modelId) { // 新增
            params.report_source_id = this.reportId
            const url = '/custom/Modelcon/generate'
            this.addEditModelFun(params, url)
          } else {
            params.model_id = this.modelId
            delete params.table // 去掉table
            const url = '/custom/Modelcon/doEdit'
            this.addEditModelFun(params, url)
          }
        }
      })
    },
    addEditModelFun (params, url) { // 新增编辑方法
      this.$get(url, params).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          this.modelId = '' // 将判断id重置为空
          this.editDataEcho = {}
          this.modelForm.resetFields() // 清空表单
          this.visible = !this.visible // 隐藏模态框
          this.$message.success(res.message, 3)
          let par = { report_source_id: this.reportId, nowpage: this.pagination.current, pageSize: this.pagination.pageSize }
          this.initDataFun(par)
        } else {
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('请求失败', 3) // 弹出错误message
        }
      })
    },
    filterOption (input, option) { // select框搜索方法
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    editFun (event, record) { // 编辑方法
      this.visible = !this.visible // 将模态框显示
      this.modelTitle = '编辑模型'
      this.modelId = record.id
      this.editDataEcho = record // 将信息带过来回显
      this.selectDisabled = true
    },
    go (e, record) {
      e.preventDefault()
      // (this as any).changeOpenKeys({ openKeys: '2' }) // 设置要打开的key，如果是子节点则取其父key
      // window.open(window.location.origin + '/statementManagement') // 加上参数_target 表示只打开一个，重复点击会回到第一个打开的窗口
      this.$router.push({ path: '/fieldManagement', query: { model_id: record.id } }) // 字段管理
    },
    deleteFun (e, record) { // 删除方法
      e.preventDefault()
      this.delBtnLoading = !this.delBtnLoading
      let params = { model_id: record.id, type: 'del' }
      // this.changeStateFun(params)
      this.showConfirm('提示', '确认要删除该模型么？', params)
    },
    changeState (type) { // 启用 ，禁用方法
      let params = {}
      let content = ''
      if (type === 'forbiden') {
        this.forbidenBtnLoading = !this.forbidenBtnLoading
        content = '确认要禁用该模型么？'
        params = { model_id: this.selectedRowKeys.toString(), type: 'forbiden' }
      } else if (type === 'start') {
        this.startBtnLoading = !this.startBtnLoading
        content = '确认要启用该模型么？'
        params = { model_id: this.selectedRowKeys.toString(), type: 'start' }
      }
      this.showConfirm('提示', content, params)
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
          _this.changeStateFun(params)
        },
        onCancel () {
          if (params.type === 'del') {
            _this.delBtnLoading = !_this.delBtnLoading
          } else if (params.type === 'start') {
            _this.startBtnLoading = !_this.startBtnLoading
          } else if (params.type === 'forbiden') {
            _this.forbidenBtnLoading = !_this.forbidenBtnLoading
          }
        }
      })
    },
    changeStateFun (params) { // 改变状态方法
      this.$get('custom/Modelcon/ChangeStatus', params).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          let par = { report_source_id: this.reportId, nowpage: this.pagination.current, pageSize: this.pagination.pageSize }
          this.initDataFun(par)
          this.$message.success(res.message, 3)
          if (params.type === 'del') {
            this.delBtnLoading = !this.delBtnLoading
          } else if (params.type === 'start') {
            this.startBtnLoading = !this.startBtnLoading
          } else if (params.type === 'forbiden') {
            this.forbidenBtnLoading = !this.forbidenBtnLoading
          }
        } else {
          if (params.type === 'del') {
            this.delBtnLoading = !this.delBtnLoading
          } else if (params.type === 'start') {
            this.startBtnLoading = !this.startBtnLoading
          } else if (params.type === 'forbiden') {
            this.forbidenBtnLoading = !this.forbidenBtnLoading
          }
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (params.type === 'del') {
          this.delBtnLoading = !this.delBtnLoading
        } else if (params.type === 'start') {
          this.startBtnLoading = !this.startBtnLoading
        } else if (params.type === 'forbiden') {
          this.forbidenBtnLoading = !this.forbidenBtnLoading
        }
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('删除失败', 3)
        }
      })
    }
  },
  computed: {
    hasSelected () { // 计算属性方法，必须有返回值
      return this.selectedRowKeys.length > 0
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
  .operation {
    padding: 10px 10px;
    button {
      margin-right: 8px;
    }
  }
  .search-result-list {
    border-radius: 0 0 6px 6px;
    background-color: #fafafa;
    min-height: 200px;
    padding: 10px;
  }
}
</style>
