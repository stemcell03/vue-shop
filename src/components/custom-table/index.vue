<template>
  <div>
    <el-card >
      <search-form v-bind="$props" v-on="$listeners"></search-form>
      <slot name="header"></slot>
      <slot></slot>
      <pagination v-bind="$props" v-on="$listeners"></pagination>
    </el-card>
  </div>
</template>
<script>
import Pagination from './components/pagination.vue'
import SearchForm from './components/searchForm.vue'

export default {
  name:'CustomTable',
  components:{
    Pagination,
    SearchForm,
  },
  props:{
    pages:{
      type: Object,
      default:() => {
        return {
          currentPage:1,
          total:10,
          pageSize:10,
          pageSizes:[10,20,30,50]
        }
      }
    },
    options:{
      type: Object,
      default:() => {
        return {

        }
      }
    }
  },
  watch:{
    options:{
      immediate:true,
      handler(v){
        console.log(v,'options');
      }
    }
  },
  data() {
    return {

    }
  },
  created(){

  },
  mounted(){
    this.init()
  },
  methods: {
    init(){
    }
  },
}
</script>
<style lang='scss' scoped>

</style>