<template>
  <div>
    <custom-table 
      :options="options" 
      :pages="pages"
      @search="search"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #header>
        <el-button type="primary">测试</el-button>
      </template>
      <el-table
        :data="showData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </custom-table>
    <div id="test" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      showData:[],
      searchParams:{},
      data:[
        {
          date: '2016-05-02',
          name: '王小一',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小二',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
      pages: {
        currentPage:1,
        total:0,
        pageSize:10,
        pageSizes:[10,20,30,50]
      },
      options:{
        lableWidth:'60px',
        items:[
          {
            prop:"date",
            label:"日期",
            width:"180",
            type:'date',
          },
          {
            prop:"name",
            label:"姓名",
            width:"180",
            disabled:true

          },
          {
            prop:"address",
            label:"地址"
          }
        ]
      },
      chartOptions: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  }, 
  async mounted(){
    this.getList()
        // 3.基于准备好的dom，初始化echarts实例
    var myChart = this.$echarts.init(document.getElementById('test'));

    const {data:res} = await this.$http.get('reports/type/1')

    if( res.meta.status !== 200 ){
      return this.$message.error('获取数据失败')
    }

    // 4. 指定图表的配置项和数据
    const result = _.merge(res.data, this.chartOptions)
    // 5. 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {
    getList(page){
      this.showData = this.data
      this.searchRes()
      this.pages.total = this.showData.length
    },
    searchRes(){
      const _this = this
      const searchKey = Object.keys(this.searchParams)
      let res = this.data
      for(let i = 0; i <searchKey.length; i++) {
        const temp = []
        res.forEach(e =>{
          if(e[searchKey[i]] && e[searchKey[i]].includes(_this.searchParams[searchKey[i]].trim())){
            temp.push(e)
          }
        })
        res = temp
      }
      this.showData = res
      console.log(res,'res');
    },
    search(v){
      console.log(v)
      this.searchParams = v
      this.getList()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pages.pageSize = val
      this.getList(this.pages)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pages.currentPage = val
      this.getList(this.pages)
    }
  },
}
</script>

<style lang="less" scoped>

</style>