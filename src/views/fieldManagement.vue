<template>
<div>
  <a-card title="模型管理/字段管理" :bordered="false"></a-card>
  <div class="dataOrigin" id="components-form-demo-advanced-search">
    <div class="operation">
      <a-row>
        <a-col :span="24" :style="{ textAling: 'right'}">
          <a-button type="primary" htmlType="button" :loading="addBtnLoading" @click="showModel">新增</a-button>
        </a-col>
      </a-row>
    </div>
    <!-- 表格 -->
    <div class="search-result-list">
      <a-table :scroll="{x: true}" :pagination="pagination" :loading="loading" @change="onChange" :columns="columns" :dataSource="data" bordered :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="record => record.id">
        <span slot="action" slot-scope="text, record">
          <a-button type="primary" size="small" :loading="editBtnLoading" :data-type="record.key" @click="editFun($event, record)">编辑</a-button>
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
        <a-form :form="modelForm">
          <a-form-item label='字段名' :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
            <a-input
              ref="field_name"
              v-decorator="['field_name', { initialValue: editDataEcho.field_name, rules: [{ required: true, message: '请输入字段名' }]}]"
              placeholder="字段名"
            />
          </a-form-item>
          <a-form-item label='字段标题' :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
            <a-input
              ref="field_title"
              v-decorator="['field_title', { initialValue: editDataEcho.field_title, rules: [{ required: true, message: '请输入字段标题' }]}]"
              placeholder="字段标题"
            />
          </a-form-item>
          <a-form-item label="字段类型" :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
            <a-select
              ref="field_type"
              placeholder="字段类型"
              v-decorator="['field_type', { initialValue: editDataEcho.field_type, rules: [{ required: true, message: '请选择字段类型' }]}]"
            >
              <a-select-option v-for="(item,i) in filedTypeData" :value="item.filed_type_value" :key="i">{{item.field_type}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label='参数' :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
            <a-textarea
              ref="extra"
              v-decorator="['extra', { initialValue: editDataEcho.extra, rules: [{ message: '请输入字段参数' }]}]"
              placeholder="参数"
            />
          </a-form-item>
        </a-form>
      </a-modal>
  </div>
</div>
</template>

<script>
export default {
  name: 'fieldManagement',
  data () {
    return {
      loading: true,
      visible: false, // 控制模态框
      modelCol: {
        label: { span: 8 },
        wrapper: { span: 12 }
      },
      columns: [
        { title: '编号', dataIndex: 'id', key: '' }, // fixed: 'left' 设置是否固定
        { title: '字段', dataIndex: 'field_title', key: '' },
        { title: '名称', dataIndex: 'field_name', key: '' },
        { title: '数据类型', dataIndex: 'field_type', key: '' },
        { title: '操作', dataIndex: '', key: '', width: '30%', scopedSlots: { customRender: 'action' } } // scopedSlots配置操作列
      ],
      model_id: '',
      modelTitle: '新增字段',
      data: [],
      filedlId: '', // 判断是新增或是编辑
      filedTypeData: [], // 字段列表
      editDataEcho: {},
      editBtnLoading: false,
      addBtnLoading: false,
      delBtnLoading: false,
      selectedRowKeys: [], // 存放表格选中的数据
      pagination: { // 定义分页数据
        current: 1,
        pageSize: 10,
        total: 1
      }
    }
  },
  beforeCreate () { // 挂载前创建ant form
    this.modelForm = this.$form.createForm(this) // 定义modalform
  },
  mounted () {
    this.model_id = this.$route.query.model_id
    let params = { model_id: this.model_id, pageSize: 10, nowpage: 1 }
    this.initDataFun(params) // 请求表格数据
    this.initFieldTypeFun() // 请求字段类型列表
  },
  methods: {
    initDataFun (params) { // 初始化请求列表
      this.loading = true
      this.$post('/custom/Attribute/filedsList', params).then((res) => { // 请求表格数据
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
    initFieldTypeFun () { // 初始化请求字段类型列表
      this.loading = true
      this.$get('/custom/Attribute/fieldType').then((res) => { // 请求表格数据
        if (res.state === 2000) {
          this.filedTypeData = res.data
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
    showModel () { // 模态框
      this.visible = !this.visible
      this.addBtnLoading = true
      // this.editBtnLoading = true
      this.modelTitle = '新增字段'
    },
    handleCancel () { // 隐藏模态框
      this.visible = false
      this.addBtnLoading = false
      this.editBtnLoading = false
      this.editDataEcho = {}
      this.modelForm.resetFields() // 重置输入控件的值
    },
    handleCreate (e) { // 新增编辑确认方法
      e.preventDefault()
      this.modelForm.validateFields((err, values) => {
        if (!err) {
          let params = values
          params.model_id = this.model_id // 传模型id
          const url = '/custom/Attribute/updateField'
          if (!this.filedlId) { // 新增
            this.addEditModelFun(params, url)
          } else {
            params.id = this.filedlId
            this.addEditModelFun(params, url)
          }
        }
      })
    },
    editFun (event, record) { // 点击编辑方法
      this.visible = true // 将模态框显示
      this.modelTitle = '编辑字段'
      this.filedlId = record.id // 字段id
      this.editBtnLoading = true
      this.editDataEcho = record // 将信息带过来回显
    },
    addEditModelFun (params, url) {
      this.$post(url, params).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          this.filedlId = '' // 将判断id重置为空
          this.editDataEcho = {}
          this.modelForm.resetFields() // 清空表单
          this.visible = !this.visible // 隐藏模态框
          this.addBtnLoading = false
          this.editBtnLoading = false
          this.$message.success(res.message, 3)
          let par = { model_id: this.model_id, nowpage: this.pagination.current, pageSize: this.pagination.pageSize }
          this.initDataFun(par)
        } else {
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('请求失败', 3)
        }
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onChange (pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      let params = { model_id: this.model_id, nowpage: pagination.current, pageSize: pagination.pageSize }
      this.initDataFun(params)
    },
    deleteFun (e, record) {
      e.preventDefault()
      this.delBtnLoading = !this.delBtnLoading
      let params = { field_id: record.id }
      this.showConfirm('提示', '确认要删除该字段么？', params)
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
      this.$get('custom/Attribute/del', params).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          let par = { model_id: this.model_id, nowpage: this.pagination.current, pageSize: this.pagination.pageSize }
          this.initDataFun(par)
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
