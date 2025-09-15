// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Views
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import AddBookView from '../views/AddBookView.vue'

// Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth'

/**
 * Helper: resolves once with the current user (or null).
 * Avoids using auth.currentUser synchronously on refresh.
 */
const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(
      getAuth(),
      (user) => { unsub(); resolve(user) },
      (err) => { unsub(); reject(err) }
    )
  })

const routes = [
  { path: '/', component: AddBookView, meta: { requiresAuth: true } },
  { path: '/about', component: AboutView, meta: { requiresAuth: true } },

  // Public pages (no requiresAuth)
  { path: '/login', component: LoginView },
  { path: '/FireLogin', component: FirebaseSigninView },
  { path: '/FireRegister', component: FirebaseRegisterView },

  // Also protected (same component as '/')
  { path: '/addbook', name: 'AddBook', component: AddBookView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * Guard: only allow routes with requiresAuth when a user is logged in.
 * Uses the return-style (Vue Router v4) to avoid multiple next() calls.
 */
router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth)
  if (!requiresAuth) return true

  try {
    const user = await getCurrentUser()  // wait for real auth state
    if (!user) {
      return { path: '/FireLogin', query: { redirect: to.fullPath } }
    }
    return true
  } catch (e) {
    console.error('Auth state check failed:', e)
    return { path: '/FireLogin' }
  }
})

export default router
