<template>
  <div>
    <a-layout-sider :trigger="null" collapsible :collapsed="collapsed" style="background: #fff"
      breakpoint="lg"
      collapsedWidth="80"
      @breakpoint="onBreakpoint"
    >
      <div class="logo">朴新</div>
      <a-menu mode="inline" :selectedKeys="selectKeys" :defaultOpenKeys="[openKeys]" :inlineCollapsed="collapsed" @select="selectMenu">
        <template v-for="item in menuData">
          <a-menu-item v-if="item.children.length === 0" :key="item.path">
            <a-icon :type="item.icon"/>
            <span class="lidiv">
                <router-link :to="item.path">{{item.name}}</router-link>
            </span>
          </a-menu-item>
          <a-sub-menu v-else :key="item.key">
            <span slot="title"><a-icon :type="item.icon" /><span>{{item.name}}</span></span>
            <a-menu-item v-for="child in item.children" :key="child.path">
              <router-link :to="child.path">{{child.name}}</router-link>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
// collapsed: boolean = false;
  name: 'menuPage',
  props: {
    collapsed: Boolean
  },
  data () {
    return {
      selectKeys: []
    }
  },
  computed: {
    ...mapState({
      openKeys: state => state.openKeys,
      menuData: state => state.menu
    })
    // ...mapState(['openKeys']) // 另一种取值方式
  },
  // @State openKeys: any
  // @Mutation changeOpenKeys: any
  // @State('menu') menuData: any
  // @Mutation menuList: any
  // @Emit('menuChildChange') send (collapse: boolean) {};
  created () {
    console.log(this.collapsed)
    // 请求菜单
    // if (!this.menuData) {
    this.$post('custom/GlobalApi/getMenu').then((res) => {
      if (res.state === 2000) {
        this.menuList(res.data)
        // this.menuData = res.data;
      } else {
        this.$message.error(res.message, 3)
      }
    }).catch((err) => {
      if (err.code === 'ECONNABORTED') {
        this.$message.error('请求超时', 3) // 弹出错误message
      } else {
        this.$message.error('请求失败', 3) // 弹出错误message
      }
    })
    // }
  },
  mounted () {
    this.selectKeys = [this.$route.path]
  },
  methods: {
    ...mapMutations(['changeOpenKeys', 'menuList']),
    selectMenu (e) { // 将点击选中的实时替换
      this.selectKeys = [e.key]
      this.changeOpenKeys({ openKeys: e.key })
    },
    onCollapse (collapsed, type) { // 展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发
      // console.log(collapsed)
      // this.collapsed = collapsed
      // console.log(type)
    },
    onBreakpoint (broken) { // 触发响应式布局断点时的回调
      // this.send(broken)
      console.log(broken)
      this.$emit('menuChildChange', broken)
    }
  }
}
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(123, 218, 222, 0.2);
  margin: 16px;
  color: #000;
  font-family: 'Times New Roman', Times, serif;
  font-size: 23px;
  text-align: center;
}
.ant-layout-sider{
  position: fixed;
  min-height: 100vh;
  left: 0;
  .ant-menu-item {
    padding: 0;
    .lidiv {
      display: inline-block;
      width: 100%;
      a {
        display: inline-block;
        width: 100%;
        padding: 0;
      }
    }
  }
}
</style>
