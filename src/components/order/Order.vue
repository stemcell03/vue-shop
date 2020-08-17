<template>
  <div>
    <!-- 面包屑布局 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">{{ scope.row.is_send}}</template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{ scope.row.create_time | dateFormat}}</template>
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

            <el-tooltip class="item" effect="dark" content="定位" placement="top">
              <!-- 进度 -->
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showProgress(scope.row.id)"
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
    <!-- 修改对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editForm.address1"
            :options="cityData"
            :props="cascaderPerops"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 进度对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="progressDialogVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './cityData.js'
export default {
  data() {
    return {
      queryInfo:{
        query:'',
        pagenum: 1,
        pagesize:10
      },
      total:0,
      orderList:[],
      editForm:{
        address1:[],
        address2:''
      },
      editDialogVisible:false,

      progressDialogVisible:false,

      editFormRules:{
        address1:[{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2:[{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cascaderPerops:{
        expandTrigger: 'hover' ,
        children:'children'
      },
      progressInfo:[],
      cityData,

    }
  },
  created(){
    this.getOrderList()
  },
  methods: {
    async getOrderList(){
      const {data:res} = await this.$http.get('orders',{params:this.queryInfo })
      if( res.meta.status !== 200 ){
        return this.$message.error('获取失败')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange(newnum){
      this.queryInfo.pagenum = newnum
      this.getOrderList()
    },
    showEditDialog(id){

      this.editDialogVisible = true
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    async showProgress(id){
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      this.progressDialogVisible = true
            if( res.meta.status !== 200 ){
        return this.$message.error('获取失败')
      }
      this.progressInfo = res.data
    }
  },
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}

</style>
