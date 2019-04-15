<template>
  <a-locale-provider :locale="zhCn">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>
<script>
import zhCn from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  data () {
    return {
      zhCn
    }
  },
  created () {
    // console.log(moment('2019-04-01', 'YYYY-MM-DD'))
  }
}
</script>
<style lang="scss">
body {
  background: #f0f2f5;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
.ant-table {
  td { white-space: nowrap; }
}
</style>
