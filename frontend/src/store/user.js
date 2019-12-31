import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

export default {
  namespaced: true,
  state: {
    users: {}
  },
  getters: {
    joinUsers: function (state, getters, rootState) {
      return Object.entries(state.users).filter((u)=>{
        return u[1].joinRooms && u[1].joinRooms.indexOf(rootState.room.currentRoomId) != -1
      })
    },
    invitedUsers: function (state, getters, rootState) {
      return Object.entries(state.users).filter((u)=>{
        return u[1].invitedRooms && u[1].invitedRooms.indexOf(rootState.room.currentRoomId) != -1
      })
    },
    user: (state, getters, rootState) => (uid) => {
      return [uid, state.users[uid] ? state.users[uid] : {}]
    }
  },
  mutations: {
  },
  actions: {
    updateUser(context, querySnapshot) {
      let users = {}
      querySnapshot.forEach(function (doc) {
        users[doc.id] = doc.data()
      })
      context.state.users = Object.assign({}, context.state.users, users)
    }
  }
}
