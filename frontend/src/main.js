import firebase from 'firebase'
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
//import './sass/main.scss';

Vue.config.productionTip = false

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBEye8bc5tWqalHWvixMFyzOitIQWrRwec",
  authDomain: "key-stream.firebaseapp.com",
  databaseURL: "https://key-stream.firebaseio.com",
  projectId: "key-stream",
  storageBucket: "key-stream.appspot.com",
  messagingSenderId: "804789222462",
  appId: "1:804789222462:web:c3adaa230e13f61436656f",
  measurementId: "G-6RQNVQCS3V"
}
firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
