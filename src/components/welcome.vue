<template>
  <div class="echarts">
    <header>
      <h1>数据可视化-ECharts</h1>
      <div class="showTime">{{currentTime}}</div>
    </header>
    <section class="main">
      <div class="column">
        <panel v-for="i in 3" :key="i"/>
      </div>
      <div class="column">
        <div class="no">
          <div class="no-hd">
            <ul>
              <li>11111</li>
              <li>22222</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>人数</li>
              <li>宗苏</li>
            </ul>
          </div>
        </div>
        <div class="map">
          <div class="map-bg1"></div>
          <div class="map-bg2"></div>
          <div class="map-bg3"></div>
          <div class="chart"></div>
        </div>
      </div>
      <div class="column">
        <div class="column">
          <panel v-for="i in 3" :key="i"/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Panel from '@/components/dataView/panel.vue'
export default {
  components:{
    Panel
  },
  data () {
    return {
      currentTime:'',
      t:null
    }
  }, 
  computed:{

  },
  mounted(){
    this.getTime()
  },
  methods: {
    getTime(){
        this.t = setTimeout(time, 1000); //開始运行
        const _this = this
        function time() {
          clearTimeout(this.t); //清除定时器
          const dt = new Date();
          var y = dt.getFullYear();
          var mt = dt.getMonth() + 1;
          var day = dt.getDate();
          var h = dt.getHours(); //获取时
          var m = dt.getMinutes(); //获取分
          var s = dt.getSeconds(); //获取秒
          _this.currentTime =  "当前时间：" + y + "年" + mt + "月" + day + "日" + "-" + h + "时" + m + "分" + s + "秒";
          _this.t = setTimeout(time, 1000); //设定定时器，循环运行
        }
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
@font-face {
  font-family: electronicFont;
  src: url('~@/assets/fonts/DS-DIGIT.TTF');
}
.echarts {
  background: url('~@/assets/images/bg.jpg') top center;
  background-repeat: repeat-y;
  width: 100%;
  position: absolute;
  header{
    color: #fff;
    height: 100px;
    background-image: url('~@/assets/images/head_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    h1{
      font-size: 18px;
      text-align: center;
      line-height: 80px;
    }
    .showTime{
      position: absolute;
      top: 0px;
      right: 20px;
      line-height: 80px;
      opacity: 0.7;
      font-size: 14px;
    }
  }
  .main{
    width: auto;
    margin: 0 auto;
    padding: 10px 10px 0;
    display: flex;
    .column {
      flex: 3;
      &:nth-child(2) {
        flex: 5;
        margin: 0 10px 15px;
        .no{
          padding:15px;
          background-color:rgba(101, 132, 226, 0.1);
          .no-hd {
            position: relative;
            border: 1px solid rgba(25, 186, 139, 0.17);
            &::before {
              content: "";
              position: absolute;
              width: 30px;
              height: 10px;
              border-top: 2px solid #02a6b5;
              border-left: 2px solid #02a6b5;
              top: 0;
              left: 0;
            }
            &::after {
              content: "";
              position: absolute;
              width: 30px;
              height: 10px;
              border-bottom: 2px solid #02a6b5;
              border-right: 2px solid #02a6b5;
              right: 0;
              bottom: 0;
            }
            ul {
              display: flex;
              li {
                position: relative;
                flex: 1;
                text-align: center;
                height: 80px;
                line-height: 80px;
                font-size: 70px;
                color: #ffeb7b;
                padding: 4px 0;
                font-family: electronicFont;
                font-weight: bold;
                &:first-child::after {
                  content: "";
                  position: absolute;
                  height: 50%;
                  width: 1px;
                  background: rgba(255, 255, 255, 0.2);
                  right: 0;
                  top: 25%;
                }
              }
            }
          }
          .no-bd{
            ul{
              display: flex;
              li{
                flex: 1;
                text-align: center;
                color: rgba($color: #fff, $alpha: 0.7);
                font-size: 18px;
                height: 40px;
                line-height: 40px;
                padding-top: 10px;
              }
            }
          }
        }
        .map{
          height: 810px;
          position: relative;
          .map-bg1{
            height: 518px;
            width: 518px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background-image: url('~@/assets/images/map.png');
            background-size: 100% 100%;
            opacity: 0.3;
            z-index: 1;
          }
          .map-bg2{
            height: 643px;
            width: 643px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background-image: url('~@/assets/images/lbx.png');
            background-size: 100% 100%;
            opacity: 0.6;
            z-index: 2;
            animation: rotate 15s linear infinite;
          }
          .map-bg3{
            height: 566px;
            width: 566px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background-image: url('~@/assets/images/jt.png');
            background-size: 100% 100%;
            opacity: 0.3;
            animation: rotate 10s linear infinite reverse;
          }
          @keyframes rotate {
            from{
              transform: translate(-50%,-50%) rotate(0deg);
            }
            to{
              transform: translate(-50%,-50%) rotate(360deg);
            }
          }
          .chart{
            height: 810px;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    } 
  } 
}
</style>