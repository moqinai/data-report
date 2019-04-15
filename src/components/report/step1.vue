<template>
  <div>
    <a-spin :spinning="spinning" delayTime="500">
      <a-form style="max-width: 800px; margin: 40px auto 0;" :form="form">
        <a-form-item label='报表名称' :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
          <a-input
            ref="reportName"
            v-decorator="['reportName', { rules: [{ required: true, message: '请输入报表名称' }]}]"
            placeholder="报表名称"
          />
        </a-form-item>
        <a-form-item label="数据源" :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
          <a-select
            ref="reportResourceId"
            @change="dataSourceSelectChange"
            v-decorator="['reportResourceId', { rules: [{ required: true, message: '请选择数据源' }]}]"
            placeholder="请选择数据源"
          >
            <a-select-option value="">请选择数据源</a-select-option>
            <a-select-option v-for="(item, i) in dataSourceList" :value="item.report_source_id" :key="i">{{item.link_name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数据主表" :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
          <a-select
            ref="mainTableId"
            :disabled="selectDisabled"
            @change="mainTableIdChange"
            placeholder="数据主表"
            v-decorator="['mainTableId', { initialValue: dataSourceSelect, rules: [{ required: true, message: '请选择数据主表' }]}]"
          >
            <a-select-option value="">请选择数据主表</a-select-option>
            <a-select-option v-for="(item, i) in dataTab" :value="item.id" :key="i">{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关联表" :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
          <a-button type="primary" :disabled="joinBtnDis" @click="showModel" ref="joinArr"> + </a-button>
        </a-form-item>
        <a-form-item :wrapperCol="{span: 15, offset: 5}">
          <template v-for="(item, i) in aTagDatas">
            <a-tag :key="i" :closable="(i+1) === aTagDatas.length" :afterClose="() => aTagClose(i)" color="blue">关联表：{{item.joinTableName}}</a-tag>
          </template>
        </a-form-item>
        <a-form-item :wrapperCol="{span: 15, offset: 5}">
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
    <!-- 弹窗层 -->
    <a-modal
      :visible="visible"
      :title="title"
      okText='确认'
      cancelText='取消'
      @cancel="handleCancel"
      @ok="handleCreate">
      <a-form ref="collectionForm" :form="modelForm">
        <a-form-item label="关联表" :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
          <a-select
            allowClear
            showSearch
            :filterOption="filterOption"
            ref="joinTableId"
            @change="joinTableIdSelectChange"
            v-decorator="['joinTableId', { rules: [{ required: true, message: '请选择关联表' }]}]"
            placeholder="选择关联表">
            <a-select-option value="">选择关联表</a-select-option>
            <a-select-option v-for="(item, i) in dataTab" :value="item.id" :key="i">{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关联字段" :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
          <a-select
            allowClear
            showSearch
            :filterOption="filterOption"
            ref="joinFieldId"
            :disabled="joinTabFiledSelectDis"
            v-decorator="['joinFieldId', {  rules: [{ required: true, message: '请选择字段' }]}]"
            placeholder="选择关联表字段">
            <a-select-option value="">选择关联表字段</a-select-option>
            <a-select-option v-for="(item, i) in joinMainFieldIds" :value="item.id" :key="i">{{item.field_title + '/' + item.field_name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数据主表" :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
          <!-- <a-input :defaultValue="dataTabVal" ref="dataTabVal"/> -->
          <a-select
            allowClear
            showSearch
            :filterOption="filterOption"
            ref="mainTableIdModel"
            @change="modalDataZB"
            v-decorator="['mainTableId', { rules: [{ required: true, message: '请选择字段' }]}]"
            placeholder="请选择数据主表">
            <a-select-option value="">请选择数据主表</a-select-option>
            <a-select-option v-for="(item, i) in mainTableIdModel" :value="item.id" :key="i">{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="主表字段" :labelCol="modelCol.label" :wrapperCol="modelCol.wrapper">
          <a-select
            allowClear
            showSearch
            :filterOption="filterOption"
            ref="mainFieldId"
            :disabled="zbFiledSelectDis"
            v-decorator="['mainFieldId', { rules: [{ required: true, message: '请选择主表字段' }]}]"
            placeholder="选择主表字段">
            <a-select-option value="">选择主表字段</a-select-option>
            <a-select-option v-for="(item, i) in zbFieldIds" :value="item.id" :key="i">{{item.field_title + '/' + item.field_name}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getQueryString } from '@/libs/util'
export default {
  name: 'step1',
  data () {
    return {
      spinning: true,
      modelCol: {
        label: { span: 5 },
        wrapper: { span: 15 }
      },
      selectDisabled: true, // 数据主表是否可选
      joinTabFiledSelectDis: true, // 关联字段是否可选
      zbFiledSelectDis: true, // 、主表字段是否可选
      dataTab: [], // 存放根据数据源请求来的数据主表和弹窗中的关联表
      aTagDatas: [], // 存储关联表
      joinArr: [], // 存储关联表
      visible: false, // 控制模态框
      joinBtnDis: true, // 关联表+按钮
      mainTabIdsArr: [], // 存放数据主表选中的id
      madinTabId: 0, // 选中的数据主表id
      mainTableIdModel: [], // 存放带入到弹窗数据主表中回显的内容
      joinMainFieldIds: [], // 存放关联字段、
      zbFieldIds: [], // 存放主表字段
      reportId: '',
      title: '新增关联表', // modal  title
      dataSourceSelect: ''
    }
  },
  props: {
    dataSourceList: Array // 从父组件接收数据源
  },
  beforeCreate () { // 挂载前创建ant form
    this.form = this.$form.createForm(this) // 定义搜索form
    this.modelForm = this.$form.createForm(this) // 定义modalform
  },
  created () {
    let id = getQueryString('reportId') // 获取从报表列表页带过来的id
    if (id) { // 编辑
      this.$post('custom/ReportManage/getReportMainInfo', { reportId: id }).then((res) => { // 请求表格数据
        if (res.state === 2000) {
          this.selectDisabled = false // 将数据主表禁用放开
          this.joinBtnDis = false // 将关联表按钮放开
          this.dataSourceSelect = res.data.mainTableId // 将数据主表赋值到initialValue配置项的字段中
          this.dataSourceSelectChange(res.data.reportResourceId)
          this.madinTabId = res.data.mainTableId // 替换存放数据主表id 用于modal框中的数据主表回显
          this.form.setFieldsValue({ 'reportName': res.data.reportName, 'reportResourceId': res.data.reportResourceId })
          this.aTagDatas = res.data.joinArr // 赋值关联表回显
          this.joinArr = Object.assign(this.joinArr, res.data.joinArr) // 深度拷贝
          this.spinning = false // 关闭加载动画
        } else {
          this.spinning = false // 关闭加载动画
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('请求失败', 3) // 弹出错误message
        }
        this.spinning = false // 关闭加载动画
      })
    } else {
      this.spinning = false // 关闭加载动画
    }
  },
  methods: {
    dataSourceSelectChange (val) { // 数据源下拉框改变事件
      if (val) {
        this.$post('custom/Modelcon/getModelBySourceId', { report_source_id: val }).then((res) => { // 请求表格数据
          if (res.state === 2000) {
            this.selectDisabled = false
            // this.selectDisabled = false
            this.dataTab = res.data
            this.modelForm.resetFields(['mainTableId']) // 重置主表字段
          } else {
            this.dataTab = []
            this.$message.error(res.message, 3) // 弹出错误message
          }
        }).catch((err) => {
          if (err.code === 'ECONNABORTED') {
            this.$message.error('请求超时', 3) // 弹出错误message
          }
          this.dataTab = []
          this.$message.error('请求失败', 3) // 弹出错误message
        })
      }
    },
    mainTableIdChange (val) { // 数据主表下拉框改变事件
      if (val) {
        this.joinBtnDis = false
        this.madinTabId = val // 替换存放数据主表id
        /* if (this.mainTabIdsArr.indexOf(val) === -1) { // 如果其中不包含其中选中的，则push
          this.mainTabIdsArr.push(val)
        } */
      } else {
        this.joinBtnDis = true
      }
    },
    joinTableIdSelectChange (val) { // 关联表改变事件
      if (val) {
        this.$get('custom/Attribute/getFileldsByModelId', { model_id: val }).then((res) => { // 请求表格数据
          if (res.state === 2000) {
            this.joinTabFiledSelectDis = false // 解除禁用
            this.joinMainFieldIds = res.data // 重新赋值
            this.modelForm.resetFields(['joinFieldId']) // 重置关联字段
          } else {
            this.joinMainFieldIds = []
            this.$message.error(res.message, 3) // 弹出错误message
          }
        }).catch((err) => {
          if (err.code === 'ECONNABORTED') {
            this.$message.error('请求超时', 3) // 弹出错误message
          } else {
            this.$message.error('请求失败', 3) // 弹出错误message
          }
        })
      }
    },
    modalDataZB (val) { // modal中数据主表改变事件
      if (val) {
        this.$get('custom/Attribute/getFileldsByModelId', { model_id: val }).then((res) => { // 请求表格数据
          if (res.state === 2000) {
            this.zbFiledSelectDis = false
            this.zbFieldIds = res.data
            this.modelForm.resetFields(['mainFieldId']) // 重置主表字段
          } else {
            this.zbFieldIds = []
            this.$message.error(res.message, 3) // 弹出错误message
          }
        }).catch((err) => {
          if (err.code === 'ECONNABORTED') {
            this.$message.error('请求超时', 3) // 弹出错误message
          } else {
            this.$message.error('请求失败', 3) // 弹出错误message
          }
        })
      }
    },
    aTagClose (v) { // 关联表tag关闭后回调
      /* console.log(this.aTagDatas)
      const tags = this.aTagDatas.filter((tag:any) => tag.mainTableId !== this.aTagDatas[v].mainTableId)
      console.log(tags)
      this.aTagDatas = tags */
      this.aTagDatas.splice(v, 1) // 关闭则删除指定位置的数据
      this.joinArr.pop() // 删掉最后一个
    },
    nextStep () { // 下一步
      this.form.validateFields((err, values) => {
        if (!err) {
          values.joinArr = this.joinArr // 设置关联表数据
          if (getQueryString('reportId')) { // 如果是编辑
            values.type = 'edit'
            values.reportId = getQueryString('reportId')
          }
          this.$post('custom/ReportManage/saveStepOne', values).then((res) => { // 请求表格数据
            if (res.state === 2000) {
              this.reportId = res.data.reportId
              this.$emit('reportId', this.reportId) // 子传父方法
              setTimeout(() => {
                this.$emit('nextStep')
              }, 100)
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
        }
      })
    },
    showModel () { // 模态框
      this.visible = true
      this.dataTab.forEach((v, i) => { // 处理附带数据主表 数据
        if (v.id === this.madinTabId) { // 相同给的则不带过去
          if (JSON.stringify(this.mainTableIdModel).indexOf(JSON.stringify(v)) === -1) {
            this.mainTableIdModel.push(v)
          }
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.joinTabFiledSelectDis = true // 将关联字段选择重置为不可选
      this.zbFiledSelectDis = true // 将主表字段充值为不可选
      this.modelForm.resetFields() // 重置输入控件的值
    },
    handleCreate (e) { // 模态框点击确认
      e.preventDefault()
      this.modelForm.validateFields((err, values) => {
        if (!err) {
          this.joinArr.push(values) // 存放进要提交的
          let tableId = values.joinTableId // 关联表id
          this.dataTab.forEach((item, ind) => {
            if (tableId === item.id) {
              // _thisValues.title = item.title
              let _thisValues = Object.assign({ joinTableName: item.title }, values)
              this.aTagDatas.push(_thisValues) // 存放进要回显的
            }
          })
          this.joinTabFiledSelectDis = true // 将关联字段选择重置为不可选
          this.zbFiledSelectDis = true // 将主表字段选择重置为不可选
          this.modelForm.resetFields() // 重置表单
          this.visible = false
        }
      })
    },
    filterOption (input, option) { // 搜索框输入搜索 过滤方法
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
.spin-content{
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
</style>
