<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

const router = useRouter()
const auth = getAuth()

// Reactive auth/UI state
const isAuthenticated = ref(false)
const role = ref(null)   // 'user' | 'admin' | null
const email = ref(null)  // current user's email (for display)

// Initialize from localStorage (useful on page refresh)
const hydrateFromStorage = () => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
  role.value = localStorage.getItem('role')
  email.value = localStorage.getItem('email')
}

// Keep localStorage and UI in sync
const clearSessionStorage = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('role')
  localStorage.removeItem('email')
}

// Observe Firebase auth state
onMounted(() => {
  hydrateFromStorage()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // If your login flow already set localStorage, prefer those values
      isAuthenticated.value = true
      // Fallback to user.email if localStorage not set yet
      email.value = localStorage.getItem('email') || user.email || null
      role.value = localStorage.getItem('role') || null
      console.log('User logged in:', email.value, 'role:', role.value)
    } else {
      isAuthenticated.value = false
      role.value = null
      email.value = null
      clearSessionStorage()
      console.log('No user logged in')
    }
  })
})

// Firebase logout with local cleanup
const logout = async () => {
  try {
    await signOut(auth)
    clearSessionStorage()
    isAuthenticated.value = false
    role.value = null
    email.value = null
    console.log('User signed out successfully')
    router.push('/FireLogin') // Redirect to login page after logout
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <div class="container">
    <header class="d-flex align-items-center py-3 w-100">
      <!-- Center navigation -->
      <ul class="nav nav-pills mx-auto">
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">
            Add Book
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/GetBookCount" class="nav-link" active-class="active">
            Get Book Count
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/WeatherCheck" class="nav-link" active-class="active">
            Weather Check
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/CountBookAPI" class="nav-link" active-class="active" exact>
            Count Book API
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/GetAllBookAPI" class="nav-link" active-class="active" exact>
            Get All Book API
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            About
          </router-link>
        </li>

        <!-- Optional: show Admin menu only for admin role -->
        <li class="nav-item" v-if="role === 'admin'">
          <router-link to="/admin" class="nav-link" active-class="active">
            Admin
          </router-link>
        </li>
      </ul>

      <!-- Right side: Auth menu -->
      <ul class="nav">
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/FireLogin" class="nav-link" active-class="active">
            Firebase Login
          </router-link>
        </li>

        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/FireRegister" class="nav-link" active-class="active">
            Firebase Register
          </router-link>
        </li>

        <li v-else class="nav-item d-flex align-items-center gap-2">
          <!-- Optional: small identity chip -->
          <span class="text-muted small">
            {{ email }}
            <span v-if="role" class="badge bg-secondary ms-1 text-uppercase">{{ role }}</span>
          </span>

          <button class="btn btn-link nav-link" style="padding: 0;" @click="logout">
            Logout
          </button>
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
