import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '',
    name: 'content',
    component: () => import(/* webpackChunkName: "about" */ '../views/Authenticated.vue'),
    children: [
        {
          path: '/',
          component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
        },
        {
          // /user/:id/posts がマッチした時に
          // UserPosts は User の <router-view> 内部で描画されます
          path: '/:rid',
          component: () => import(/* webpackChunkName: "about" */ '../views/Room.vue')
        }
      ]
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
