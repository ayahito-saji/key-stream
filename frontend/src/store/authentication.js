import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

export default {
  namespaced: true,
  state: {
    user: null,
    isFetched: false
  },
  getters: {
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setFetched(state, isFetched) {
      state.isFetched = isFetched
    }
  },
  actions: {
    login(context) {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    logout(context) {
      return new Promise((solve) => {
        firebase.auth().signOut().then(function() {
          contect.commit('setUser', null)
          solve(true)
        }).catch(function(error) {
          solve(false)
        })
      })
    },
    authStateChangeListener(context) {
      firebase.auth().onAuthStateChanged(user => {
        console.log('AUTH USER: ',(user ? user.displayName : user))
        if (user != null) {
          // ユーザーログイン
          const db = firebase.firestore()
          db.collection("users").doc(user.uid).set({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }, { merge: true })
          .then(function() {
            console.log("Success Login")
            context.commit('setUser', user)
            context.commit('setFetched', true)
          })
          .catch(function(error) {
            console.error("Error: ", error)
          })

          db.collection('rooms').where('joinUsers', 'array-contains', user.uid).onSnapshot(querySnapshot => context.dispatch('room/updateJoinRoom', querySnapshot, { root: true }))
          db.collection('rooms').where('invitedUsers', 'array-contains', user.uid).onSnapshot(querySnapshot => context.dispatch('room/updateInvitedRoom', querySnapshot, { root: true }))

        } else {
          // ユーザーログアウト
          context.commit('setUser', null)
          context.commit('setFetched', true)
        }
      })
    }
  }
}
