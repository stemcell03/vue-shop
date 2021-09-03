<template>
  <div class="search">
      <el-form ref="form" :model="form" :label-width="options.lableWidth" inline>
        <el-form-item :label="i.label + ':'" v-for="i in options.items" :key="i.prop">
          <component 
            :is="getType(i.type)"
            v-model="form[i.prop]"
            clearable
            :disabled="options.disabled || false"
            :placeholder="options.placeholder || ''"
            :style="{'width':i.width || 'auto'}"
            @change="handleChange"
            ></component>
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
  computed:{

  },
  created(){
    const temp = {}
    this.options.items.forEach(e => { 
      temp[e.prop] = ''
    })
    this.form = temp
    console.log(this.form,'this.form,');
  },
  methods: {
    handleChange(v){
      console.log(v);
    },
    reset(){
      this.form={}
      this.$listeners.search({})
    },
    getType(v){
      
      let type = 'my-input'
      switch (v) {
        case 'select':
          type = 'my-select'
          break;
        case 'date':
          type = 'my-date'
          break;
        default:
          break;
      }
      console.log(v,type);
      return type
    },
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