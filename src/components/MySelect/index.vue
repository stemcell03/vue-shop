<template>
  <el-select>
    <el-option
      v-for="item in propOptions.dicData"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name:'MySelect',
  props:['propOptions'],
  data() {
    return {

    }
  },
  methods: {},
}
</script>
<style lang='scss' scoped>

</style>