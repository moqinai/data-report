<template>
  <a-layout id="components-layout-demo-fixed-sider" style="min-height: 100vh">
    <!-- 菜单 -->
    <menu-nav  @menuChildChange="changeCollapsed" :collapsed="collapsed" :selectKeys="selectKeys"></menu-nav>
    <!-- 右侧头部及内容 -->
    <a-layout :style="{ marginLeft: left + 'px', transition: 'all .2s'}">
      <a-layout-header>
        <!-- 收缩按钮 -->
        <div class="lpc-header">
          <a-icon class="triggMenu" @click="toggleCollapsed" :type="collapsed ? 'menu-unfold' : 'menu-fold'"></a-icon>
          <div class="user-icon">
            <a-avatar :src="userSrc"></a-avatar>
            <!-- <a-icon type="logout"/>
            <label :text="userName"></label> -->
            <a-dropdown :trigger="['click']">
              <a href="javascript:void(0);" class="ant-dropdown-link">{{ userName }}</a>
              <a-menu slot="overlay" @click="logout">
                <a-menu-item>
                  <a href="javascript:;" key="0">清除缓存</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" key="1">退出</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        朴新前端研发团队 ©2019
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import menuNav from '@/components/menu/menu.vue'
export default {
  /* @Prop() private msg!: string */
  name: 'Home',
  data () {
    return {
      collapsed: false, // 控制收缩菜单栏
      left: '200',
      selectKeys: [],
      userSrc: '',
      userName: ''
    }
  },
  components: {
    menuNav
  },
  mounted () {
    // this.selectKeys = [this.$route.path]
    // 请求用户信息
    this.$post('custom/GlobalApi/getUserInfo').then((res) => {
      if (res.state === 2000) {
        this.userSrc = res.data.logo
        this.userName = res.data.userName
      } else {
        this.$message.error(res.message, 3)
      }
    }).catch((err) => {
      if (err.code === 'ECONNABORTED') {
        this.$message.error('请求超时', 3) // 弹出错误message
      } else {
        this.$message.error('请求失败', 3)
      }
    })
  },
  methods: {
    changeCollapsed (collapsed) { // 接收自组件传过来的值
      this.collapsed = collapsed
      this.collapsed ? this.left = '80' : this.left = '200' // 控制右侧模块margin-left的值
    },
    toggleCollapsed () {
      this.collapsed = !this.collapsed
      this.collapsed ? this.left = '80' : this.left = '200' // 控制右侧模块margin-left的值
    },
    logout (e) {
      if (e.key === 'item_0') {
        this.$post('/custom/GlobalApi/freshCache').then((res) => { // 更新缓存
          if (res.state === 2000) {
            this.$message.success(res.message, 3)
          } else {
            this.$message.error(res.message, 3)
          }
        }).catch((err) => {
          if (err.code === 'ECONNABORTED') {
            this.$message.error('请求超时', 3) // 弹出错误message
          } else {
            this.$message.error('请求失败', 3)
          }
        })
      } else if (e.key === 'item_1') {
        this.$post('/custom/GlobalApi/logOut').then((res) => {
          if (res.state === 2000) {
            window.location.replace(`${res.data.redirectUrl}`)
            this.$message.success(res.message, 3)
          } else {
            this.$message.error(res.message, 3)
          }
        }).catch((err) => {
          if (err.code === 'ECONNABORTED') {
            this.$message.error('请求超时', 3) // 弹出错误message
          } else {
            this.$message.error('请求失败', 3)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ant-layout-header {
  /* position: fixed; */
  z-index: 1;
  width: 100%;
  padding: 0;
  background: rgb(255, 255, 255);
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  .lpc-header {
    /* display: flex; */
    position: relative;
    .triggMenu {
      cursor: pointer;
      display: inline-block;
      font-size: 20px;
      vertical-align: baseline;
      transition: color .3s;
      padding: 0 14px;
      line-height: 64px;
      /* flex: 1; */
      text-align: left;
      position: absolute;
      top: 0;
      left: 0;
    }
    .user-icon {
      /* flex: 0 0 200px; */
      position: absolute;
      top: 0;
      right: 50px;
      cursor: pointer;
      .ant-avatar {
        margin-right: 20px;
      }
    }
  }
}
.ant-layout-content {
  /* margin: 64px 0px 0px; */
  overflow: initial;
}
</style>
