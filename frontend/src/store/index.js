import Vue from 'vue'
import Vuex from 'vuex'

import authentication from './authentication'
import room from './room'
import message from './message'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    authentication,
    room,
    message
  }
})
