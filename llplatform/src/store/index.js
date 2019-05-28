import Vue from 'vue'
import Vuex from 'vuex'
import { requestUserInfo } from '@/api/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: '',
      permissions: []
    },
    source: {
      token: null,
      cancel: null
    }
  },
  mutations: {
    setUser (state, { user }) {
      state.user.name = user.name
      state.user.permissions = user.permissions
    },
    deleteUser (state) {
      state.user.name = ''
      state.user.permissions = []
    },
    updateSource (state, { source }) {
      state.source = source
    }
  },
  actions: {
    requestUserInfo ({ commit }) {
      return requestUserInfo().then(user => {
        commit('setUser', { user })
      })
    }
  }
})
