<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

watch(
  () => route.fullPath,
  () => {
    isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
  }
)

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  isAuthenticated.value = false
  router.push('/login')
}
</script>

<template>
  <div class="container">
    <header class="d-flex align-items-center py-3">
      <!-- Center navigation: Home & About -->
      <ul class="nav nav-pills mx-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">
            Home (Week 5)
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            About
          </router-link>
        </li>
      </ul>

      <!-- Right side navigation: Login / Logout -->
      <ul class="nav">
        <li class="nav-item">
          <!-- Firebase Authentication Login -->
          <router-link to="/FireLogin" class="nav-link" active-class="active">
            Firebase Login
          </router-link>
        </li>
        
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
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
