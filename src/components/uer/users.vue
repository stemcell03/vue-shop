<template>
  <div>
    <!-- 面包屑布局 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片布局 -->
    <!-- 栅格布局layout -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true ">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 注意:slot-scope/v-slot 是vue自带的,而scope可以任意取名,scope上的row方法是elementui提供的 -->
            <el-switch v-model="scope.row.mg_state" @change="userstateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <!-- 修改 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <!-- 分配 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogclosed"
    >
      <div>
        <p>当前用户:{{ userInfo.username}}</p>
        <p>当前角色:{{ userInfo.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱规则
    var checkEmail=(rule, value, cb) => {
      //验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    //验证电话规则
    var checkMobile=(rule, value, cb) =>{
      //验证电话的正则
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      //获取用户的参数数据
      queryInfo:{
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //查询到的用户信息
      editForm:{},

      userList:[],
      // 所有角色的数据列表
      rolesList:[],
      // 已选中的id值
      selectedRoleId:'',
      //总页数
      total:0,
      //控制对话框提示的显示与隐藏
      addDialogVisible:false,
      editDialogVisible:false,
      setRoleDialogVisible:false,
      //添加用户表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      // 分配角色保存的数据
      userInfo:{},
      // 添加用户表单验证规则
      addFormRules:{
        username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],        
        password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],       
        email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
        ],        
        mobile:[
            { required: true, message: '请输入电话', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules:{
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
        ],        
          mobile:[
            { required: true, message: '请输入电话', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
        ]}
    }
  },
  created() {
      this.getUserList()
    },
  methods:{
    //获取用户列表
    async getUserList(){
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
      //console.log(res)
    },
    //当前页面可容纳条数
    handleSizeChange(newsize){
      //console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    //页数
    handleCurrentChange(newpage){
      //console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    //监听switch开关状态改变事件
    async userstateChange(userInfo){
      //console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if( res.meta.status !== 200 ) {
        userInfo.mg_state = !userInfo.mg_state
        return  this.$message.error("更新状态失败")
      }
      this.$message.success("更新状态成功")
    },
    //监听对话框关闭事件
    addDialogClosed(){
      this.$refs.addFormref.resetFields()
    },
    //点击按钮，添加新用户
    addUser(){
      //预校验,判断是否符合规则
      this.$refs.addFormref.validate( async valid => {
        //console.log(valid)
        if(!valid) return
        //发起添加用户的请求
        const { data: res } = await this.$http.post('users',this.addForm)

        if(res.meta.status !== 201){
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        //隐藏对话框
        this.addDialogVisible = false
        //重新获取用户列表
        this.getUserList()
      })
    },
    //展示编辑用户的对话框
    async showEditDialog(id){
      
      const { data: res } = await this.$http.get("users/" + id)
      if( res.meta.status !== 200){
        return this.$message.error('查询用户失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },

    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //修改用户预验证
    editUserInfo(){
      this.$refs.editFormRef.validate( async valid => {
        if(!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        console.log(res.meta.status)
        if(res.meta.status !== 200){
          return this.$message.error('更新用信息失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据列表
        this.getUserList()
        //提示修改成功
        this.$message.success('成功更新用户数据')
      })
    },
    //删除操作
    async removeUserById(id){
      //弹框询问
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch( err => err )
          //如果用户确定删除则返回 confirm 字符串
          //取消则报错，由catch捕获，返回 cancel 字符串
        if( confirmRes !== 'confirm'){
          return this.$message.info('取消删除')
        }
        const {data:res} = await this.$http.delete('users/'+id)
        if(res.meta.status !== 200)
          return this.$message.error("删除用户失败")
        this.$message.success('删除用户成功')
        this.getUserList()
      },
      // 分配角色对话框
      async setRole(userInfo){
        this.setRoleDialogVisible = true

        // 展示对话框之前获取角色列表
        const {data:res} = await this.$http.get('roles')
        if( res.meta.status !== 200 ) {
          return this.$message.error('获取角色列表失败')
        }
        this.rolesList = res.data
        this.userInfo = userInfo
      },
      async saveRoleInfo(){
        if(!this.selectedRoleId){
          this.$message.error('请选择角色')
        }
        const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
          rid:this.selectedRoleId
        })

        if( res.meta.status !== 200 ) {
          return this.$message.error('更新角色失败')
        }

        this.$message.success('更新角色成功')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      setRoleDialogclosed(){
        this.selectedRoleId=''
        this.userInfo={}
      }
    }
  }
</script>

<style lang="less" scoped>

</style>