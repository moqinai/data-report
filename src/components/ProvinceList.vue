<template>
  <div class="main">
    <MapCity :datas=option />
    <div>
      <ul>
        <li 
          :class="{active: index === current}" 
          v-for="(item,index) in list" 
          :key="item.id"
          @click="current = index"
        >
          {{item}}
        </li>
      </ul>
      宽(px)：<input type="text" v-model="w">
      高(px)：<input type="text" v-model="h">
      <button class="btn" @click="makeUpMap">预览</button>
    </div>
  </div>
</template>
<script>
import MapCity from '@/components/chart/MapCity.vue'

export default {
  name: 'ProvinceList',
  data () {
    return {
      w: 500,
      h: 300,
      option: false,
      list: ['河南/郑州市', '北京/北京'],
      current: 0
    }
  },
  components: {
    MapCity
  },
  methods: {
    makeUpMap () {
      const nowV = {
        w: this.w + 'px',
        h: this.h + 'px',
        name: this.list[this.current]
      }
      // 预览的时候做验重判断
      const flag = Object.keys(nowV).some((v) => {
        return nowV[v] !== this.option[v]
      })
      if (flag) {
        this.option = nowV
      }
    }
  }
  
}
</script>
<style lang="scss" scoped>
.main{
  display: flex;
  padding: 30px;
  justify-content: center;
  ul{
    display:flex;
    margin-bottom: 30px;
    li {
      flex-basis: 100px;
      // flex-grow: 1;
      cursor: pointer;
    }
  }
  .active {
    color:#42b983
  }
  input{
    display: block;
    margin-bottom: 15px;
    padding: 4px 8px;
    color: #555;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}
</style>
