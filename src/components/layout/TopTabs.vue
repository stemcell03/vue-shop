<template>
  <div class="container">
    <vue-scroll :ops="ops" ref="scroll" @handle-scroll-complete="handleComplete">
      <ul class="tabs" ref="tabs">
        <li 
          v-for="(tab,i) in tabs.opened" 
          :key="i" 
          :ref="tab.path"
          :class="{active: tab.meta.title === currentTabs.meta.title, 'tabs-item':true}"
          @click="$router.push(tab.path)"  
        >
          {{tab.meta.title}}
          <i class="el-icon-close" @click.stop="close(tab.path)" v-show="tab.meta.title !== '首页'"></i>
        </li>
      </ul>
    </vue-scroll>
    <div class="toggle" @mouseenter="enter" @mouseleave="leave">
      <div class="icon">
        <i class="el-icon-arrow-down" v-if="toggle"></i>
        <i class="el-icon-arrow-up" v-else></i>
      </div>
      <ul :class="{dropMenu:true, 'drop-active': !toggle}" @click="closeMenu">
        <li data-position="left">
          <i class="el-icon-arrow-left"></i>关闭左侧
        </li>         
        <li data-position="right">
          <i class="el-icon-arrow-right"></i>关闭右侧
        </li>
        <li data-position="other">
          <i class="el-icon-close"></i>关闭其他
        </li>
        <li data-position="all">
          <i class="el-icon-error"></i>全部关闭
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name:'TopTabs',
  data() {
    return {
      toggle:true,
      scrollLeft:0,
      ops:{
        rail: {
          opacity: '0',
          background: undefined,
          size: '0'
        },
        bar: {
          background: 'rgba(0,0,0,.5)',
          keepShow: false,
          size: '0',
          minSize: 0
        },
        scrollButton: {
          enable: false,
          background: '#cecece'
        },
        scrollPanel: {
          easing: 'easeOutQuad',
          speed: 800
        },
        vuescroll: {
          wheelScrollDuration: 600,
          wheelDirectionReverse: true
        }
      }
    };
  },
  watch:{
    currentTabs:{
      // immediate:true,
      handler(newV,oldV){
        this.$nextTick(function(){
          if(this.scrollLeft + this.$refs.scroll.$el.offsetWidth - this.$refs[newV.path][0].offsetWidth< this.$refs[newV.path][0].offsetLeft
              || this.scrollLeft > this.$refs[newV.path][0].offsetLeft) {
            this.$refs.scroll.scrollTo({
              x:this.$refs[newV.path][0].offsetLeft - 5
            })
          }
        })
      }
    }
  },
  computed:{
    ...mapState({
      tabs: state => state.tabs.tabs,
      currentTabs: state => state.tabs.tabs.current
    })
  },
  mounted(){
    if(this.$refs.scroll.$el.offsetWidth - this.$refs[this.currentTabs.path][0].offsetWidth < this.$refs[this.currentTabs.path][0].offsetLeft) {
      this.scrollLeft = this.$refs[this.currentTabs.path][0].offsetLeft
      this.$refs.scroll.scrollTo({
        x:this.$refs[this.currentTabs.path][0].offsetLeft
      })
    }
  },
  methods: {
    handleComplete(v,h){
      this.scrollLeft = h.scrollLeft
    },
    enter(){
      this.toggle = !this.toggle
    },
    leave(){
      this.toggle = !this.toggle
    },
    close(p){
      this.$store.commit('tabs/delTab',{path:p,router:this.$router})
    },
    closeMenu(e){
      this.$store.commit('tabs/closeTabs',{position: e.target.dataset.position,router:this.$router})
    },
  },
}
</script>
<style lang='scss' scoped>
  .container{
    display: flex;
    align-items: center;
    .toggle {
      height: 20px;
      width: 20px;
      border-radius: 20%;
      padding: 10px;
      position: relative;
      background-color: #fff;
      text-align: center;
      line-height: 20px;
      .icon{
        font-size: 20px;
      }
      .dropMenu{
        position: absolute;
        transform: scaleY(0);
        transform-origin:0 0;
        right: 0%;
        top: calc( 100% + 10px);
        padding: 5px 0;
        transition: 0.2s;
        z-index: 999;
        li{
          font-size: 14px;
          white-space: nowrap;
          padding: 10px 15px;
          line-height: 14px;
          &:last-of-type{
            // padding: 0;
          }
          &:hover{
            cursor: pointer;
            background-color: #ecf5ff;
            color: #66b1ff;
          }
        }
      }
      .drop-active{
        transform: scaleY(1);
        background-color: #fff;
        box-shadow: 2px 2px 5px rgba($color: #000000, $alpha: 0.5);
      }
    }

  }
  .tabs{
    width: 100%;
    white-space: nowrap;
    display: flex;
    li{
      margin: 0 5px;
    }
    .tabs-item{
      background-color: #fff;
      border-radius: 10%;
      padding: 8px 15px;
      color: #666;
      font-size: 14px;
      &:hover{
        cursor: pointer;
        color: #000;
      }
      i{
        margin-left: 5px;
        padding: 3px;
        border-radius: 50%;
        background-color: #fff;
        transition: 0.5s;
        &:hover{
          background-color: #eee;

        }
      }
    }
    .active{
      color: #3296fa !important;
    }
  }
</style>