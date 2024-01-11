import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import UserView from "@/views/UserView.vue";
import LoginView from "@/views/LoginView.vue";
import VoteView from "@/views/VoteView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/user',
    name: 'User',
    component: UserView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/vote',
    name: 'Vote',
    component: VoteView
  },
  // {
  //   path: '/counties/:countyId',
  //   name: 'County',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/UserView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
