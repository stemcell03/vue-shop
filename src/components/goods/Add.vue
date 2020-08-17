<template>
  <div>
    <!-- 面包屑布局 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- from表单必须放在label外面 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏区域 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="leaveTag"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderPerops"
                @change="handlechange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            e
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览区域 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" class="previewImg" alt="Image" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex:'0',
      cateList:[],
      // 图片保存地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      previewPath:'',
      previewDialogVisible:false,
      // 动态参数列表数据
      headerObj:{
        Authorization: window.sessionStorage.getItem('token')
      },
      manyTableData:[],
      onlyTableData:[],
      cascaderPerops:{
        expandTrigger: 'hover' ,
        value:'cat_id', //值的关联数据
        label:'cat_name',// 标签显示值
        children:'children'
      },

      addForm:{
        goods_name:'',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat:[],
        pics:[],
        goods_introduce:'',
        attrs:[]
      },
      addFormRules:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat:[
          { required: true, message: '请输入商品分类', trigger: 'change' }
        ]
      }
    }
  },
  created(){
      this.getCateList()
  },
  methods: {
//获取分类列表
    async getCateList(){
      const { data: res } = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.cateList = res.data
      //console.log(res.data)
    },
    handlechange(){
      console.log(this.addForm.goods_cat)
       if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat = []
      }
    },
    leaveTag(activeName, oldActiveName){
      if( oldActiveName === "0" && this.addForm.goods_cat.length !==3 ){
        this.$message.error('请选择商品分类')
        return false
      }

    },
    async tabClick(){
      console.log(this.activeIndex)
      if(this.activeIndex === '1'){
        const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel:'many'}})
      
        if(res.meta.status !== 200){
          this.$message.error('获取动态参数列表失败')
        }  
        console.log(res.data)
        res.data.forEach( item => {
          item.attr_vals = item.attr_vals.length === 0 ? []:item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      }else if(this.activeIndex === '2'){
        const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel:'only'}})
        if(res.meta.status !== 200){
          this.$message.error('获取静态属性列表失败')
        }  
        console.log(res.data)
        this.onlyTableData = res.data

      }
    },
    // 点击预览事件
    handlePreview(file){
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 移除
    handleRemove(file){
      // 获取临时路径
      const filePath = file.response.data.tmp_path 
      // 获取pics数组内对应的索引
      const i = this.addForm.pics.findIndex( x => x.pic === filePath)
      // 根据索引使用splice进行移除
      this.addForm.pics.splice( i, 1 )
      console.log(this.addForm)

    },
    handleSuccess(response){
      // 拼接数据项
      const picInfo = { pic: response.data.tmp_path}
      // push 保存数据
      this.addForm.pics.push( picInfo )

      console.log(this.addForm)
    },
    add(){
      this.$refs.addFormRef.validate( async valid => {
        if( !valid ){
          return this.$message.error('请填写必填项')
        }
        // 执行保存数据
        //  lodash 进行深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',') 
        // 处理动态参数 
        this.manyTableData.forEach( item => {
          const newInfo = { 
            attr_id : item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach( item => {
          const newInfo = { 
            attr_id : item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs

        const { data :res } = await this.$http.post('goods', form)

        if(res.meta.status !== 201 ){
          return this.$message.error('添加失败')
        }

        this.$message.success('添加成功')
        this.$router.push('/goods')


      })
    }
  },
  computed:{
    cateId(){
      if( this.addForm.goods_cat.length === 3 ){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }

}
</script>

<style lang="less" scoped>
.el-checkbox{
  margin: 0 10px 0 0 !important;

}
.previewImg{
  width:100%;
}
。btnAdd{
  margin-top:15px;
}
</style>