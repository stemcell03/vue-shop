import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import "@/assets/styles/reset.scss"            // 重置HTML样式、
import echarts from 'echarts'
import vuescroll from 'vuescroll';

// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
//导入字体样式表
import './assets/fonts/iconfont.css'
//引入axios
import axios from 'axios'
// 引入tabel-with-tree-grid
import TreeTabel from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入nprogress 
import NProgress from 'nprogress'

import components from '@/components'


Vue.use(VueQuillEditor, /* { default global options } */)

Vue.use(components)
Vue.prototype.$echarts = echarts

Vue.use(vuescroll);
// 在request拦截器展示进度条
//挂载拦截器
axios.interceptors.request.use(config => {
  //console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在response 拦截器去掉进度条
axios.interceptors.response.use(config => {
  if (config.data.meta.msg === '无效token') {
    router.push('/login')
  }
  NProgress.done()
  return config
})
//将axios写入Vue原型中
Vue.prototype.$http = axios
//a设置xios默认的发送基址
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

Vue.config.productionTip = false

//treetabel注册
Vue.component('tree-tabel', TreeTabel)

// 注册时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')