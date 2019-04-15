<template>
  <div>
    <a-spin :spinning="spinning" delayTime="500">
      <div class="lpc-step2-content">
        <!-- leftTree -->
        <left-menu @treeDblData="treeMsg" :dataSourceTree="dataSourceTree"></left-menu>
        <!-- middletab -->
        <div class="lpc-centerTab">
          <a-tabs defaultActiveKey="1">
            <a-tab-pane key="1">
              <span slot="tab"><a-icon type="apple"/>报表设置</span>
              <div class="lpc-tab1-content">
                <div class="tab1-top">
                  <div class="tab1-top-header">
                    <h4>分组</h4>
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>删除所有分组</span>
                      </template>
                      <a-icon type="delete" @click.stop="deleteAllGroup('hang')"/>
                    </a-tooltip>
                  </div>
                  <div class="tab1-top-content">
                    <h4>组行</h4>
                    <a-select
                      showSearch
                      allowClear
                      placeholder="添加组行"
                      ref="handleChangeH"
                      style="width: 100%"
                      @change="handleChangeH"
                      v-if="!spinning"
                      :filterOption="filterOption"><!-- showSearch  -->
                      <!-- optionFilterProp:搜索时过滤对应的option属性，如设置为children表示对内嵌内容进行搜索 -->
                      <!-- <a-select-opt-group v-for="(source, index) in dataSourceTree" :key="index">
                        <span slot="label"><a-icon type="user"/>{{source.title}}</span>
                        <a-select-option v-for="(child, i) in source.children" :key="i" :value="child.id" v-if="child.title" >{{ child.title }}</a-select-option>
                      </a-select-opt-group> -->
                      <a-select-option :disabled="list.children ? true : false" :value="list.id" v-for="(list, index) in treeListFilter" :key="index" :class="list.children ? 'disabled' : ''"><a-icon type="smile" theme="twoTone" v-if="list.children"/>{{list.title}}</a-select-option>
                    </a-select>
                    <div class="task-content">
                      <draggable class="hang"> <!-- :options="dragOptions" @end="onEndHang" @update="onUpdateHang" -->
                        <p class="task-item" type="inner" v-for="(item, i) in aTagDatasH" :key="i" :title="item.text">
                          <span v-if="item.title.length > 15">{{item.title.substr(0, 15)}}...</span>
                          <span v-else>{{item.title}}</span>
                          <a-tooltip placement="right">
                            <template slot="title">
                              <span>删除</span>
                            </template>
                            <a-icon type="close" @click.stop="deleteGroupH(item, i)"/>
                          </a-tooltip>
                        </p>
                      </draggable>
                    </div>
                  </div>
                </div>
                <a-divider />
                <div class="tab1-bottom">
                  <div class="tab1-bottom-header">
                    <h4>列数</h4>
                    <a-dropdown :trigger="['click']">
                      <a class="ant-dropdown-link" href="#">
                        <a-icon type="down-square" />
                      </a>
                      <a-menu slot="overlay">
                        <!-- <a-menu-item key="0">
                          <a href="javascript(0)">添加存储器列</a>
                        </a-menu-item> -->
                        <a-menu-item key="1" :disabled="!aTagDatasH.length" @click="showFormulaModel"> <!-- 当组行为空时不能选 -->
                          <a href="javascript:void(0)">添加汇总公式</a>
                        </a-menu-item>
                        <a-menu-divider />
                        <a-menu-item key="3" @click="deleteAllGroup('lie')">删除所有列</a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </div>
                  <a-select
                    allowClear
                    showSearch
                    placeholder="添加组列"
                    optionFilterProp="children"
                    style="width: 100%"
                    @change="handleChangeL"
                    v-if="!spinning"
                    :filterOption="filterOption">
                    <a-select-option :disabled="list.children ? true : false" :value="list.id" v-for="(list, index) in treeListFilter" :key="index" :class="list.children ? 'disabled' : ''"><a-icon type="smile" theme="twoTone" v-if="list.children"/>{{list.title}}</a-select-option>
                    <!-- <a-select-opt-group v-for="(source, index) in dataSourceTreeFilter" :key="index">
                      <span slot="label"><a-icon type="user"/>{{source.title}}</span>
                      <a-select-option v-for="(child) in source.children" :key="child.id" :value="child.id" v-if="child.title">{{child.title}}</a-select-option>
                    </a-select-opt-group> -->
                  </a-select>
                  <div class="task-content">
                    <draggable class="lie"> <!--  :options="dragOptions" @end="onEndLie" @update="onUpdateLie" -->
                      <p class="task-item" type="inner" v-for="(item, i) in aTagDatasL" :key="i">
                        <span v-if="item.title.length > 15">{{item.title.substr(0, 15)}}...</span>
                        <span v-else>{{item.title}}</span>
                        <a-tooltip placement="right">
                          <template slot="title">
                            <span>删除</span>
                          </template>
                          <a-icon type="close" @click.stop="deleteGroupL(item, i)"/>
                        </a-tooltip>
                      </p>
                    </draggable>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab"><a-icon type="android"/>筛选</span>
              <div class="lpc-tab2-content">
                <div class="tab2-top-header">
                  <h4>固定筛选器</h4>
                  <!-- <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" href="#">
                      <a-icon type="down-square" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item key="0">
                        <a href="javascript(0)">添加筛选逻辑</a>
                      </a-menu-item>
                      <a-menu-item key="1">
                        <a href="javascript(0)">添加交叉筛选器</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown> -->
                </div>
                <a-select
                  allowClear
                  showSearch
                  placeholder="添加固有筛选"
                  optionFilterProp="children"
                  style="width: 100%"
                  @change="handleChangeF"
                  v-if="!spinning"
                  :filterOption="filterOption">
                  <a-select-option :disabled="list.children ? true : false" :value="list.id" v-for="(list, index) in treeListFilter" :key="index" :class="list.children ? 'disabled' : ''"><a-icon type="smile" theme="twoTone" v-if="list.children"/>{{list.title}}</a-select-option>
                  <!-- <a-select-opt-group v-for="(source, index) in dataSourceTree" :key="index">
                    <span slot="label"><a-icon type="user"/>{{source.title}}</span>
                    <a-select-option v-for="(child, i) in source.children" :key="i" :value="child.id">{{child.title}}</a-select-option>
                  </a-select-opt-group> -->
                </a-select>
                <div class="screening-content">
                  <a-popover arrowPointAtCenter placement="right" @visibleChange="visibleChangeFun" title="编辑筛选器" trigger="click" v-model="item.popover" :visible="item.popover" v-for="(item, i) in aTagDatasF" :key="i">
                    <div slot="content">
                      <p>{{item.title}}</p>
                      <div v-if="item.field_type == 'data'">
                        <a-form :form="dataForm">
                          <a-form-item label="时间范围">
                            <a-range-picker size="small" format="YYYY-MM-DD" v-decorator="['search_param', { initialValue: item.search_param, rules: [{ type: 'array', required: true, message: '请选择时间！' }]}]"/>
                          </a-form-item>
                        </a-form>
                      </div>
                      <div v-if="item.field_type == 'datetime'">
                        <a-form :form="datetimeForm">
                          <a-form-item label="时间范围">
                            <a-range-picker size="small" :showTime="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm" v-decorator="['search_param', { initialValue: item.search_param, rules: [{ type: 'array', required: true, message: '请选择时间！' }]}]"/>
                          </a-form-item>
                        </a-form>
                      </div>
                      <div v-if="item.field_type == 'num'">
                        <a-form :form="numberForm">
                          <a-form-item label="运算符">
                            <a-select labelInValue v-decorator="['search_logic', { initialValue: item.search_logic, rules: [{ required: false }]}]">
                              <a-select-option value="=">等于</a-select-option>
                              <a-select-option value="!=">不等于</a-select-option>
                              <a-select-option value="<">小于</a-select-option>
                              <a-select-option value=">">大于</a-select-option>
                              <a-select-option value="<=">小于等于</a-select-option>
                              <a-select-option value=">=">大于等于</a-select-option>
                            </a-select>
                          </a-form-item>
                          <a-form-item >
                            <a-input v-decorator="['search_param', { initialValue: item.search_param, rules: [{ required: false, message: '请输入数字！' }]}]"/>
                          </a-form-item>
                        </a-form>
                      </div>
                      <div v-if="item.field_type == 'string'">
                        <a-form :form="stringForm">
                          <a-form-item label="运算符">
                            <a-select labelInValue v-decorator="['search_logic', { initialValue: item.search_logic, rules: [{ required: false }]}]">
                              <a-select-option value="=">等于</a-select-option>
                              <a-select-option value="!=">不等于</a-select-option>
                              <a-select-option value="like">包含</a-select-option>
                              <a-select-option value="not like">不包含</a-select-option>
                            </a-select>
                          </a-form-item>
                          <a-form-item >
                            <a-input v-decorator="['search_param', { initialValue: item.search_param, rules: [{ required: false, message: '请输入字符串！' }]}]"/>
                          </a-form-item>
                        </a-form>
                      </div>
                      <div v-if="item.field_type == 'select'"> <!-- 单选 -->
                        <a-form :form="selectForm">
                          <a-form-item label="运算符">
                            <a-select labelInValue style="width: 250px" v-decorator="['search_logic', { initialValue: item.search_logic, rules: [{ required: false }]}]">
                              <a-select-option value="=">等于</a-select-option>
                              <a-select-option value="!=">不等于</a-select-option>
                            </a-select>
                          </a-form-item>
                          <a-form-item label="值">
                            <a-select labelInValue style="width: 250px" v-decorator="['search_param', { initialValue: item.search_param, rules: [{ required: false, message: '请选择值！' }]}]"
                              showSearch
                              allowClear
                              :filterOption="filterOption">
                              <a-select-option value="0">同步中</a-select-option>
                              <a-select-option value="1">不同</a-select-option>
                              <a-select-option value="2">已审核</a-select-option>
                              <a-select-option value="3">未找到</a-select-option>
                              <a-select-option value="4">未启用</a-select-option>
                              <a-select-option value="5">未比较</a-select-option>
                              <a-select-option value="">无选择</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-form>
                      </div>
                      <div v-if="item.field_type == 'checkbox'"> <!-- 多选 -->
                        <a-form :form="checkboxForm">
                          <a-form-item label="运算符">
                            <a-select labelInValue style="width: 250px" v-decorator="['search_logic', {initialValue: item.search_logic, rules: [{ required: false }]}]">
                              <a-select-option value="in">等于</a-select-option>
                              <a-select-option value="not in">不等于</a-select-option>
                            </a-select>
                          </a-form-item>
                          <a-form-item label="值">
                            <a-select labelInValue mode="multiple" v-decorator="['search_param', {initialValue: item.search_param,  rules: [{ required: false, message: '请选择值！' }]}]"
                              showSearch
                              allowClear
                              style="width: 250px"
                              :filterOption="filterOption">
                              <a-select-option value="0">同步中</a-select-option>
                              <a-select-option value="1">不同</a-select-option>
                              <a-select-option value="2">已审核</a-select-option>
                              <a-select-option value="3">未找到</a-select-option>
                              <a-select-option value="4">未启用</a-select-option>
                              <a-select-option value="5">未比较</a-select-option>
                              <!-- <a-select-option value="">无选择</a-select-option> -->
                            </a-select>
                          </a-form-item>
                        </a-form>
                      </div>
                      <div class="content-footer">
                        <a-button size="small" @click="hidePopover(item, i, 'F')">取消</a-button>
                        <a-button size="small" type="primary" @click="enterPopover(item, 'F')">应用</a-button>
                      </div>
                    </div>
                    <div class="screening-item" :class="{ 'active_item': item.popover }">
                      <div class="lpc-fixed-text">
                        <p class="title">{{item.title}}</p>
                        <p class="text">{{item.extra}}</p>
                      </div>
                      <a-tooltip placement="right"> <!-- 判断固定项不显示删除按钮 -->
                        <template slot="title">
                          <span>删除</span>
                        </template>
                        <a-icon type="close" @click.stop="deleteSearch(i, 'F')"/>
                      </a-tooltip>
                    </div>
                  </a-popover>
                </div>
                <a-divider />
                <div class="tab2-top-header">
                  <h4>显示筛选器</h4>
                </div>
                <a-select
                  showSearch
                  allowClear
                  placeholder="添加显示筛选"
                  optionFilterProp="children"
                  style="width: 100%"
                  v-if="!spinning"
                  @change="handleChangeX"
                  :filterOption="filterOption">
                  <a-select-option :disabled="list.children ? true : false" :value="list.id" v-for="(list, index) in treeListFilter" :key="index" :class="list.children ? 'disabled' : ''"><a-icon type="smile" theme="twoTone" v-if="list.children"/>{{list.title}}</a-select-option>
                  <!-- <a-select-opt-group v-for="(source, index) in dataSourceTree" :key="index">
                    <span slot="label"><a-icon type="user"/>{{source.title}}</span>
                    <a-select-option v-for="(child, i) in source.children" :key="i" :value="child.id">{{child.title}}</a-select-option>
                  </a-select-opt-group> -->
                </a-select>
                <div class="According-content">
                  <p class="task-item" type="inner" v-for="(item, i) in aTagDatasX" :key="i">
                    <span v-if="item.title.length > 15">{{item.title.substr(0, 15)}}...</span>
                    <span v-else>{{item.title}}</span>
                    <a-tooltip placement="right">
                      <template slot="title">
                        <span>删除</span>
                      </template>
                      <a-icon type="close" @click.stop="deleteSearch(i, 'X')"/>
                    </a-tooltip>
                  </p>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        <!-- rightTable -->
        <div class="lpc-rightTable">
          <div class="table-header">
            <div class="table-header-left">
          <!-- <a-input ref="titleName" v-if="titleNameEdit" :value="titleName" @change="e => titleNameEditFun(e.target.value)" style="width: 200px;"/>
              <template v-else>{{titleName}}</template>
              <div v-if="!titleNameEdit" class="header-icon">
                <a-icon type="edit" @click="editTitleName"></a-icon>
              </div>
              <div v-else class="header-icon">
                <a-icon type="check" @click="saveEditTitleName"></a-icon>
                <a-icon type="close" @click="cancelEditTitleName"></a-icon>
              </div> -->
            </div>
            <div class="table-header-right">
              <!-- <a-button type="primary" :loading="saveLoading" @click="saveFun">保存</a-button> -->
              <a-button type="primary" class="runBtn" :loading="runLoading" @click="runFun">运行</a-button>
            </div>
          </div>
          <div style="padding: 10px" class="tabSearch" id="components-form-demo-advanced-search" v-if="search.length">
            <a-form layout='inline' class="ant-advanced-search-from" :form="form" @submit="handleSearch">
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
                <!-- <a-col :span="12" v-for="(item, ind) in search">
                  <a-form-item :label="item.showTitle">
                  </a-form-item>
                </a-col> -->
              </a-row>
              <a-row>
                <a-col :span="24" :style="{ textAlign: 'right' }">
                  <a-button type="primary" html-type="submit" :loading="searchLoading">搜索</a-button>
                  <a-button @click="handleReset" :style="{ marginLeft: '8px' }">重置</a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div class="table-content" ref="tableContent">
            <a-table v-if="columns.length > 0" :pagination="pagination" @change="onChangeTab" :loading="tableLoading" :columns="columns" :dataSource="data" bordered :scroll="screenWidth" :rowKey="record => record.keyFlagId"></a-table>
            <div v-else class="noneIcon">
              <div>
                <a-icon type="table"/>
                <p>暂无数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-form class="lpc-form-footer">
        <a-form-item>
          <!-- <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button> -->
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
    <!-- 弹窗层 -->
    <a-modal
        :visible="showFormulaFlag"
        :title="showFormulaTitle"
        :confirmLoading="formulaCreateLoading"
        okText='确认'
        cancelText='取消'
        @cancel="formulaCancel"
        @ok="formulaCreate"
        class="formulaModal"
        ref="formulaModal"
      >
        <div class="modalContent">
          <div class="modalLeftTab">
            <a-tabs defaultActiveKey="1">
              <a-tab-pane tab="字段" key="1">
                <div class="leftMenu">
                  <div class="lpc-full">
                    <div class="header">
                      <a-input-search placeholder="搜索字段" @change="onChangeField" />
                    </div>
                    <div class="treeContent">
                      <a-tree
                        @expand="onExpandField"
                        :expandedKeys="expandedKeysField"
                        :autoExpandParent="autoExpandParentField"
                        :treeData="dataSourceTree"
                        @select="onselectTreeField"
                        ><!-- @select="selectTreeFun($event)" -->
                        <template slot="title" slot-scope="{title}">
                          <span v-if="title.indexOf(searchValueField) > -1">
                            {{title.substr(0, title.indexOf(searchValueField))}}
                            <span style="color: #f50">{{searchValueField}}</span>
                            {{title.substr(title.indexOf(searchValueField) + searchValueField.length)}}
                          </span>
                          <span v-else>{{title}}</span>
                        </template>
                      </a-tree>
                    </div>
                    <div class="footer">
                      <div>
                        <a-select style="width: 170px" v-model="fieldCalculate">
                          <a-select-option value="">无</a-select-option>
                          <a-select-option value="SUM">总和</a-select-option>
                          <a-select-option value="AVG">平均</a-select-option>
                          <a-select-option value="MIN">最小值</a-select-option>
                          <a-select-option value="MAX">最大值</a-select-option>
                        </a-select>
                        <a-button type="primary" :disabled="insertField" @click="insertFieldFun">插入 > </a-button>
                      </div>
                    </div>
                  </div>
                </div>
              </a-tab-pane>
              <a-tab-pane tab="函数" key="2">
                <a-spin :spinning="systeming" delayTime="500" size="small">
                  <div class="leftMenu">
                    <div class="lpc-full">
                      <div class="header">
                        <a-input-search placeholder="搜索函数" @change="onChangeFun" />
                      </div>
                      <div class="treeContent" :class="funcTree ? 'funcTree' : ''">
                        <a-tree
                          @expand="onExpandFun"
                          :expandedKeys="expandedKeysFun"
                          :autoExpandParent="autoExpandParentFun"
                          :treeData="funcTreeData"
                          @select="onSelectTreeFun"
                          ><!-- @select="selectTreeFun($event)" -->
                          <template slot="title" slot-scope="{title}">
                            <span v-if="title.indexOf(searchValueFun) > -1">
                              {{title.substr(0, title.indexOf(searchValueFun))}}
                              <span style="color: #f50">{{searchValueFun}}</span>
                              {{title.substr(title.indexOf(searchValueFun) + searchValueFun.length)}}
                            </span>
                            <span v-else>{{title}}</span>
                          </template>
                        </a-tree>
                      </div>
                      <div class="funcTreeMessage" v-show="funcTree">
                        <p :title="funData.func_sample" v-if="funData.func_sample" style="font-weight: 700">{{funData.func_sample}}</p>
                        <p :title="funData.func_desc" v-if="funData.func_desc.length > 60">{{funData.func_desc.substr(0, 60)}}...</p>
                        <p :title="funData.func_desc" v-else>{{funData.func_desc}}</p>
                      </div>
                      <div class="footer">
                        <div>
                          <a-button type="primary" style="margin-left: 191px" :disabled="insertFun" @click="insertFunFun">插入 > </a-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-spin>
              </a-tab-pane>
            </a-tabs>
          </div>
          <div class="modalRightTab">
            <a-tabs defaultActiveKey="1">
              <a-tab-pane tab="一般信息" key="1">
                <div class="message">
                  <a-form layout="vertical" :form="messageForm">
                    <a-form-item class="twoCol" label="列名称" :wrapper-col="{ span: 24 }">
                      <a-input name="col_title" v-decorator="['col_title', {rules: [{ required: true, message: '请输入列名称！' }]}]"/>
                    </a-form-item>
                    <a-form-item class="twoCol" label="描述" :wrapper-col="{ span: 24 }" style="margin-left: 20px">
                      <a-input name="col_desc" v-decorator="['col_desc', { initialValue: '', rules: [{ required: false }]}]"/>
                    </a-form-item>
                    <a-form-item label="公式" style="margin: 0; position: relative;">
                      <div class="editInsertButton">
                        <span @click.stop="symbolInsertFun('+')">+</span>
                        <span @click.stop="symbolInsertFun('-')">-</span>
                        <span @click.stop="symbolInsertFun('*')">*</span>
                        <span @click.stop="symbolInsertFun('/')">/</span>
                        <span @click.stop="symbolInsertFun('^')">^</span>
                        <span @click.stop="symbolInsertFun('(')">(</span>
                        <span @click.stop="symbolInsertFun(')')">)</span>
                      </div>
                      <a-textarea ref="formulaTextarea" placeholder="请在此键入公式。" :rows="10" @change="textareaChange($event)" v-decorator="['formula', { initialValue: formula, rules: [{ required: true, message: '请键入公式' }]}]"/>
                    </a-form-item>
                    <p class="errMsg" v-show="errMsgFlag"><a-icon type="warning" theme="twoTone" twoToneColor="#faad14"/>{{errMsg}}</p>
                    <div style="margin-bottom: 0">
                      <a-button v-show="grammarSuccess" @click.stop="checkGrammar" :loading="checkFormulaLoading">检查语法</a-button>
                      <p v-show="checkFormulaSuccess"><a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> 有效</p>
                    </div>
                  </a-form>
                </div>
              </a-tab-pane>
              <a-tab-pane tab="格式" key="2">
                <div class="message">
                  <a-form layout="vertical" :form="formatForm">
                    <a-form-item class="twoCol" label="格式" :wrapper-col="{ span: 24 }">
                      <a-select name="col_format" v-decorator="['col_format', {initialValue: 'num', rules: [{ required: false }]}]">
                        <a-select-option value="num">数字</a-select-option>
                        <a-select-option value="percent">百分比</a-select-option>
                        <a-select-option value="common">普通</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item class="twoCol" label="小数点" :wrapper-col="{ span: 24 }" style="margin-left: 20px">
                      <a-select name="decimal_num" v-decorator="['decimal_num', {initialValue: '0', rules: [{ required: false }]}]">
                        <a-select-option :key="i" v-for="(list, i) in 19" :value="i">{{i}}</a-select-option>
                      </a-select>
                    </a-form-item>
                    <!-- <a-form-item class="twoCol" label="此公式将在哪里应用?">
                      <a-radio-group v-model="radioValue">
                        <a-radio :value="0">所有汇总级别</a-radio>
                        <a-radio :value="1">仅限总合计</a-radio>
                        <a-radio :value="2">特定组</a-radio>
                      </a-radio-group>
                      <span v-if="radioValue === 2" style="margin-left: 20px">
                            <a-select name="specific" v-decorator="['specific', {initialValue: '0', rules: [{ required: false }]}]">
                              <a-select-option value="0">客户所有人</a-select-option>
                            </a-select>
                          </span>
                    </a-form-item> -->
                  </a-form>
                </div>
              </a-tab-pane>
            </a-tabs>
            <!-- <a-form :form="modalForm">
            </a-form> -->
          </div>
        </div>
    </a-modal>
  </div>
