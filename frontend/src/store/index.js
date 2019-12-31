import Vue from 'vue'
import Vuex from 'vuex'

import authentication from './authentication'
import user from './user'
import room from './room'
import message from './message'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    authentication,
    user,
    room,
    message
  }
})
