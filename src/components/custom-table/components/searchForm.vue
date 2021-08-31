<template>
  <div class="search">
      <el-form ref="form" :model="form" :label-width="options.lableWidth" inline>
        <el-form-item :label="i.label + ':'" v-for="i in options.items" :key="i.prop">
          <component :is="'el-'+ (i.type || 'input')" v-model="form[i.prop]" clearable :style="{'width':i.width || 'auto'}"></component>
        </el-form-item>

        <el-form-item class="right">
          <el-button type="primary" @click="$listeners.search(form)">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
export default {
  name:'SearchForm',
  props:['options'],
  data() {
    return {
      form:{}
    }
  },
  mounted(){
  },
  methods: {
    reset(){
      this.form={}
      this.$listeners.search({})
    }
  },
}
</script>
<style lang='scss' scoped>
.search{
  padding-bottom: 20px;
}
.right{
  float: right;
  ::after{
    content: '';
    clear: both;
  }
}
</style>