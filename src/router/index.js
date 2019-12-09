import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Home from '@/pages/Home/Home'
import Error404 from '@/pages/404.vue'
import Error from '@/pages/Error.vue'
import ClientView from '@/pages/Client/ClientViewPort'
Vue.use(Router)

// 未登录时候的路由
export const constRouter = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
      path: '/error',
      name: 'error',
      component: Error
  },
  {
      name: '404',
      path: '/404',
      component: Error404
  },
  {
      name: 'client',
      path: '/client/:id/:params?',
      component: ClientView
  },
  {
    path: '*',
    redirect: '/404'
  }];

let router = new Router({
  routes: constRouter,
  linkActiveClass: 'active'
})

export default router;