import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

export default {
  namespaced: true,
  state: {
    messages: {}
  },
  getters: {
    messages: function (state, getters, rootState) {
      console.log(rootState.room.currentRoomId)
      return Object.entries(state.messages).filter((m)=>{
        return m[1].rid == rootState.room.currentRoomId
      }).sort(function(a, b) {
        return a[1].createdAt - b[1].createdAt
      })
    }
  },
  mutations: {
  },
  actions: {
    updateMessage(context, querySnapshot) {
      console.log("update messages")
      const messages = {}
      querySnapshot.forEach(function (doc) {
        messages[doc.id] = doc.data()
      })
      context.state.messages = Object.assign({}, context.state.messages, messages)
    },
    createMessage(context, body) {
      console.log(body)
      if (body == '') return false
      const uid = context.rootState.authentication.user.uid
      const rid = context.rootState.room.currentRoomId
      const db = firebase.firestore()
      db.collection("messages").add({
        body: body,
        from: uid,
        to: [],
        isDeleted: false,
        rid: rid,
        createdAt: Number(new Date())
      })
      .then(function(doc) {
        console.log("Success Create Message", doc.id)
      })
      .catch(function(error) {
        console.error("Error: ", error)
      })
    }
  }
}
