import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'

export const HOME_PAGE = '/welcome'

//import login from '../components/login.vue'
const login = () => import( /*webpackChunkName: "login-home-welcome" */ '../components/login.vue')
// import home from '../pages/home.vue'
const home = () => import( /*webpackChunkName: "login-home-welcome" */ '../components/home.vue')

// import welcome from '../pages/welcome.vue'
const welcome = () => import( /*webpackChunkName: "login-home-welcome" */ '../components/welcome.vue')

// import users from '../pages/uer/users.vue'
const users = () => import('../pages/uer/users.vue')

// import Rights from '../pages/power/Rights.vue'
const Rights = () => import('../pages/power/Rights.vue')

// import Roles from '../pages/power/Roles.vue'
const Roles = () => import('../pages/power/Roles.vue')

// import Cate from '../pages/goods/Cate.vue'
const Cate = () => import('../pages/goods/Cate.vue')

// import Params from '../pages/goods/Params.vue'
const Params = () => import('../pages/goods/Params.vue')

// import Goodslist from '../pages/goods/List.vue'
const Goodslist = () => import('../pages/goods/List.vue')

// import Add from '../pages/goods/Add.vue'
const Add = () => import('../pages/goods/Add.vue')

// import Order from '../pages/order/Order.vue'
const Order = () => import('../pages/order/Order.vue')

// import Report from '../pages/report/Report.vue'
const Report = () => import('../pages/report/Report.vue')


const components = () => import('../pages/components/index.vue')





Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

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
        component: welcome,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/users',
        component: users,
        meta: {
          title: '用户列表'
        }
      },
      {
        path: '/components',
        component: components,
        meta: {
          title: '组件'
        }
      },
      {
        path: '/components1',
        component: components,
        meta: {
          title: '组件1'
        }
      },
      {
        path: '/components2',
        component: components,
        meta: {
          title: '组件2'
        }
      },
      {
        path: '/rights',
        component: Rights,
        meta: {
          title: '权限列表'
        }
      },
      {
        path: '/roles',
        component: Roles,
        meta: {
          title: '角色列表'
        }
      },
      {
        path: '/categories',
        component: Cate,
        meta: {
          title: '商品分类'
        }
      },
      {
        path: '/params',
        component: Params,
        meta: {
          title: '分类参数'
        }
      },
      {
        path: '/goods',
        component: Goodslist,
        meta: {
          title: '商品列表'
        }
      },
      {
        path: '/goods/add',
        component: Add,
        meta: {
          title: '',
          path:'/goods'
        }
      },
      {
        path: '/orders',
        component: Order,
        meta: {
          title: '订单列表'
        }
      },
      {
        path: '/reports',
        component: Report,
        meta: {
          title: '数据报表'
        }
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
  let { meta, path } = to
  store.commit('tabs/tabRouter', {meta, path})
  next()
})


export default router