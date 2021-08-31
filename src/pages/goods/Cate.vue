<template>
  <div>
    <!-- 面包屑布局 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-tabel
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        class="treetabel"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!--排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditCateDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCateById(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-tabel>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" prop="name">
          <!-- options指定数据源，v-model同props的value绑定，即当前选中父级分类id -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderPerops"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo:{
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      // 商品分类数据列表
      cateList:[],
      parentCateList:[],
      cascaderPerops:{
        expandTrigger: 'hover' ,
        checkStrictly:true,
        value:'cat_id', //值的关联数据
        label:'cat_name',// 标签显示值
        children:'children'
      },
      // 选中的父级分类id的数组
      selectedKeys:[],
      // 添加分类的表单数据对象
      addCateForm:{

        cat_name:'',
        // 父级分类的id
        cat_pid: 0,
        // 父级的等级
        cat_level: 0
      },
      editCateForm:{

      },
      addCateFormRules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 总数据条数
      total:0,
      // 控制对话框的显示与隐藏
      addCateDialogVisible:false,
      editCateDialogVisible:false,

      //
      columns:[
        {
          label:'商品名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          // 表示将当前定义列作为模板
          type:'template',
          // 模板应用与
          template:'isok'
        },
        {
          label:'排序',
          // 表示将当前定义列作为模板
          type:'template',
          // 模板应用与
          template:'order'
        },
        {
          label:'操作',
          // 表示将当前定义列作为模板
          type:'template',
          // 模板应用与
          template:'opt'
        }
      ]

    }
  },
  created() {
      this.getCateList()
    },
  methods:{
    //获取分类列表
    async getCateList(){


      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })


      if(res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res.data)
      // console.log(this.queryInfo.pagenum)
      // console.log(this.total)
      // console.log(this.queryInfo.pagesize)

      // if( (this.total-1) / (this.queryInfo.pagenum - 1) === this.queryInfo.pagesize){
      //   this.queryInfo.pagenum= this.queryInfo.pagenum -1 
      // }
      // console.log(this.queryInfo.pagenum)
      //console.log(res)
    },
    //当前页面可容纳条数
    handleSizeChange(newsize){
      //console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getCateList()

    },
    //页数
    handleCurrentChange(newpage){
      //console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    showAddCateDialog(){
      // 先获取父级分类列表
      this.getParentCateList()
      // 再显示对话框
      this.addCateDialogVisible=true
    },
    // 获取父级分类的数据列表
    async getParentCateList(){
      const { data:res } = await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status !==200 ){
        return this.$message.error('获取父级分类数据失败')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化时触发
    parentCateChanged(){
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的length大于0，说明有选择父类，且父类id为数组的最后一项，反之则没有
      if(this.selectedKeys.length > 0){
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的父级赋值
        this.addCateForm.cat_level = 0 
      }
      
    },
    addCate(){
      //预校验,判断是否符合规则
      this.$refs.addCateFormRef.validate( async valid => {
        //console.log(valid)
        if(!valid) return
        //发起添加用户的请求
        const { data: res } = await this.$http.post('categories',this.addCateForm)

        if(res.meta.status !== 201){
          this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        //隐藏对话框
        this.addCateDialogVisible = false
        //重新获取用户列表
        this.getCateList()
      })
    },
    // 表单重置
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    async showEditCateDialog(id){
      const { data: res } = await this.$http.get("categories/" + id)
      if( res.meta.status !== 200){
        return this.$message.error('查询分类信息失败')
      }
      this.editCateForm= res.data
      this.editCateDialogVisible = true
    },
    editCate(){
      this.$refs.editCateFormRef.validate( async valid => {

        if(!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, {
          cat_name:this.editCateForm.cat_name
        })

        //console.log(res.meta.status)
        if(res.meta.status !== 200){
          return this.$message.error('更新分类信息失败')
        }
        //关闭对话框
        this.editCateDialogVisible = false
        //刷新数据列表
        this.getCateList()
        //提示修改成功
        this.$message.success('成功更新分类数据')
      })
    },
    editCateDialogClosed(){
      this.$refs.editCateFormRef.resetFields()

    },
    // 删除
    async removeCateById(id){


      //弹框询问
      const confirmRes = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch( err => err )
        //如果用户确定删除则返回 confirm 字符串
        //取消则报错，由catch捕获，返回 cancel 字符串
      if( confirmRes !== 'confirm'){
        return this.$message.info('取消删除')
      }
      const {data:res} = await this.$http.delete('categories/'+id)
      if(res.meta.status !== 200)
        return this.$message.error("删除分类失败")
      this.$message.success('删除分类成功')

      // console.log(this.queryInfo.pagenum)
      // console.log(this.total)
      // console.log(this.queryInfo.pagesize)

      if( (this.total-1) / (this.queryInfo.pagenum - 1) === this.queryInfo.pagesize){
        this.queryInfo.pagenum = this.queryInfo.pagenum -1 
      }
      // console.log(this.queryInfo.pagenum)

      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
  .treetabel{
    margin-top: 15px;
  }
  .el-cascader{
    width: 100%;
  }
</style>