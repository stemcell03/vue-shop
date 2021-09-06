<template>
  <div class="panel">
    <h2>
      {{option.title}}
      <slot name="titleLink"></slot>
    </h2>
    <div 
      :id="ids"
      class="chart">
      <slot></slot>
    </div>
    <div class="panel-footer"></div>
  </div>
</template>
<script>
export default {
  name:'Panel',
  props:['ids','option'],
  data() {
    return {
    }
  },
  mounted(){
    this.initEcharts()
  },
  methods: {
    initEcharts(){
      const _this = this
      const myChart = this.$echarts.init(document.getElementById(this.ids))
      myChart.setOption(this.option.option)
      window.addEventListener("resize", function () {
        myChart.resize()
      })
      window.addEventListener("custom-resize", function (event) {
        const a = setTimeout(function(){
          myChart.resize()
          clearTimeout(a)
        },100)
      })
      const b = window.addEventListener("custom-chartReset", function (event) {
        setTimeout(function(){
          myChart.setOption(_this.option.option)
          clearTimeout(b)
        },100)
      })
    }
  },
}
</script>
<style lang='scss' scoped>
.panel {
  position: relative;
  height: 310px;
  border: 1px solid rgba(25, 186, 139, 0.17);
  background: url('~@/assets/images/line(1).png');
  padding: 0 15px 40px;
  margin-bottom: 15px;
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 10px;
    height: 10px;
    border-top: 2px solid #02a6b5;
    border-left: 2px solid #02a6b5;
  }
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    content: "";
    width: 10px;
    height: 10px;
    border-top: 2px solid #02a6b5;
    border-right: 2px solid #02a6b5;
  }
  .panel-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      content: "";
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #02a6b5;
      border-left: 2px solid #02a6b5;
    }
    &::after {
      position: absolute;
      bottom: 0;
      right: 0;
      content: "";
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #02a6b5;
      border-right: 2px solid #02a6b5;
    }
  }
  h2 {
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    font-weight: 400;
  }
  .chart {
    height: 240px;
    position: relative;
  }
}
</style>