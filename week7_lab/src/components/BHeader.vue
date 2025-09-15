<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

const router = useRouter()
const isAuthenticated = ref(false)
const auth = getAuth()

// Check authentication state on component mount
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true
      console.log("User logged in:", user.email)
    } else {
      isAuthenticated.value = false
      console.log("No user logged in")
    }
  })
})

// Firebase Logout
const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully")
      router.push('/FireLogin') // Redirect to login page after logout
    })
    .catch((error) => {
      console.error("Logout error:", error)
    })
}
</script>

<template>
  <div class="container">
    <header class="d-flex align-items-center py-3">
      <!-- Center navigation: Home & About -->
      <ul class="nav nav-pills mx-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            About
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">
            Add Book
          </router-link>
        </li>
      </ul>

      <!-- Right side navigation: Firebase Login/Register/Logout -->
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
        <li v-else class="nav-item">
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
