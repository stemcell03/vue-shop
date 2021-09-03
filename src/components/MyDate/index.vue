<template>
  <el-date-picker
    v-model="value"
    type="date"
    placeholder="选择日期">
  </el-date-picker>
</template>
<script>
export default {
  name:'MyDate',
  props:['value'],
  data() {
    return {
      
    }
  },
  methods: {

  },
}
</script>
<style lang='scss' scoped>

</style>