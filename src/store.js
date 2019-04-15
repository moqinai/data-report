import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  }
}) */
export default new Vuex.Store({
  state: {
    openKeys: '',
    domain: location.href.indexOf('localhost') !== -1 ? 'http://test.report.pxjy.com' : 'http://report.staff.pxjy.com',
    menu: JSON.parse(localStorage.getItem('menu'))
  },
  getters: {
  },
  mutations: {
    changeOpenKeys (state, data) {
      if (data) {
        sessionStorage.setItem('openKeys', data.openKeys)
      } else {
        state.openKeys = sessionStorage.getItem('openKeys') || ''
      }
    },
    menuList (state, data) {
      if (data) {
        state.menu = data
        localStorage.setItem('menu', JSON.stringify(data) || '')
      }
    }
  },
  actions: {
    /* menuList ({ commit }, menu) {
      commit('MENULIST', menu)
    } */
  }
})
