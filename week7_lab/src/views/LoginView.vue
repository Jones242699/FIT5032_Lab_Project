<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// simple hardcoded authentication for demonstration purposes
const username = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()

// use localStorage to persist login state
const login = () => {
  if (username.value === 'admin' && password.value === '1234') {
    localStorage.setItem('isAuthenticated', 'true')
    error.value = null
    router.push('/about') // route to About page after login
  } else {
    error.value = 'Invalid username or password'
  }
}
</script>

<template>
  <div class="container mt-5" style="max-width: 400px;">
    <h2 class="mb-3">Login</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input v-model="username" type="text" id="username" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="password" type="password" id="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>
