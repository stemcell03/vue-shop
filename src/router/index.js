import Vue from 'vue'
import VueRouter from 'vue-router'

//import login from '../components/login.vue'
const login = () => import( /*webpackChunkName: "login-home-welcome" */ '../components/login.vue')
// import home from '../components/home.vue'
const home = () => import( /*webpackChunkName: "login-home-welcome" */ '../components/home.vue')

// import welcome from '../components/welcome.vue'
const welcome = () => import( /*webpackChunkName: "login-home-welcome" */ '../components/welcome.vue')

import users from '../components/uer/users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Goodslist from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: users
      },
      {
        path: '/rights',
        component: Rights,
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: Goodslist
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      },
    ]
  },

]


const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})


export default router