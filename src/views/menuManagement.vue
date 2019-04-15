<template>
  <div>
    <a-spin :spinning="spinning" delayTime="500">
      <div class="lpc-leftTree">
        <!-- <a-tree
        class="draggable-tree"
        draggable
        @dragenter="onDragEnter"
        @drop="onDrop"
        @dragend="onDragend"
        @dragleave="onDragleave"
        @dragover="onDragover"
        @dragstart="onDragstart"
        :treeData="menuData"
        >
          <span slot="title0010" style="color: #1890ff">sss</span>
        </a-tree> -->
        <!-- <vue-nestable v-model="menuData">
          <vue-nestable-handle
            slot-scope="{ item }"
            :item="item"
          >
            {{item.title}}
          </vue-nestable-handle>
        </vue-nestable> -->
      </div>
    </a-spin>
  </div>
</template>

<script>
// import Draggable from 'vuedraggable'
// import { VueNestable, VueNestableHandle } from 'vue-nestable'
export default {
  name: 'menuManagement',
  data () {
    return {
      spinning: false, // 进入页面缓冲动画
      loading: false,
      menuData: [{
        title: 'parent 1',
        key: '0-0',
        children: [{
          title: 'parent 1-0',
          key: '0-0-0',
          // disabled: true,
          children: [
            { title: 'leaf', key: '0-0-0-0' },
            { title: 'leaf', key: '0-0-0-1' }
          ]
        }, {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            { key: '0-0-1-0', slots: { title: 'title0010' } }
          ]
        }]
      }]
    }
  },
  components: {
    // Draggable, VueNestable, VueNestableHandle
  },
  created () {
    console.log('请求菜单列表')
    this.initDataFun()
  },
  methods: {
    initDataFun () { // 初始化请求数据
      this.$post('custom/menuManage/menuList').then((res) => { // 请求表格数据
        if (res.state === 2000) {
          this.loading = false // 关闭加载动画
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
        // this.menuData = {}
      })
    },
    clickFun (index) {
      console.log(index)
    },
    onDragEnter (info) {
      // console.log('ondragenter')
      // console.log(info)
    },
    onDragend (info) {
      console.log('ondragend')
      console.log(info.node.children)
    },
    onDragleave (info) {
      // console.log('ondragleave')
      // console.log(info)
    },
    onDragover (info) {
      // console.log('onDragover')
      // console.log(info)
    },
    onDragstart (info) {
      // console.log('ondragstart')
      // console.log(info)
    },
    onDrop (info) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.menuData]
      // Find dragObject
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item) => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 && info.node.expanded && dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item) => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj)
        })
      } else {
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.menuData = data
    }
  }
}
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
</style>
