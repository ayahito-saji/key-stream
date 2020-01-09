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
    messageListener: null,
    joinUserListener: null,
    invitedUserListener: null
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

      db.collection("users").doc(uid).update({
        joinRooms: firebase.firestore.FieldValue.arrayUnion(rid),
        invitedRooms: firebase.firestore.FieldValue.arrayRemove(rid)
      })
      .then(function() {
        console.log("Success Join")
      })
      .catch(function(error) {
        console.error("Error: ", error)
      })

      console.log(rid)
    },
    leaveRoom(context, rid) {
      const uid = context.rootState.authentication.user.uid

      const db = firebase.firestore()

      db.collection("rooms").doc(rid).get().then(function(snapshot) {
        let updateData = null;
        if (snapshot.data().joinUsers.length > 1) {
          updateData = {
            joinUsers: firebase.firestore.FieldValue.arrayRemove(uid)
          }
        } else {
          updateData = {
            joinUsers: firebase.firestore.FieldValue.arrayRemove(uid),
            isDeleted: true
          }
        }

        db.collection("rooms").doc(rid).update(updateData)
        .then(function() {
          console.log("Success Leave")
        })
        .catch(function(error) {
          console.error("Error: ", error)
        })
      })

      db.collection("users").doc(uid).update({
        joinRooms: firebase.firestore.FieldValue.arrayRemove(rid),
      })
      .then(function() {
        console.log("Success Leave")
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
        db.collection("users").doc(uid).update({
          joinRooms: firebase.firestore.FieldValue.arrayUnion(doc.id)
        })
        .then(function() {
          console.log("Success Create")
        })
        .catch(function(error) {
          console.error("Error: ", error)
        })

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

        db.collection("users").doc(uid).update({
          invitedRooms: firebase.firestore.FieldValue.arrayUnion(rid)
        })
        .then(function() {
          console.log("Success Invite")
        })
        .catch(function(error) {
          console.error("Error: ", error)
        })

      }).catch(function(error) {
        console.error("Error: ", error)
      })
    },
    createLife(context, rid) {
      const uid = context.rootState.authentication.user.uid
      const db = firebase.firestore()
      context.state.currentRoomId = rid
      context.state.messageListener = db.collection('messages').where('rid', '==', rid).where('to', 'array-contains-any', ['*', uid]).onSnapshot(querySnapshot => context.dispatch('message/updateMessage', querySnapshot, { root: true }))
      context.state.joinUserListener = db.collection('users').where('joinRooms', 'array-contains', rid).onSnapshot(querySnapshot => context.dispatch('user/updateUser', querySnapshot, { root: true }))
      context.state.invitedUserListener = db.collection('users').where('invitedRooms', 'array-contains', rid).onSnapshot(querySnapshot => context.dispatch('user/updateUser', querySnapshot, { root: true }))
    },
    destroyLife(context) {
      if (context.state.messageListener != null) {
        context.state.messageListener()
        context.state.messageListener = null
      }
      if (context.state.joinUserListener != null) {
        context.state.joinUserListener()
        context.state.joinUserListener = null
      }
      if (context.state.invitedUserListener != null) {
        context.state.invitedUserListener()
        context.state.invitedUserListener = null
      }
    }
  }
}
