<template>
  <div class="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.currentPage"
      :page-sizes="pages.pageSizes"
      :page-size="pages.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pages.total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name:'Pagination',
  props:['pages'],
  data() {
    return {
      
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log( this.$listeners);
      this.$listeners['size-change'] && this.$listeners['size-change'](val)
    },
    handleCurrentChange(val) {
      console.log( this.$listeners);

      this.$listeners['current-change'] && this.$listeners['current-change'](val)
    }
  },

}
</script>
<style lang='scss' scoped>
.pagination{
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}
</style>