import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

export default {
  namespaced: true,
  state: {
    joinRooms: {},
    invitedRooms: {},
    joinRoomsAreFetched: false,
    invitedRoomsAreFetched: false,
    currentRoomId: null,
    messageListener: null
  },
  getters: {
    getCurrentRoomId: function (state) {
      return state.currentRoomId
    }
  },
  mutations: {
    setCurrentRoomId: function (state, rid) {
      state.currentRoomId = rid
    }
  },
  actions: {
    updateJoinRoom(context, querySnapshot) {
      let joinRooms = {}
      querySnapshot.forEach(function (doc) {
        joinRooms[doc.id] = doc.data()
      })
      context.state.joinRooms = joinRooms
    },
    updateInvitedRoom(context, querySnapshot) {
      let invitedRooms = {}
      querySnapshot.forEach(function (doc) {
        invitedRooms[doc.id] = doc.data()
      })
      context.state.invitedRooms = invitedRooms
    },
    joinRoom(context, rid) {
      const uid = context.rootState.authentication.user.uid

      const db = firebase.firestore()
      db.collection("rooms").doc(rid).update({
        joinUsers: firebase.firestore.FieldValue.arrayUnion(uid),
        invitedUsers: firebase.firestore.FieldValue.arrayRemove(uid)
      })
      .then(function() {
        console.log("Success Join")
      })
      .catch(function(error) {
        console.error("Error: ", error)
      })
      console.log(rid)
    },
    createRoom(context, displayName) {
      console.log(displayName)
      if (displayName == '') return false
      const uid = context.rootState.authentication.user.uid
      const db = firebase.firestore()
      db.collection("rooms").add({
        displayName: displayName,
        joinUsers: [uid],
        invitedUsers: [],
        isDeleted: false,
        createdAt: Number(new Date())
      })
      .then(function(doc) {
        console.log("Success Create", doc.id)
      })
      .catch(function(error) {
        console.error("Error: ", error)
      })
    },
    inviteUser(context, payload) {
      const email = payload.email
      const rid = payload.rid
      const db = firebase.firestore()
      console.log(payload)

      db.collection("users").where("email", "==", email).limit(1).get().then(function(querySnapshot){

        const doc = querySnapshot.docs[0];
        console.log(doc)

        const uid = doc.id
        db.collection("rooms").doc(rid).update({
          invitedUsers: firebase.firestore.FieldValue.arrayUnion(uid)
        })
        .then(function(doc) {
          console.log("Success Invite", uid)
        })
        .catch(function(error) {
          console.error("Error: ", error)
        })
      }).catch(function(error) {
        console.error("Error: ", error)
      })
    },
    createLife(context, rid) {
      const db = firebase.firestore()
      context.state.currentRoomId = rid
      context.state.messageListener = db.collection('messages').where('rid', '==', rid).onSnapshot(querySnapshot => context.dispatch('message/updateMessage', querySnapshot, { root: true }))
    },
    destroyLife(context) {
      if (context.state.messageListener != null) {
        context.state.messageListener()
        context.state.messageListener = null
      }
    }
  }
}
