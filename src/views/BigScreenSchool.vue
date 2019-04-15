<template>
  <div class="wrap clearfix">
    <div class="main-left">
      <RollingOfRankings :datas=computedPostParams().DayAreaRank />
      <div class="rank-wrap">
        <h3 id="headGradeRank"></h3>
        <div class="list-title" id="titleGradeRank">
        </div>
        <div class="roll-wrap" id="gradeRank">
        </div>
      </div>
      <div class="rank-wrap">
        <h3>班课科目分布</h3>
        <div class="pie-picture" id="classSubject"></div>
        <!-- <MapCity /> -->
      </div>
    </div>
    <div class="main-middle">
      <h3 id="schoolName">{{schoolName}}</h3>
      <div class="middle-title">
        <h4>今日收款</h4>
        <p><canvas class="watch" id="watch"></canvas><span id="time"></span></p>
      </div>
      <div class="money-wrap">
        <span>¥</span>
        <span id="dayRealIncome"><i>5</i><i>0</i></span>
      </div>
      <div class="money-footer">
        <p>报名人数：<span id="dayPeopleNum">2</span></p>
        <p>报名人次：<span id="dayRegNum">4</span></p>
        <p>本周收款：<span id="weekRealIncome">4000000.50</span> 元</p>
      </div>
      <AreaBasic :datas=computedPostParams().DayHourMoneyNew />
    </div>
    <div class="main-right">
      <RollingOfRankings :datas=computedPostParams().AreaRepayRank />
      <RollingOfRankings :datas=computedPostParams().ClassRepayRank />
      <div class="rank-wrap">
        <h3 id="headContinueRankClass"></h3>
        <div class="list-title" id="titleContinueRankGrade">
        </div>
        <div class="roll-wrap" id="continueRankGrade">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator'
import RollingOfRankings from '@/components/RollingOfRankings.vue'
import AreaBasic from '@/components/chart/AreaBasic.vue'

/* @Component({
  components: {
  RollingOfRankings,
  AreaBasic,
  }
  }) */
export default {
  
  data () {
    return {
      schoolName: 'vue+typescript fuck !!',
      schoolCode: '02',
      baseUrl: 'http://crm.test.pxjy.com',
      name: 'BigScreenSchool'
    }
  },
  components: {
    RollingOfRankings,
    AreaBasic
  },
  methods: {
    computedPostParams () {
      return {
        DayAreaRank: {
          url: this.baseUrl + '/Api_DataV/getSchoolRealData',
          data: { func: 'DayAreaRank', schoolCode: this.schoolCode },
          title: '校区收入排行',
          field: '校区-金额-人次'.split('-')
        },
        ClassRepayRank: {
          url: this.baseUrl + '/Api_DataV/getSchoolRealData',
          data: { func: 'ClassRepayRank', schoolCode: this.schoolCode },
          title: '班级续班Top10',
          field: '班级-教师-续班率'.split('-')
        },
        AreaRepayRank: {
          url: this.baseUrl + '/Api_DataV/getSchoolRealData',
          data: { func: 'AreaRepayRank', schoolCode: this.schoolCode },
          title: '校区续班Top10',
          field: '校区-人次-续班率'.split('-')
        },
        DayHourMoneyNew: {
          url: this.baseUrl + '/Api_DataV/getSchoolRealData',
          data: { func: 'DayHourMoneyNew', schoolCode: this.schoolCode }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .wrap{
    padding: 16px 8px 0 8px;
    background: url('../assets/img/body-bg.jpg') 0 0 no-repeat;
    background-size: 100% 100%
  }
  .main-left,.main-right{
    float: left;
    width: 25%;
  }
  .main-middle{
    float: left;
    width: 50%;
    padding: 20px 40px;
  }

  .col-50{
    float: left;
    width: -moz-calc(50% - 20px);
    width: -webkit-calc(50% - 20px);
    width: calc(50% - 20px);
    padding-left:10px;
  }
  .col-25{
    float: left;
    width: 25%;
    padding-left:5px;
  }
  .roll-wrap{
    height: 175px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  .roll-wrap .list{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    height: 35px;
    transition: transform .6s cubic-bezier(0, .3, .58, 1);
  }
  .roll-wrap .list:nth-child(2n + 1){
    background-color:rgba(255,255,255,.05)
  }
  .main-middle h3 {
    font-size: 44px;
    font-weight: normal;
    color: rgb(248, 188, 56);
  }
  .middle-title {
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .middle-title h4 {
    float: left;
    width: 50%;
    font-size: 24px;
    line-height: 1;
    font-weight: normal;
    color: rgb(248, 188, 56);
  }
  .middle-title p {
    position: relative;
    float: left;
    font-size: 16px;
    line-height: 24px;
  }
  .watch{
    position: absolute;
    left: -18px;
    top: 4px;
  }

  .money-wrap {
    color: #f8bc38
  }
  .money-wrap span:first-child{
    font-size: 78px;
    padding-right:15px;
  }
  .money-wrap i {
    display: inline-block;
    height: 80px;
    line-height: 1;
    font-size: 80px;
    font-style: normal;
    letter-spacing: 0.02em;
    margin-right: 0.2em;
    background-color: #034d7a;
  }
  .money-footer{
    overflow: hidden;
  }
  .money-footer p {
    float: left;
    width: 180px;
    color: rgb(252, 229, 193);
  }
  .line-picture{
    margin-top: 20px;
    width: 100%;
    height: 400px;
  }
  .pie-picture{
    width: 100%;
    height: 175px;
  }

</style>
