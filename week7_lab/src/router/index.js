import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth"

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
  { path: '/FireLogin', component: FirebaseSigninView },
  { path: '/FireRegister', component: FirebaseRegisterView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router guard: ensure that only after login can each router be reached
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (!requiresAuth) {
    next();
    return;
  }

  // use Firebase's onAuthStateChanged to check whether user has already logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Router Guard: User logged in:", user.email)
      next();
    } else {
      console.warn("Router Guard: No user logged in, redirecting to FireLogin")
      next('/FireLogin');
    }
  });
});

export default router;