</template>

<script>
import leftMenu from '@/components/report/step2LeftMenu.vue'
import Draggable from 'vuedraggable'
import { getTextareaCursor, addTextareaCursor } from '@/libs/util'
// import moment from 'moment'
export default {
  name: 'step2',
  props: {
    reportId: String // 从父组件接收reportId
  },
  components: {
    leftMenu, Draggable
  },
  data () {
    return {
      spinning: true, // 整个页面加载动画
      systeming: true, // 弹窗函数模块加载动画
      tableLoading: false, // 表格加载动画
      searchLoading: false, // 搜索按钮加载动画
      dataSourceTree: [],
      loading: false,
      saveLoading: false,
      runLoading: false,
      formulaCreateLoading: false, // 添加公式列弹框确定按钮
      dragOptions: { // 拖拽组件相关配置
        sort: true, // 定义是否拖拽
        group: 'task', // string or array分组用的，同一组的不同的list可以相互拖拽
        scroll: true, // 拖放可以引起区域滚动
        scrollSpeed: 2, // 滚动速度
        animation: 150, // 动画时间
        ghostClass: 'dragable-ghost', // 拖拽是产生的副本影子单元样式，用来模拟被拖拽元素的排序情况
        chosenClass: 'dragable-chose', // 选中拖拽目标时样式
        dragClass: 'dragable-drag' // 拖拽中样式
      },
      titleName: '报表名称',
      titleNameEdit: false, // 配置报表名称修改
      cancelTitleNameFlag: '', // 用于取消还原修改

      screenWidth: { x: 100, y: 400 },
      // tableWidth = 10
      // screenWidth:  document.body.clientWidth

      showFormulaFlag: false, // 控制添加公式列模态框
      showFormulaTitle: '编辑公式列',
      expandedKeysField: [],
      searchValueField: '',
      autoExpandParentField: true,
      dataSource: [
        {
          title: '话题',
          key: '122',
          scopedSlots: { title: 'title' },
          selectable: false, // 配置节点是否可选
          children: [{
            title: 'AntDesign',
            scopedSlots: { title: 'title' },
            key: '10000'
          }, {
            title: 'AntDesign UI',
            scopedSlots: { title: 'title' },
            key: '10600'
          }]
        }, {
          title: '问题',
          scopedSlots: { title: 'title' },
          key: '1',
          selectable: false, // 配置节点是否可选
          children: [{
            title: 'AntDesign UI 有多好',
            scopedSlots: { title: 'title' },
            key: '60100'
          }, {
            title: 'AntDesign 是啥',
            scopedSlots: { title: 'title' },
            key: '30010'
          }]
        }, {
          title: '文章',
          scopedSlots: { title: 'title' },
          key: '123',
          selectable: false, // 配置节点是否可选
          children: [{
            title: 'AntDesign 是一个设计语言',
            scopedSlots: { title: 'title' },
            key: '100000'
          } ]
        }
      ],
      expandedKeysFun: [],
      searchValueFun: '',
      autoExpandParentFun: true,
      insertFun: true, // 函数插入按钮
      insertField: true, // 字段插入按钮
      fieldData: {}, // 存放字段选中
      funData: {
        func_desc: '',
        func_sample: '',
        func_type: 0,
        id: 0,
        title: ''
      }, // 存放函数选中
      fieldCalculate: '', // 存放字段求值字段
      radioValue: 0, // 编辑公式列弹框 格式单选model
      formulaTextarea: '', // 编辑列公式弹框 公式内容
      treeList: [], // 存放将dataSourceTree处理成一层之后的数据
      fieldIdArrLie: [], // 存放选择过的fieldId（表头列字段）
      fieldIdArrHang: [], // 存放选择过的fieldId（表头行字段）
      aTagDatasH: [], // 组行显示文字
      aTagDatasL: [], // 组列显示文字
      colColId: [], // 组列新增后返回的id，删除用
      rowGroupId: [], // 组行新增后返回ID，删除用
      screeningFlag: true, // 固定筛选为true，显示筛选为false，用于visibleChange  Popover显示隐藏判断
      fixedScreening: [], // 存放固定筛选选中字段
      aTagDatasF: [], // 固定筛选回显信息
      accordScreening: [], // 存放显示筛选选中字段
      aTagDatasX: [], // 显示筛选回显信息
      searchIdF: [], // 存放新增后返回的筛选器id
      searchIdX: [], // 存放新增后返回的筛选器id
      columns: [], // 表格表头数据
      data: [], // 表格数据
      search: [], // 表格搜索条件
      dataListFun: [], // 存放弹窗中函数项 处理后 数据
      funcTreeData: [], // 存放弹窗中函数树数据
      grammarSuccess: true, // 检查语法是否通过，初始化true显示按钮
      errMsg: '语法错误提示。', // 检查语法错误提示
      errMsgFlag: false, // 语法错误提示是否显示标识
      formula: '', // 公式内容
      funcTree: false, // 控制是否显示 选中函数注释
      checkFormulaLoading: false, // 检查语法btn loading
      checkFormulaSuccess: false, // 检查语法不否验证成功
      pagination: { // 定义分页数据
        current: 1,
        pageSize: 10,
        total: 1
      },
      searchParam: [], // 定义请求报表详情search参数
      reportParams: {}
    }
  },
  computed: {
    aTagDatasFcomput () { // computed计算属性， 过滤出visible为true的对象来渲染，因为当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级，这意味着 v-if 将分别重复运行于每个 v-for 循环中
      return this.aTagDatasF.filter(item => item.visible)
    },
    treeListFilter () { // 过滤出不为空的值
      return this.treeList.filter(list => list.title !== '')
    }
  },
  beforeCreate () { // 挂载前创建ant form
    this.dataForm = this.$form.createForm(this) // 定义dataForm
    this.datetimeForm = this.$form.createForm(this) // 定义datetimeForm
    this.numberForm = this.$form.createForm(this) // 定义numberForm
    this.stringForm = this.$form.createForm(this) // 定义stringForm
    this.selectForm = this.$form.createForm(this) // 定义selectForm
    this.checkboxForm = this.$form.createForm(this) // 定义checkboxForm
    // this.modalForm = this.$form.createForm(this) // 定义添加公式 弹窗modalForm
    this.form = this.$form.createForm(this) // 定义添加公式 form
    this.messageForm = this.$form.createForm(this) // 定义添加公式 messageForm
    this.formatForm = this.$form.createForm(this) // 定义添加公式 formatForm
  },
  created () {
  },
  mounted () {
    /* let that = this
    window.onresize = () => {
      return (() => {
        const elHeightValue = that.$refs.tableContent.offsetHeight - 64
        that.tableWidth = {x: 1000, y: elHeightValue}
        console.log(elWidthValue)
        console.log(that.screenWidth)
      })()
    } */
    this.$post('custom/ReportManageDetail/getAllFields', { reportId: this.reportId }).then((res) => { // 请求报表所有表的所有字段
      if (res.state === 2000) {
        // this.$nextTick(() => {
        this.dataSourceTree = res.data
        // this.dataSourceTree.text = res.data.title
        this.treeListFun(res.data) // 将其处理成一层数据，报表设置4个搜索下拉框会用到
        this.spinning = false
        // })
      } else {
        this.spinning = false
        this.$message.error(res.message, 3) // 弹出错误message
      }
    }).catch((err) => {
      if (err.code === 'ECONNABORTED') {
        this.$message.error('请求超时', 3) // 弹出错误message
      } else {
        this.$message.error('获取报表所有表的所有字段失败', 3) // 弹出错误message
      }
      this.spinning = false
    })
  },
  methods: {
    moment () {},
    treeMsg (e) { // 接收子组件的值 的方法
      console.log('父组件接收' + e)
      if (this.fieldIdArrLie.indexOf(e) === -1) {
        // this.fieldIdArrLie.push(e) // 将接收到的子组件传过来的值push到列数中
        this.treeList.map((v, i) => {
          if (v.id === e) {
            const url = 'custom/ReportManageDetail/addReportCols'
            const type = 'lie'
            this.addReportColsFun(url, v, type)
          }
        })
      }
    },
    getReportDetail (searchParam) { // 获取报表table数据
      this.tableLoading = true
      let searchPar
      if (searchParam) {
        searchPar = searchParam
      } else {
        searchPar = { reportId: this.reportId, pageSize: 10, nowpage: 1, searchParam: '' }
      }
      this.$post('custom/Report/getReportDetail', searchPar).then((res) => { // 请求新增字段
        if (res.state === 2000) {
          this.data = res.data.data
          this.columns = res.data.columns
          this.$nextTick(() => {
            this.search = res.data.search
          })
          if (this.columns.length > 7) {
            this.screenWidth = { x: '150%', y: 400 }
          }
          this.data.map((v, i) => {
            v.keyFlagId = i
          })
          this.columns.map((v, i) => {
            v.width = v.title.length * 15
          })
          this.tableLoading = false
          const pagination = { ...this.pagination }
          pagination.total = res.data.count
          this.pagination = pagination
          // this.$message.success(res.message, 3) // 弹出成功message
        } else {
          this.tableLoading = false
          this.data = []
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('请求表格失败', 3) // 弹出错误message
        }
        this.tableLoading = false
      })
    },
    addReportColsFun (url, v, type) { // 增加报表表头列方法
      this.spinning = true
      this.$post(url, { reportId: this.reportId, fieldId: v.id }).then((res) => { // 请求新增字段
        if (res.state === 2000) {
          if (type === 'lie') {
            this.fieldIdArrLie.push(v.id) // push 选中的fieldId
            this.aTagDatasL.push(v) // push 选中的回显的文字
            this.colColId.push(res.data.colId) // 存放新增后返回id
          } else if (type === 'hang') {
            this.fieldIdArrHang.push(v.id) // push 选中的fieldId
            this.aTagDatasH.push(v) // push 选中的回显的文字
            this.rowGroupId.push(res.data.groupId) // 存放新增后返回id
          }
          this.getReportDetail() // 请求table表格
          this.spinning = false
        } else {
          this.spinning = false
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('新增字段失败', 3) // 弹出错误message
        }
        this.spinning = false
      })
    },
    treeListFun (data) { // 将datasourceTree处理成一层
      for (let i = 0; i < data.length; i++) {
        let node = data[i]
        this.treeList.push(node)
        if (node.children) {
          this.treeListFun(node.children)
        }
      }
    },
    nextStep () { // 提交
      let _this = this
      _this.loading = true
      setTimeout(() => {
        _this.loading = false
        _this.$emit('nextStep')
      }, 1000)
    },
    prevStep () { // 上一步
      this.$emit('prevStep')
    },
    /* 报表设置 start */
    handleChangeH (value) { // 报表设置栏 组行 搜索框下拉选择方法
      if (!this.aTagDatasL.length) {
        this.$message.error('请先添加列', 3) // 弹出成功message
      } else {
        if (value) {
          if (this.fieldIdArrHang.indexOf(value) === -1) {
            this.treeList.map((v, i) => {
              if (v.id === value) {
                const url = 'custom/ReportManageDetail/addGroupRow'
                const type = 'hang'
                this.addReportColsFun(url, v, type)
              }
            })
          }
        }
      }
    },
    handleChangeL (value) { // 报表设置栏 列数 搜索框下拉选择方法
      if (value) {
        if (this.fieldIdArrLie.indexOf(value) === -1) {
          this.treeList.map((v, i) => {
            if (v.id === value) {
              const url = 'custom/ReportManageDetail/addReportCols'
              const type = 'lie'
              this.addReportColsFun(url, v, type)
            }
          })
        }
      }
    },
    deleteGroupH (item, index) { // 删除组行方法
      this.aTagDatasH.splice(index, 1) // 删除回显文字
      this.fieldIdArrHang.splice(index, 1) // 删除选中id
      let delRow = this.rowGroupId.slice(index, 1) // 获取要删除的那个id
      this.rowGroupId.splice(index, 1) // 删除新增返回id
      const type = 'hang'
      const URL = 'custom/ReportManageDetail/delGroupRow'
      let param = { groupId: delRow.toString() }
      this.deleteGroupFun(URL, type, param) // 调用删除组行 列 方法
    },
    deleteGroupL (item, index) { // 删除列数方法
      this.aTagDatasL.splice(index, 1) // 删除回显文字
      this.fieldIdArrLie.splice(index, 1) // 删除选中id
      console.log(this.colColId)
      let delCol = this.colColId.slice(index, 1) // 获取要删除的那个id
      this.colColId.splice(index, 1) // 删除新增返回id
      const type = 'lie'
      const URL = 'custom/ReportManageDetail/delReportCols'
      let param = { colId: delCol.toString() }
      this.deleteGroupFun(URL, type, param) // 调用删除组行 列 方法
    },
    deleteAllGroup (type) { // 删除所有组行、组列
      let url
      let param
      if (type === 'hang') {
        url = 'custom/ReportManageDetail/delGroupRow'
        param = { colId: this.rowGroupId.toString() }
        this.deleteGroupFun(url, type, param) // 调用删除组行 列 方法
      } else if (type === 'lie') {
        url = 'custom/ReportManageDetail/delReportCols'
        param = { colId: this.colColId.toString() }
        this.deleteGroupFun(url, type, param) // 调用删除组行 列 方法
      }
    },
    deleteGroupFun (URL, type, param) { // 删除组行 列 方法
      this.$post(URL, param).then((res) => { // 请求报表所有表的所有字段
        if (res.state === 2000) {
          this.getReportDetail() // 请求table表格
        } else {
          this.$message.error(res.message, 3) // 弹出message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('删除失败', 3) // 弹出错误message
        }
      })
    },
    /* 报表设置 end */
    /* 筛选 start */
    handleChangeF (value) { // 固定筛选改变事件
      if (!this.aTagDatasL.length) {
        this.$message.error('请先添加列', 3) // 弹出成功message
      } else {
        if (value) {
          if (this.fixedScreening.indexOf(value) === -1) {
            this.dataSourceTree.map((val, ind) => {
              val.children.map((v, i) => {
                if (v.id === value) {
                  let a = Object.assign({}, v)
                  a.popover = true
                  a.new = true // 用来判断是否是第一次
                  a.tableId = val.id
                  a.field_type = 'checkbox'
                  if (a.field_type === 'checkbox') {
                    a.search_logic = { key: 'in', label: '等于' }
                    a.search_param = []
                  } else if (a.field_type === 'select') {
                    a.search_logic = { key: '=', label: '等于' }
                    a.search_param = {}
                  } else if (a.field_type === 'string' || a.field_type === 'num') {
                    a.search_logic = { key: '=', label: '等于' }
                    a.search_param = ''
                  } else if (a.field_type === 'datetime') {
                    a.search_param = []
                  } else if (a.field_type === 'data') {
                    a.search_param = []
                  }
                  this.fixedScreening.push(value) // push 选中的fieldId
                  this.aTagDatasF.push(a) // push 选中的回显的信息
                  this.screeningFlag = true // 固定筛选为true，显示筛选为false，用于visibleChange  Popover显示隐藏判断
                }
              })
            })
          }
        }
      }
    },
    handleChangeX (value) { // 显示筛选改变事件
      if (!this.aTagDatasL.length) {
        this.$message.error('请先添加列', 3) // 弹出成功message
      } else {
        if (value) {
          if (this.accordScreening.indexOf(value) === -1) { // 判断是否存在
            this.dataSourceTree.map((val, ind) => {
              val.children.map((v, i) => {
                if (v.id === value) {
                  let a = Object.assign({}, v)
                  a.tableId = val.id // 父节点id
                  this.xianshifilterFun(a) // 调用增加显示筛选器方法
                }
              })
            })
          }
        }
      }
    },
    xianshifilterFun (a) { // 显示筛选器新增方法
      this.spinning = true
      this.$post('custom/ReportManageDetail/addReportShowSearch', { reportId: this.reportId, tableId: a.tableId, fieldId: a.id }).then((res) => { // 请求新增字段
        if (res.state === 2000) {
          this.spinning = false
          this.accordScreening.push(a.id) // push 选中的fieldId
          this.aTagDatasX.push(a) // push 选中的回显的信息
          this.searchIdX.push(res.data.searchId) // 存放筛选器id
          this.getReportDetail() // 请求table表格
          this.$message.success(res.message, 3) // 弹出成功message
        } else {
          this.spinning = false
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('请求新增显示筛选器失败', 3) // 弹出错误message
        }
        this.spinning = false
      })
    },
    filterOption (input, option) { // 搜索框输入搜索 过滤方法
      return option.componentOptions.children[1].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    deleteSearch (index, type) { // 删除筛选器方法
      let searchId
      if (type === 'F') { // 配置固定与显示筛选 参数
        searchId = +(this.searchIdF.slice(index, 1).toString())
      } else if (type === 'X') {
        searchId = +(this.searchIdX.slice(index, 1).toString())
      }
      this.delReportSearch(searchId, index, type)
    },
    hidePopover (e, index, type) { // 取消关闭气泡框
      if (e.new) {
        this.fixedScreening.splice(index, 1)
        this.aTagDatasF.splice(index, 1)
      }
      e.popover = false
    },
    enterPopover (e, type) { // 固定筛选确认应用关闭气泡框
      // let that = this
      if (e.new) { // 如果是第一次点击
        e.new = false
      }
      if (type === 'F') { // 配置固定与显示筛选 参数
        e.search_type = 1
      } else if (type === 'X') {
        e.search_type = 2
      }
      if (e.field_type === 'data') { // 日期
        this.dataForm.validateFields((err, values) => {
          if (values['search_param']) {
            if (!err) {
              const rangeValue = values['search_param']
              /* const subData:  {
                ...values,
                'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')]
              } */
              // console.log(subData)
              e.extra = rangeValue[0].format('YYYY-MM-DD') + ' ～' + rangeValue[1].format('YYYY-MM-DD')
              e.search_param = values.search_param
              e.popover = false
              const subData = {
                reportId: this.reportId,
                tableId: e.tableId,
                fieldId: e.id,
                search_logic: 'between',
                search_type: e.search_type,
                search_name: e.title,
                search_param: rangeValue[0].format('YYYY-MM-DD') + ',' + rangeValue[1].format('YYYY-MM-DD')
              }
              this.subDataSearch(subData) // 调用增加报表筛选器接口
              this.dataForm.resetFields() // 重置输入控件的值
            }
          } else {
            e.extra = '所有时间'
            e.popover = false
            this.dataForm.resetFields() // 重置输入控件的值
          }
        })
      } else if (e.field_type === 'datetime') { // 时间
        this.datetimeForm.validateFields((err, values) => {
          if (!err) {
            const rangeValue = values['search_param']
            /* const subData:  {
              ...values,
              'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')]
            } */
            e.extra = rangeValue[0].format('YYYY-MM-DD HH:mm') + ' ～' + rangeValue[1].format('YYYY-MM-DD HH:mm')
            e.search_param = values.search_param
            e.popover = false
            const subData = {
              reportId: this.reportId,
              tableId: e.tableId,
              fieldId: e.id,
              search_logic: 'between',
              search_type: e.search_type,
              search_name: e.title,
              search_param: rangeValue[0].format('YYYY-MM-DD HH:mm') + ',' + rangeValue[1].format('YYYY-MM-DD HH:mm')
            }
            this.subDataSearch(subData) // 调用增加报表筛选器接口
            this.datetimeForm.resetFields() // 重置输入控件的值
          }
        })
      } else if (e.field_type === 'num') { // 数字
        this.numberForm.validateFields((err, values) => {
          if (!err) {
            e.extra = values.search_logic.label + '  '
            e.extra += values.search_param ? values.search_param : '  " "'
            e.popover = false
            e.search_logic = values.search_logic
            e.search_param = values.search_param
            const subData = {
              reportId: this.reportId,
              tableId: e.tableId,
              fieldId: e.id,
              search_logic: values.search_logic.key,
              search_type: e.search_type,
              search_name: e.title,
              search_param: values.search_param
            }
            this.subDataSearch(subData) // 调用增加报表筛选器接口
            this.numberForm.resetFields() // 重置输入控件
          }
        })
      } else if (e.field_type === 'string') { // 字符串
        this.stringForm.validateFields((err, values) => {
          if (!err) {
            e.extra = values.search_logic.label + '  '
            e.extra += values.search_param ? values.search_param : '  " "'
            e.search_logic = values.search_logic
            e.search_param = values.search_param
            e.popover = false
            const subData = {
              reportId: this.reportId,
              tableId: e.tableId,
              fieldId: e.id,
              search_logic: values.search_logic.key,
              search_type: e.search_type,
              search_name: e.title,
              search_param: values.search_param
            }
            this.subDataSearch(subData) // 调用增加报表筛选器接口
            this.stringForm.resetFields() // 重置输入控件
          }
        })
      } else if (e.field_type === 'select') { // 单选
        this.selectForm.validateFields((err, values) => {
          if (!err) {
            e.extra = values.search_logic.label + '  '
            e.extra += values.search_param ? values.search_param.label : '  " "'
            e.popover = false
            e.search_logic = values.search_logic
            e.search_param = values.search_param
            const subData = {
              reportId: this.reportId,
              tableId: e.tableId,
              fieldId: e.id,
              search_logic: values.search_logic.key,
              search_type: e.search_type,
              search_name: e.title,
              search_param: values.search_param.key
            }
            this.subDataSearch(subData) // 调用增加报表筛选器接口
            this.selectForm.resetFields() // 重置输入控件
          }
        })
      } else if (e.field_type === 'checkbox') { // 复选框
        this.checkboxForm.validateFields((err, values) => {
          if (!err) {
            let searchParam = []
            let extra = []
            if (!values.search_param) {
              e.extra = values.search_logic.label + '  ' + '  " "'
            } else {
              values.search_param.forEach((val, i) => {
                // e.extra += val.label+','
                // search_param += val.key+','
                extra.push(val.label)
                searchParam.push(val.key)
              })
              e.extra = values.search_logic.label + '  ' + extra.join()
            }
            e.popover = false
            e.search_logic = values.search_logic
            e.search_param = values.search_param
            const subData = {
              reportId: this.reportId,
              tableId: e.tableId,
              fieldId: e.id,
              search_logic: values.search_logic.key,
              search_type: e.search_type,
              search_name: e.title,
              search_param: searchParam.join()
            }
            this.subDataSearch(subData) // 调用增加报表筛选器接口
            this.checkboxForm.resetFields() // 重置输入控件
          }
        })
      }
    },
    subDataSearch (subData) { // 固定筛选器确认提交方法
      this.spinning = true
      this.$post('custom/ReportManageDetail/addReportSearch', subData).then((res) => { // 请求新增字段
        if (res.state === 2000) {
          this.spinning = false
          this.searchIdF.push(res.data.searchId) // 存放筛选器id
          this.getReportDetail() // 请求table表格
          this.$message.success(res.message, 3) // 弹出成功message
        } else {
          this.spinning = false
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('新增固定筛选器失败', 3) // 弹出错误message
        }
        this.spinning = false
      })
    },
    delReportSearch (searchId, index, type) { // 筛选器删除请求方法
      this.spinning = true
      this.$post('custom/ReportManageDetail/delReportSearch', { searchId }).then((res) => { // 请求新增字段
        if (res.state === 2000) {
          this.spinning = false
          if (type === 'F') { // 配置固定与显示筛选 参数
            this.searchIdF.splice(index, 1)
            this.fixedScreening.splice(index, 1)
            this.aTagDatasF.splice(index, 1)
          } else if (type === 'X') {
            this.searchIdX.splice(index, 1)
            this.accordScreening.splice(index, 1)
            this.aTagDatasX.splice(index, 1)
          }
          this.getReportDetail() // 请求table表格
          this.$message.success(res.message, 3) // 弹出成功message
        } else {
          this.spinning = false
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('删除筛选器失败', 3) // 弹出错误message
        }
        this.spinning = false
      })
    },
    visibleChangeFun (visible) { // popover 显示隐藏的回调
      if (this.screeningFlag) {
        let aTagFLast = this.aTagDatasF[this.aTagDatasF.length - 1] // 获取固定筛选数组最后一个
        if (aTagFLast.new) { // 如果是第一次选中未点击确认按钮的情况下
          this.fixedScreening.pop()
          this.aTagDatasF.pop()
        }
      } else {
        let aTagXLast = this.aTagDatasX[this.aTagDatasX.length - 1] // 获取显示筛选数组最后一个
        if (aTagXLast.new) { // 如果是第一次选中未点击确认按钮的情况下
          this.accordScreening.pop()
          this.aTagDatasX.pop()
        }
      }
      console.log(visible)
    },
    /* 筛选 end */
    /* 组行、组列拖拽系列方法 start */
    onEndHang (ev) { // 组行拖拽移动
      // console.log(this.aTagDatasH)
      if (ev.to.className === 'lie') {
        // console.log(ev.oldIndex)
        // console.log(this.aTagDatasH[ev.oldIndex])
        // this.aTagDatasL.splice(ev.newIndex, 0, this.aTagDatasH[ev.oldIndex]) // 往列中添加数据
        // this.aTagDatasH.splice(ev.oldIndex, 1) // 删除行中的数据
      }
      // console.log(this.aTagDatasL)
    },
    // to:移动到的列表的容器, from:来源列表容器, item:被移动的单元, clone:副本的单元, oldIndex:移动前的序号(从0开始), newIndex:移动后的序号
    onEndLie (ev) { // 组列拖拽移动结束
      // console.log(ev)
      if (ev.to.className === 'hang') {
        // this.aTagDatasL.splice(ev.oldIndex, 1)
      }
    },
    onUpdateHang (ev) { // 拖拽行移动排序发生变化时
      // console.log(ev)
      // console.log(this.aTagDatasL)
    },
    onUpdateLie (ev) { // 拖拽列
      // console.log(ev)
      // console.log(this.aTagDatasL)
    },
    /* 拖拽end */
    /* 报表名称 修改方法 start */
    titleNameEditFun (e) { // 报表名称修改方法
      this.titleName = e // 将输入的赋值给其名称
    },
    editTitleName () { // 点击修改按钮方法
      this.titleNameEdit = true
      this.cancelTitleNameFlag = this.titleName // 获取titleName作为flag用于取消还原
    },
    saveEditTitleName () { // 保存修改
      this.titleNameEdit = false
    },
    cancelEditTitleName () { // 取消还原修改
      this.titleNameEdit = false
      this.titleName = this.cancelTitleNameFlag // 取消时将之前的titleName还原
    },
    /* 报表名称 修改方法 end */
    /* 添加汇总公式弹窗  start */
    showFormulaModel (e) { // 添加汇总公式弹窗方法
      // this.generateList(this.dataSource) // 先处理数据
      this.showFormulaFlag = true
      this.$post('custom/Formula/getSystemFunc', null).then((res) => { // 请求新增字段
        if (res.state === 2000) {
          this.generateList(res.data)
          this.funcTreeData = res.data
          this.systeming = false
          // this.$message.success(res.message, 3) // 弹出成功message
        } else {
          this.systeming = false
          this.$message.error(res.message, 3) // 弹出错误message
        }
      }).catch((err) => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时', 3) // 弹出错误message
        } else {
          this.$message.error('删除筛选器失败', 3) // 弹出错误message
        }
        this.systeming = false
      })
    },
    formulaCreate () { // 模态框确认方法
      this.formulaCreateLoading = true // 打开动画
      let format = this.formatForm.getFieldsValue(['col_format', 'decimal_num'])
      if (!format.col_format) {
        format = { col_format: 'num', decimal_num: '0' } // 先设置一个默认的值
      }
      this.messageForm.validateFields((err, values) => {
        if (!err) {
          let params = Object.assign({}, values, format)
          params.reportId = this.reportId
          this.$post('custom/reportManageDetail/addFormulaCols', params).then((res) => { // 请求新增字段
            this.formulaCreateLoading = false
            if (res.state === 2000) {
              this.getReportDetail() // 调用请求表格方法
              this.messageForm.resetFields() // 重置输入控件
              this.formatForm.resetFields() // 重置输入控件
              this.showFormulaFlag = false
              this.fieldIdArrLie.push(res.data.colId) // push 标识
              this.aTagDatasL.push({ title: params.col_title }) // push 选中的回显的文字
              this.colColId.push(res.data.colId) // 存放新增后返回列id
            } else {
              this.$message.error(res.message, 3) // 弹出错误message
            }
          }).catch((err) => {
            if (err.code === 'ECONNABORTED') {
              this.$message.error('请求超时', 3) // 弹出错误message
            } else {
              this.$message.error('添加公式列失败', 3) // 弹出错误message
            }
            this.formulaCreateLoading = false
          })
        } else {
          this.formulaCreateLoading = false
        }
      })
    },
    textareaChange (e) { // textarea change事件
      this.formula = e.target.value
    },
    formulaCancel () { // 模态框取消关闭方法
      this.showFormulaFlag = !this.showFormulaFlag
      this.insertFun = true
      this.insertField = true
      this.funData = {
        func_desc: '',
        func_sample: '',
        func_type: 0,
        id: 0,
        title: ''
      }
      this.fieldData = {}
    },
    /* 模态框搜索树处理方法 start */
    generateList (data) { // 将 函数项数据 处理成只有一个层级
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        this.dataListFun.push(node) // 函数
        if (node.children) {
          this.generateList(node.children)
        }
      }
    },
    getParentKey (key, tree) { // 计算返回要打开的tree的父节点 方法
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some((item) => item.id === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    onExpandField (expandedKeys) { // 触发展开/收起节点
      this.expandedKeysField = expandedKeys
      this.autoExpandParentField = false
    },
    onChangeField (e) { // 编辑公式列弹窗 字段搜索方法
      const value = e.target.value
      const expandedKeysField = this.treeList.map((item) => { // 遍历 查询所有的节点
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.key, this.dataSourceTree)
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i) // 过滤出要打开的节点
      Object.assign(this, {
        expandedKeysField,
        searchValueField: value,
        autoExpandParentField: true
      })
    },
    onExpandFun (expandedKeys) {
      this.expandedKeysFun = expandedKeys
      this.autoExpandParentFun = false
    },
    onChangeFun (e) { // 函数项改变搜索事件
      const value = e.target.value
      const expandedKeysFun = this.dataListFun.map((item) => { // 遍历 查询所有的节点
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.id, this.funcTreeData)
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i) // 过滤出要打开的节点
      Object.assign(this, {
        expandedKeysFun,
        searchValueFun: value,
        autoExpandParentFun: true
      })
    },
    onselectTreeField (selectedKeys, info) { // 字段选中
      this.fieldData = info.node.dataRef // 将选中的字段保存到fieldData中
      this.insertField = false
    },
    onSelectTreeFun (selectedKeys, info) { // 函数选中
      this.funData = info.node.dataRef // 将选中的函数保存到funData中
      this.funcTree = true // 显示注释
      this.insertFun = false
    },
    /* end */
    insertFieldFun () { // 字段插入方法
      let textarea = this.$refs.formulaTextarea.$el // 获取文本域元素
      let cursor = getTextareaCursor(textarea) // 先调用获取位置方法
      let text = this.fieldCalculate ? this.fieldCalculate + '(' + this.fieldData.formula + ') ' : this.fieldData.formula + ' '
      addTextareaCursor(textarea, cursor, text) // 调用插入文本方法
      this.formula = textarea.value
    },
    insertFunFun () { // 函数插入方法
      let textarea = this.$refs.formulaTextarea.$el // 获取文本域元素
      let cursor = getTextareaCursor(textarea) // 先调用获取位置方法
      let text = this.funData.func_sample + ' '
      addTextareaCursor(textarea, cursor, text) // 调用插入文本方法
      this.formula = textarea.value
    },
    symbolInsertFun (symbol) { // textarea符号插入方法
      let textarea = this.$refs.formulaTextarea.$el // 获取文本域元素
      let cursor = getTextareaCursor(textarea) // 先调用获取位置方法
      let text = symbol
      addTextareaCursor(textarea, cursor, text) // 调用插入文本方法
      this.formula = textarea.value
    },
    checkGrammar () { // 模态框 检查语法方法
      console.log(this.formula)
      if (this.formula) {
        this.checkFormulaLoading = true
        this.$post('custom/Formula/checkFormula', { reportId: this.reportId, formula: this.formula }).then((res) => { // 请求新增字段
          if (res.state === 2000) {
            console.log(res)
            this.checkFormulaLoading = false // 加载动画
            this.grammarSuccess = false // 按钮
            this.checkFormulaSuccess = true // 成功提示
          } else {
            this.checkFormulaLoading = false // 动画
            this.grammarSuccess = false // 按钮
            this.errMsg = res.message
            this.errMsgFlag = true // 提示信息
          }
        }).catch((err) => {
          console.log(err)
          this.errMsg = '请求失败'
          this.errMsgFlag = true // 提示信息
          this.checkFormulaLoading = false
          this.$message.error('请求失败', 3) // 弹出错误message
        })
      }
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
          this.getReportDetail(params)
        }
      })
    },
    onChangeTab (pagination) { // 表格切换页数
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      let searchParam = JSON.stringify(this.searchParam) || ''
      let params = { reportId: this.reportId, searchParam: searchParam, nowpage: pagination.current, pageSize: pagination.pageSize }
      this.getReportDetail(params)
    },
    /* saveFun () { // 保存方法
      this.saveLoading = true
      let _this = this
      setTimeout(() => {
        _this.saveLoading = false
      }, 2000)
    } */
    runFun () { // 运行方法
      this.runLoading = true
      let _this = this
      setTimeout(() => {
        _this.runLoading = false
        this.$router.push({ path: '/reportTable', query: { reportId: this.reportId } }) // 报表表格
      }, 200)
    }
  },
  watch: {
    // 监听formula 是因为如果其变化则显示验证公式按钮
    // @Watch('formula', { deep: true, immediate: true }) formulaWatch (newVal, oldVal) {
    // }
    formula: {
      handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.grammarSuccess = true
          this.errMsgFlag = false
          this.checkFormulaSuccess = false
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss'>
.spin-content{
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
.lpc-step2-content {
  display: flex;
  border: 1px solid #e8e8e8;
  .lpc-centerTab {
    width: 233px;
    border-right: 1px solid #e8e8e8;
    .ant-tabs .ant-tabs-bar {
      margin: 0;
    }
    .ant-tabs-nav-wrap {
      background-color: #f9f7f7;
      border-bottom: 1px solid #e8e8e8;
      height: 43px;
      line-height: 43px;
      margin-bottom: 0;
      .ant-tabs-tab {
        margin: 0;
        padding: 0 26px;
      }
    }
    .lpc-tab1-content {
      padding: .875rem 1rem;
      height: calc(64vh - 43px);
      overflow-y: scroll;
      .tab1-top {
        .tab1-top-header {
          margin-bottom: .5rem;
          line-height: 19px;
          display: flex;
          h4 {
            flex: 1;
            display: inline-block;
            color: #6b6d70;
            font-weight: 700;
            font-size: .8125rem;
          }
          i.anticon-delete {
            cursor: pointer;
            font-size: 14px;
            // margin-right: 10px;
            margin-top: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          i.anticon-delete:hover {
            color: #1890ff;
          }
        }
        .tab1-top-content {
          h4 {
            font-size: .6875rem;
            color: #6b6d70;
            text-transform: uppercase;
            display: flex;
            -o-box-align: center;
            align-items: center;
            margin-bottom: .25rem;
            line-height: 2;
            overflow-x: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .tab1-bottom {
        .tab1-bottom-header {
          margin-bottom: .5rem;
          line-height: 19px;
          display: flex;
          h4 {
            flex: 1;
            color: #6b6d70;
            font-weight: 700;
            font-size: .8125rem;
            text-transform: uppercase;
            -o-box-align: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            margin-bottom: .25rem;
            line-height: 2;
            overflow-x: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          a.ant-dropdown-trigger {
            cursor: pointer;
            // margin-right: 10px;
            margin-top: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            :hover {
              color: #1890ff;
            }
            .anticon-down-square {
              font-size: 14px;
            }
          }
        }
      }
      .task-content{ // 公用拖拽模块样式
        .task-item {
          font-variant: tabular-nums;
          width: 100%;
          color: rgba(0, 0, 0, 0.65);
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 5px 0;
          line-height: 22px;
          height: 22px;
          padding: 0 7px;
          border-radius: 4px;
          border: 1px solid #d9d9d9;
          background: #fafafa;
          font-size: 12px;
          -webkit-transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
          transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
          opacity: 1;
          white-space: nowrap;
          cursor: move;
          .anticon-close {
            display: inline-block;
            float: right;
            margin-top: 5px;
            color: rgb(176, 173, 171);
            :hover {
              cursor: pointer;
            }
          }
        }
      }
    }
    .lpc-tab2-content {
      padding: .875rem 1rem;
      height: calc(64vh - 43px);
      overflow-y: scroll;
      .tab2-top-header {
        margin-bottom: .5rem;
        line-height: 19px;
        display: flex;
        h4 {
          flex: 1;
          color: #6b6d70;
          font-weight: 700;
          font-size: .8125rem;
          text-transform: uppercase;
          -o-box-align: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          margin-bottom: .25rem;
          line-height: 2;
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        a.ant-dropdown-trigger {
          cursor: pointer;
          font-size: .75rem;
          // margin-right: 10px;
          margin-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          :hover {
            color: #1890ff;
          }
          .anticon-down-square {
            font-size: 14px;
          }
        }
      }
      .screening-content,.According-content {
        .screening-item,.According-item {
          background-color: #fbfbfb;
          padding: 0 7px;
          border-radius: 4px;
          border: 1px solid #d9d9d9;
          margin: 3px 0;
          cursor: pointer;
          display: flex;
          .lpc-fixed-text {
            flex: 1;
            display: inline-block;
            .title {
              font-size: .75rem;
              text-overflow: ellipsis;
              overflow-x: hidden;
              color: #6b6d70;
              font-weight: 400;
            }
            .text {
              font-size: .8125rem;
              font-weight: 400;
              color: #16325c;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .anticon-close {
            line-height: 35px;
            color: rgb(176, 173, 171);
            :hover {
              cursor: pointer;
            }
          }
        }
        .active_item {
          border: 1px solid #40a9ff;
        }
        .task-item {
          font-variant: tabular-nums;
          width: 100%;
          color: rgba(0, 0, 0, 0.65);
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 5px 0;
          line-height: 22px;
          height: 22px;
          padding: 0 7px;
          border-radius: 4px;
          border: 1px solid #d9d9d9;
          background: #fafafa;
          font-size: 12px;
          -webkit-transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
          transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
          opacity: 1;
          white-space: nowrap;
          cursor: move;
          .anticon-close {
            display: inline-block;
            float: right;
            margin-top: 5px;
            color: rgb(176, 173, 171);
            :hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .lpc-rightTable {
    width: 100%;
    overflow-x: scroll;
    .table-header {
      height: 43px;
      line-height: 43px;
      background-color: #f9f7f7;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      .table-header-left {
        display: inline-block;
        flex: 1;
        .header-icon {
          display: inline-block;
          margin-left: 10px;
          font-size: 15px;
          .anticon-edit {
            color: #1dd9e2c7;
            cursor: pointer;
          }
          .anticon-check {
            color: #3fb54b;
            cursor: pointer;
            margin-right: 5px;
          }
          .anticon-close {
            color: #e84545;
            cursor: pointer;
          }
        }
      }
      .table-header-right {
        display: inline-block;
        margin-right: 20px;
        .runBtn {
          margin-left: 10px;
          background-color: #1dd9e2c7;
          border: #1dd9e2c7
        }
      }
    }
    #components-form-demo-advanced-search {
      background-color: #fbfbfb;
      .ant-form-item {
        display: flex;
        .ant-form-item-control-wrapper {
          flex: 1;
          .ant-calendar-picker {
            width: 100%;
          }
        }
      }
    }
    .table-content {
      height: calc(64vh - 43px);
      table tr {
        th {
          text-align: center;
        }
      }
      .noneIcon {
        width: 100%;
        height: 100%;
        display:flex;
        justify-content:center;
        align-items:center; /* 水平垂直居中 */
        i {
          color: #ddd;
          font-size: 8rem;
        }
        p {
          text-align: center;
          font-size: 15px;
          color: #bfbfbf;
        }
      }
    }
  }
}
.lpc-form-footer { // 底部按钮样式
  text-align: center;
  .ant-form-item {
    margin: 12px 0;
  }
}
.ant-popover { // 筛选器弹框样式
  .ant-popover-inner-content {
    .ant-form-item {
      margin-bottom: 12px;
    }
    .content-footer {
      text-align: right;
      .ant-btn-primary {
        margin-left: 10px;
      }
    }
  }
}
.formulaModal { // 编辑公式列模态框样式
  width: 950px!important;
  .ant-modal-body {
    padding: 0!important;
    .modalContent {
      display: flex;
      .modalLeftTab {
        display: inline-block;
        width: 300px;
        flex: 0 0 300px;
        background-color: #f9f9fa;
        padding: 0 1rem;
        border-right: 1px solid #d9dbdd;
        .ant-tabs-nav-wrap {
          border-bottom: 1px solid #e8e8e8;
          height: 45px;
          margin-bottom: 0;
          .ant-tabs-tab-active {
            color: rgb(8, 7, 7);
          }
        }
        .ant-tabs-tabpane {
          padding: 0 5px;
        }
      }
      .modalRightTab {
        display: inline-block;
        flex: 1;
        padding: 0 1rem;
        .ant-tabs-nav-wrap {
          border-bottom: 1px solid #e8e8e8;
          height: 45px;
          margin-bottom: 0;
          .ant-tabs-tab-active {
            color: rgb(8, 7, 7);
          }
        }
        .ant-tabs-tabpane {
          padding: 0 5px;
        }
        .message {
          .ant-form-vertical {
            .twoCol {
              display: inline-block;
              width: 48%;
              .ant-radio-wrapper {
                height: 30px;
                line-height: 30px;
                display: block;
              }
            }
            .editInsertButton {
              position: absolute;
              left: 0;
              z-index: 999;
              display: flex;
              width: 100%;
              align-items: center;
              padding: .5rem;
              background-color: #f6f9fb;
              border-top-right-radius: .25rem;
              border-top-left-radius: .25rem;
              border-bottom: 1px solid #d9dbdd;
              span {
                color: #16325c;
                font-weight: 700;
                font-size: .8125rem;
                line-height: 2.125rem;
                padding: 0 .825rem;
                margin-right: .5rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
                vertical-align: middle;
                border: 1px solid rgb(221, 219, 218);
                transition: border .15s linear;
                border-radius: .25rem;
                border-color: rgb(221, 219, 218);
                background-color: rgb(255, 255, 255);
                user-select: none;
                display: inline-block;
                background: transparent;
                background-clip: border-box;
                &:hover {
                  background-color: #e7eaef;
                  cursor: pointer;
                }
              }
            }
            textarea {
              height: 265px;
              padding-top: 45px;
              resize: none;
            }
            p.errMsg {
              height: 25px;
              line-height: 25px;
              white-space: nowrap;
              font-size: 12px;
              color: rgb(62, 62, 60);
            }
          }
        }
      }
      .leftMenu {
        .header {
          .ant-input-search {
            width: 265px;
          }
        }
        .treeContent { // 模态框中tree内容样式
          // height: calc(64vh - 22.6875rem);
          height: 360px;
          width: 265px;
          overflow: scroll;
          background-color: #fff;
          border: 1px solid #d9dbdd;
          border-radius: .25rem;
          margin: .625rem 0 .75rem;
          padding: 0 .5rem;
        }
        .funcTree {
          height: 260px;
          margin: .625rem 0 0;
        }
        .funcTreeMessage {
          height: 100px;
          padding: 10px 0;
          font-size: 12px;
          p:first-child {
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            margin: 5px 0;
            color: black;
          }
          p:last-child {
            height:60px;
            width: 100%;
            color: #6b6d70;
            overflow:hidden;
          }
        }
        .footer {
          margin: 10px 0;
          button {
            margin-left: 21px;
          }
        }
      }
    }
  }
}
.ant-select-dropdown .ant-select-dropdown-content li {
  padding: 5px 12px 5px 22px;
  font-size: 12px;
  &.disabled {
    color: rgb(0, 0, 0);
    padding: 5px 12px;
    font-size: 14px;
    i {
      margin-right: 5px;
    }
  }
}
</style>
