<template>
  <div>
    <!-- 面包屑布局 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closeable="false" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染的标签 -->
                <el-tag
                  closable
                  @close="handleClose(i,scope.row)"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                >{{ item }}</el-tag>
                <!-- 自定义标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>

            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染的标签 -->
                <el-tag
                  closable
                  @close="handleClose(i,scope.row)"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                >{{ item }}</el-tag>
                <!-- 自定义标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>

            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList:[],
      cateProps:{
        expandTrigger: 'hover' ,
        value:'cat_id', //值的关联数据
        label:'cat_name',// 标签显示值
        children:'children'
      },
      addForm:{
        attr_name:''
      },
      editForm:{},
      addFormRules:{
        attr_name:[
        { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },

      // 级联选择框双向绑定的数组
      selectedKeys:[],
      // 被激活页签
      activeName:'many',
      // 保存动态和静态参数的数据
      manyTableData:[],
      onlyTableData:[],
      addDialogVisible:false,
      editDialogVisible:false,
    }
  },
  created(){
    this.getCateList()
  },
  methods: {
    async getCateList(){
                  const { data:res } = await this.$http.get('categories')
      if( res.meta.status !== 200 ){
        return this.$message.error('获取商品列表失败')
      }
      this.cateList = res.data
    },
    handleTabClick(){
      this.getParamsData()
    },
    // 三级分类才可以被选中
    handleChange(){
      this.getParamsData()

    },

    // 获取参数的列表数据
    async getParamsData(){
      if(this.selectedKeys.length !== 3 ){
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return  
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}}) 
      if( res.meta.status !== 200){
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach( item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if(this.activeName === 'many'){
        this.manyTableData = res.data
      }else{
         this.onlyTableData = res.data
      }
    },  
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    addParams(){
      this.$refs.addFormRef.validate( async valid => {

        if(!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })

        //console.log(res.meta.status)
        if(res.meta.status !== 201){
          return this.$message.error('添加信息失败')
        }
        //关闭对话框
        this.addDialogVisible = false
        //刷新数据列表
        this.getParamsData()
        //提示修改成功
        this.$message.success('成功添加信息')
      })
    },
    editParams(){
      this.$refs.editFormRef.validate( async valid => {

      if(!valid) return
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
        attr_name:this.editForm.attr_name,
        attr_sel:this.activeName
      })

      //console.log(res.meta.status)
      if(res.meta.status !== 200){
        return this.$message.error('修改信息失败')
      }
      //关闭对话框
      this.editDialogVisible = false
      //刷新数据列表
      this.getParamsData()
      //提示修改成功
      this.$message.success('修改信息成功')
      })
    },
    async showEditDialog(attr_id){
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{ params:{attr_sel:this.activeName}}) 
      if( res.meta.status !== 200){
        return this.$message.error('获取参数列表失败')
      }

      this.editForm = res.data

      this.editDialogVisible = true
    },
    async removeParams(attr_id){
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
      const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if(res.meta.status !== 200)
        return this.$message.error("删除参数失败")
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    // 当文本框失去焦点或按下enter  
    handleInputConfirm(row){
      this.saveAttrVals(row)
    },
    // 获取参数标签值并保存到数据库中
    async saveAttrVals(row){
      //  用户输入为空
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible=false
        return
      }
      // 输入合法
      row.attr_vals.push( row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible=false
      const {data :res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(',')
      })
      if(res.meta.status !== 200){
        this.$message.error('添加参数失败')
      }
      this.$message.success('添加参数成功')
    },
    showInput(row){
      row.inputVisible=true
      // $nextTick 当前页面元素重新渲染使触发
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
    },
    // 删除参数标签
    handleClose(i, row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    }

  },
  computed:{
    // 如果按钮被禁用,返回true
    isBtnDisabled(){
      return this.selectedKeys.length !== 3
    },
    // 当前选中的三级分类id
    cateId(){
      if(this.selectedKeys.length === 3){
        return this.selectedKeys[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
  .cat_opt{
    margin:15px 0;
  }
  .el-tag{
    margin: 5px;
  }
  .input-new-tag{
    width: 120px;
  }
</style>
