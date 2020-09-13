<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/shop.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width=" isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true "
          :default-active="activePath"
          :default-openeds="openArr"
        >
          <!-- 这是一级菜单 -->
          <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 这是二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children "
              :key="subItem.id"
              @click="savePath('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist:[],
      iconsObj:{
        '125':'iconfont icon-editor',
        '103':'iconfont icon-bussiness-man',
        '101':'iconfont icon-component',
        '102':'iconfont icon-all',
        '145':'iconfont icon-dollar',
      },
      isCollapse:false,
      activePath:'',
      openArr:[]
    }
  },
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    //console.log(this.openArr)
  },
  watch:{

  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所有菜单
    async getMenuList() {
      const { data:res } = await this.$http.get('menus')
      if( res.meta.status !== 200 ) return this.$message.error( res.meta.msg )
      this.menulist = res.data
      //console.log(res)
    },
    //菜单栏的折叠与展开
    toggleCollapse() {
      this.isCollapse=!this.isCollapse
    },

    savePath(activePath){
      //console.log("调用了save")
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
  // 在当前路由改变，但是该组件被复用时调用
  beforeRouteUpdate (to, from, next) {
    // 解决导航栏激活问题
    //console.log( "from:"+from.path,"--to:"+to.path)
    const acPath = window.sessionStorage.getItem('activePath')
    // 判断是否返回首页，是的话将
    if (to.path === "/welcome") {
      //console.log("acPath:"+acPath)
      //console.log("activePath:"+this.activePath)
      this.savePath("false")
      this.openArr = []
      //console.log(this.openArr)
    }
    next()
  }

}
</script>
<style lang="less" scoped>
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
     div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;//解决展开导航栏会超出区域的问题
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .home-container{
    height: 100%;
  }
  .iconfont{
    margin-right: 8px;
  }
  
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;//鼠标变为小手
  }
</style>