import { HOME_PAGE } from "../../router"
export default {
  namespaced: true,
  state: {
    home: HOME_PAGE,
    tabs: {
      current: {},
      opened: []
    }
  },
  getters: {
    homePage: (state) => {
      return state.home
    },
    tabs: (state) => {
      return state.tabs
    }
  },
  mutations: {
    initState (state) {
      if (sessionStorage.getItem('tabs')) {
        state.tabs = JSON.parse(sessionStorage.getItem('tabs'))
      } else {
        state.tabs = {
          current: {},
          opened: []
        }
      }
    },
    // 路由跳转
    tabRouter (state, o) {
      let index = state.tabs.opened.findIndex(e => {
        return e.meta.title === o.meta.title
      });
      if (index === -1 && o.meta.title) {
        state.tabs.opened.push(o)
      }
      if (o.meta.title) {
        state.tabs.current = o
      }
    },
    delTab (state, o) {
      console.log(o);
      let index = state.tabs.opened.findIndex(e => {
        return e.path === o.path
      });
      state.tabs.opened.splice(index, 1)
      if (o.path === state.tabs.current.path) {
        (state.tabs.current = state.tabs.opened[index - 1] || state.tabs.opened[index + 1]) || o.router.push(state.home)
      }
    },
    closeTabs(state, o) {
      const index = state.tabs.opened.findIndex(e => {
        return state.tabs.current.meta.title == e.meta.title
      })
      switch (o.position) {
        case 'left':
          state.tabs.opened.splice(0, index);
          break;
        case 'right':
          state.tabs.opened.splice(index + 1);
          break;
        case 'other':
          state.tabs.opened = [state.tabs.current];
          break;
        case 'all':
          state.tabs.opened = [];
          o.router.push(state.home)
          break;
        default:
          break;
      }
    }
  },
  actions: {
    tabRouter ({commit},o) {
      commit('tabRouter', o)
    },
    initState ({ commit }, o) {
      commit('initState', o)
    }
  }
}