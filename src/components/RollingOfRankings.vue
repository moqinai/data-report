<template>
  <div class="rank-wrap">
    <h3>{{datas.title}}</h3>
    <div class="list-title">
      <div class="circle"></div>
      <div
        class="ellipsis"
        v-for="item in datas.field"
        :key="item"
      >
        {{item}}
      </div>
    </div>
    <div class="roll-wrap" ref="rollElement">
      <div
        class="list"
        v-for="(v,i) in rankList"
        :key="v.id"
        :style="{transform: 'translate(0, '+(175+i*35)+'px)'}"
        :data-index="i"
      >
        <div
          class="circle"
          :class="circleColor[i>2 ? 'other' : i]"
        >
          {{i+1}}
        </div>
        <div
          class="ellipsis"
          v-for="item in datas.field"
          :key="item"
        >
          {{v[item]}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RollingOfRankings',
  props: {
    datas: Object
  },
  data () {
    return {
      rankList: [],
      timer: 0, // 定时器
      timerDuration: 10000, // 定时器持续时长(s)
      timerDurationNumber: 60000, // 每间隔n秒更新数据
      circleColor: {
        0: 'bg-orange',
        1: 'bg-light-orange',
        2: 'bg-yellow',
        other: 'bg-cyan'
      }
    }
  },
  created () {
    this.getData();
    setInterval(() => {
      clearTimeout(this.timer);
      this.getData()
    }, this.timerDurationNumber)
  },
  methods: {
    getData () {
      this.$get(this.datas.url, this.datas.data).then((r) => {
        if (Object.prototype.toString.call(r).slice(8, -1) === 'Array') {
          r.forEach((v, i) => {
            v.id = Date.now() + '' + i;
          });

          this.rankList = r;
          this.$nextTick(() => {
            this.initRoll('init')
          })
        }
      })
    },
    initRoll (flag) {
      let el = this.$refs.rollElement;
      let child = el.children || [];
      const len = child.length;
      const cycle = Math.ceil(len/5); // 循环周期
      el.loopCurrent = 0; // 当前循环动画队列执行索引
      el.current = 0;// 当前循环(有且仅有一次0，初始化时)
      const eventTransitionend = () => {
        if (++el.loopCurrent !== len) return
        // 动画队列执行完毕
        el.loopCurrent = 0;
        if (el.current) {
          // 实现无限衔接滚动，每次把滚动到上部视区之外的元素移到队列最后
          const lenEach = el.current !== cycle ? 5 : len%5 === 0 ? 5 : len%5
          for (let i = 0; i < lenEach; i++) {
            let childR = el.removeChild(child[0]);
            const index = +childR.getAttribute('data-index')%5;
            childR.style.transform = 'translate(0, '+ (35*index+175*(cycle-1)) +'px)';
            el.appendChild(childR)
          }
        }
        this.timer = setTimeout(() => {
          el.current = el.current === cycle ? 1 : ++el.current;
          this.doTransform(child)
        }, this.timerDuration)
      }
      if (cycle > 1 && !this.timer) {
        el.addEventListener('transitionend', eventTransitionend, false)
      }
      this.doTransform(child)
    },
    doTransform (child) {
      [].slice.call(child).forEach((v, i) => {
        const preY = parseInt(v.style.transform.split(',')[1], 10);
        v.style.cssText += ';transition-duration: 1s;transform:translate(0, '+ (preY-175) +'px)';
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="scss" scoped>
  .rank-wrap {
    overflow: hidden;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 15px;
    width: 100%;
    height: 294px;
    color:#fff;
    border-style: solid;
    border-width: 14px 20px;
    border-image-source: url('../assets/img/rank-border.png');
    border-image-slice: 14 20;
  }
  .rank-wrap h3 {
    font-size: 24px;
    line-height: 1.5;
    font-weight: normal;
    color: rgb(248, 188, 56);
  }
  .roll-wrap{
    position: relative;
    overflow: hidden;
    height: 175px;
  }
  .list-title{
    overflow: hidden;
    display: flex;
    align-items: center;

    &>div{
      flex-grow: 1;
      flex-basis: 25%;
      font-size: 16px;
      line-height: 35px;
      text-align: left;
    }
    .circle{
      flex-basis: 20px;
      flex-grow: 0;
      margin-right: 10px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-size: 14px;
      border-radius: 50%;
      opacity: 0
    }
  }
  .list{
    @extend .list-title;
    position: absolute;
    width: 100%;
    transition: transform 1s cubic-bezier(0, .3, .58, 1); 
    .circle{
      opacity: 1
    }
  }
  .bg-orange{
    background-color: rgb(255, 96, 41);
  }
  .bg-light-orange{
    background-color: rgb(255, 135, 42);
  }
  .bg-yellow {
    background-color: rgb(240, 171, 56);
  }
  .bg-cyan {
    background-color: rgb(68, 211, 228);
  }
</style>
