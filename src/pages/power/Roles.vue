<template>
  <div>
    <!-- 面包屑布局 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleDialog()">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列  -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[ 'bdbottom', i1 === 0 ? 'bdtop':'','vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二，三级权限 -->
              <el-col :span="19">
                <!-- 使用v-for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '':'bdtop','vcenter']"
                  v-for=" ( item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 数据列 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRoleEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form :model="addRoleForm" ref="addRoleFormref" label-width="90px" :rules="roleFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClosed"
    >
      <el-form
        :model="editRoleForm"
        :rules="roleFormRules"
        ref="editRoleFormRef"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      roleList:[],
      // 角色权限列表
      rightsList:[],
      // 树形控件的绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      // 对话框显示属性
      editRoleDialogVisible:false,
      addRoleDialogVisible:false,
      setRightDialogVisible:false,
      // 修改角色表单信息
      editRoleForm:{},      
      // 添加角色信息
      addRoleForm:{},
      // 树形控件的已选定数组
      defKeys:[],
      roleId:'',
      roleFormRules:{
        roleName:[
            { required: true, message: '请输入角色名称', trigger: 'blur' },
        ]
      },
    }
  },
  created(){
    this.getRoleList()
  
  },
  methods:{
    // 获取角色列表
    async getRoleList(){
      const { data: res } = await this.$http.get('roles')

      if( res.meta.status !== 200)
        return this.$message.error('获取用户权限列表失败')
      // this.$message.success('获取用户权限列表成功')
      this.roleList = res.data
      console.log(this.roleList,'this.roleList');
      //console.log(this.roleList)
    },
    // 展示修改角色对话框
    async showRoleEditDialog(id){
      const { data: res } = await this.$http.get("roles/" + id)
      if( res.meta.status !== 200){
        return this.$message.error('查询角色信息失败')
      }
      this.editRoleForm= res.data
      this.editRoleDialogVisible = true
    },
    // 展示添加角色对话框
     async showAddRoleDialog(){

      this.addRoleDialogVisible = true
    },
    // 展示分配权限对话框
    async showSetRightDialog(role){
      // 保存id数据
      this.roleId = role.id
      // 获取权限数据
      const { data: res } = await this.$http.get("rights/tree")
      if( res.meta.status !== 200){
        return this.$message.error('获取权限失败')
      }

      // 获取到的权限数据保存到data中
      this.rightsList = res.data
      //console.log(this.rightsList)

      // 递归获取id
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },
    async removeRightById(role, rightsId){
      // 弹框提示用户是否删除
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if( confirmRes !== 'confirm'){
          return this.$message.info('取消删除')
        }
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
        if(res.meta.status !== 200 ){
          return this.$message.error('删除失败')
        }
        // this.getRoleList()
        // 数据是数组，引用，修改值内容也会实时显示
        role.children = res.data
    },
    // 通过递归的方式获取角色的三级权限的id，并保存到 defKeys 数组中
    getLeafKeys( node, arr){
      // 如果当前节点不包含children 则为三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach( item => {
        this.getLeafKeys(item,arr)
      })
    },
    // 监听编辑权限对话框关闭，将权限数组置为空
    setRightDialogClosed(){
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights(){

        const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      //console.log(keys)
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`, { rids:idStr })
      if(res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    },

    // 修改角色预验证
    editRoleInfo(){        
      this.$refs.editRoleFormRef.validate( async valid => {
        if(!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId, {
          roleName:this.editRoleForm.roleName,
          roleDesc:this.editRoleForm.roleDesc
        })

        //console.log(res.meta.status)
        if(res.meta.status !== 200){
          return this.$message.error('更新角色信息失败')
        }
        //关闭对话框Role
        this.editRoleDialogVisible = false
        //刷新数据列表
        this.getRoleList()
        //提示修改成功
        this.$message.success('成功更新角色数据')
      })
    },
    //监听对话框关闭事件,將输入的验证重置
    addRoleDialogClosed(){
      this.$refs.addRoleFormref.resetFields()
    },
    //监听对话框关闭事件,將输入的验证重置
    editRoleDialogClosed(){
      this.$refs.editRoleFormRef.resetFields()
    },
    // 添加角色
    addRole(){
       //预校验,判断是否符合规则
      this.$refs.addRoleFormref.validate( async valid => {
        //console.log(valid)
        if(!valid) return
        //发起添加用户的请求
        const { data: res } = await this.$http.post('roles',this.addRoleForm)

        if(res.meta.status !== 201){
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        //隐藏对话框
        this.addRoleDialogVisible = false
        //重新获取用户列表
        this.getRoleList()
      })
    },
    // 删除
    async removeRoleById(id){
      //弹框询问
      const confirmRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch( err => err )
        //如果用户确定删除则返回 confirm 字符串
        //取消则报错，由catch捕获，返回 cancel 字符串
      if( confirmRes !== 'confirm'){
        return this.$message.info('取消删除')
      }
      const {data:res} = await this.$http.delete('roles/'+id)
      if(res.meta.status !== 200)
        return this.$message.error("删除角色失败")
      this.$message.success('删除角色成功')
      this.getRoleList()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }

  .bdtop{
    border-top: solid 1px #eee;
  }

  .bdbottom{
    border-bottom: solid 1px #eee;
  }
  
  .vcenter{
    display: flex;
    align-items: center;
  }

</style>