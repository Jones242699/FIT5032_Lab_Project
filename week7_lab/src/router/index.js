import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView }
  { path: '/FireLogin', component: FirebaseSigninView } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // if not authenticated, redirect to login
  } else {
    next()
  }
})

export default router