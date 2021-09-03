<template>
  <div class="panel">
    <h2>xwas</h2>
    <div class="chart"></div>
    <div class="panel-footer"></div>
  </div>
</template>
<script>
export default {
  name:'Panel',
  data() {
    return {

    }
  },
  methods: {},
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
    background-color: pink;
  }
}
</style>