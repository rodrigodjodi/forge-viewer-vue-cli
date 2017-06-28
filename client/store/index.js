import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  documentId: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YmxleS9CTEVZX1IzXzAyLmR3Zng'
}

const mutations = {
  CHANGEURN (state, urn) {
    state.documentId = urn
  },
  DECREMENT (state) {
    state.count--
  }
}

const actions = {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('INCREMENT')
    }, 200)
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
