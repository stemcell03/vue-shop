<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px':'250px'">
      <div class="icon">
        <img src="../assets/shop.png" alt />
        <span v-show="!isCollapse">后台管理系统</span>
      </div>
      <div class="toggle-button" @click="toggleCollapse">
        <i :class="{'el-icon-arrow-right':!isCollapse,'el-icon-arrow-left':isCollapse}"></i>
      </div>
      <!-- 侧边栏菜单区域 -->
      <el-menu
        background-color="#191a23"
        text-color="#ccc"
        active-text-color="#409eff"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true "
        :default-active="activeRoute"
        :default-openeds="openArr"
      >
        <!-- 这是一级菜单 -->
        <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.id">
          <!-- 一级菜单的模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="iconsObj[item.id] || 'iconfont icon-editor'"></i>
            <!-- 文本 -->
            <span>{{ item.authName }}</span>
          </template>
          <!-- 这是二级菜单 -->
          <el-menu-item
            :index="'/' + subItem.path"
            v-for="subItem in item.children "
            :key="subItem.id"
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
    <!-- 右侧区域 -->
    <el-container 
      class="right" 
      :style="{width:isCollapse ? 'calc( 100vw - 64px)':'calc( 100vw - 250px)'}"
    >
      <!-- 头部区域 -->
      <el-header>
        <div class="header">
          <div>
          </div>
          <div class="button">
            <el-button type="info" size="mini" @click="logout">退出</el-button>
          </div>
        </div>
        <div class="top-tabs">
          <top-tabs @changePath="changePath"/>
        </div>
      </el-header>
      <!-- 主要内容 -->
      <!-- <el-container> -->
        <el-main  class="main">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      <!-- </el-container> -->
    </el-container>
  </el-container>
</template>

<script>
import {mapState} from 'vuex'

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
  },
  computed:{
    ...mapState({
      tabs: state => state.tabs.tabs
    }),
    activeRoute(){
      let {meta, path} = this.$route
      if(meta.path) {
        return meta.path
      }
      return path
    }
  },
  mounted(){
    this.saveUserData()
    window.myEvent || (window.myEvent = {})
    window.myEvent['custom-resize'] = new CustomEvent('custom-resize', { 
        detail: { title: 'This is title!'},
    });
    window.myEvent['custom-chartReset'] = new CustomEvent('custom-chartReset', { 
        detail: { title: 'This is title!'},
    });
  },
  methods: {
    changePath(p){
      this.activePath = p
    },
    // 讲 vuex 中的数据保存到 localStorage 中（在即将离开页面(刷新或关闭)时执行）
    saveUserData() {
      let _self = this;
      window.addEventListener("beforeunload", () => {
        sessionStorage.setItem('tabs', JSON.stringify(this.tabs))
      });
    },
    logout() {
      window.sessionStorage.clear();
      this.$store.dispatch('tabs/initState')
      this.$router.push("/login");
    },
    //获取所有菜单
    async getMenuList() {
      const extra = [
        {
          authName: "组件管理",
          children: [{  
              authName: "组件展示",
              children: [],
              id: (Math.random() * 100).floor,
              order: 1,
              path: "components"},
              {  
              authName: "组件展示",
              children: [],
              id: (Math.random() * 100).floor,
              order: 1,
              path: "components1"},
              {  
              authName: "组件展示",
              children: [],
              id: (Math.random() * 100).floor,
              order: 1,
              path: "components2"},
              
          ],
          id: (Math.random() * 100).floor,
          order: 1,
          path: "components"
        }
      ]
      const { data:res } = await this.$http.get('menus')
      if( res.meta.status !== 200 ) return this.$message.error( res.meta.msg )
      this.menulist = res.data.concat(extra)
    },
    //菜单栏的折叠与展开
    toggleCollapse() {
      this.isCollapse=!this.isCollapse
      if(window.dispatchEvent) {  
          window.dispatchEvent(window.myEvent['custom-resize']);
      } else {
          window.fireEvent(window.myEvent['custom-resize']);
      }
    },
  },
}
</script>
<style lang="less" scoped>
  .el-aside{
    color: #eee;
    box-sizing: border-box;
    padding: 0 !important;
    overflow: scroll;
    &::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }
    background-color: #191a23;
    .el-menu{
      border: none;
    }
    .icon{
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      img{
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      span{
        margin-left: 20px;
      }
    }
  }
  .right{
    overflow: scroll;
    position: relative;
    padding: 0;
    .el-header{
      width: calc( 100% - 5px);
      padding: 0;
      position: sticky;
      z-index: 9998;
      right: 10px;
      top: 0;
      .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        background-color: #fff;
        .button{
          padding-right: 20px;
        }
      }
      .top-tabs{
        padding: 5px 0;
        background-color: #eaedf1;
      }
    }

    .el-main{
      background-color: #eaedf1;
      width:100%;
      padding: 0;
      padding-top: 60px;
      position: relative;
    }
  }

  .home-container{
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  .iconfont{
    margin-right: 8px;
  }
  
  .toggle-button{
    font-size: 30px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;//鼠标变为小手
  }
</style>