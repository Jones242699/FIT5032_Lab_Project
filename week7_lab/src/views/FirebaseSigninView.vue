<template>
  <div class="container mt-5">
    <!-- Role selector -->
    <div class="d-flex justify-content-end mb-3">
      <select v-model="role" class="form-select w-auto">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <h2>Sign in</h2>

    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Email"
        v-model="email"
      />
    </div>

    <div class="mb-3">
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        v-model="password"
      />
    </div>

    <button class="btn btn-success w-100" :disabled="loading" @click="signin">
      {{ loading ? 'Signing in...' : 'Sign in via Firebase' }}
    </button>

    <!-- register entrance-->
    <p class="text-center mt-3">
      Don't have an account?
      <router-link to="/FireRegister">Register here</router-link>
    </p>
  </div>
</template>

<script setup>
// Composition API
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Firebase Auth & Firestore
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import db from '../firebase/init' // <-- adjust path if needed

// Form fields
const email = ref('')
const password = ref('')
const role = ref('user') // default selection
const loading = ref(false)

// Router instance
const router = useRouter()
const auth = getAuth()

/**
 * Sign in flow:
 * 1) Auth login to get uid
 * 2) Read users/{uid} from Firestore to get `role`
 * 3) Compare Firestore role with UI-selected role
 * 4) On mismatch -> signOut + alert; on match -> save state + navigate
 */
const signin = async () => {
  if (loading.value) return
  loading.value = true
  try {
    // 1) Login with Firebase Auth
    const { user } = await signInWithEmailAndPassword(auth, email.value, password.value)

    // 2) Read role from Firestore: users/{uid}
    const profileRef = doc(db, 'users', user.uid)
    const snap = await getDoc(profileRef)

    if (!snap.exists()) {
      // No profile doc -> sign out to avoid unknown-role session
      await signOut(auth)
      alert('No profile found for this account. Please contact admin to set your role.')
      return
    }

    // Normalize roles to lowercase strings for comparison
    const actualRole = String(snap.data().role || '').toLowerCase()
    const selectedRole = String(role.value || '').toLowerCase()

    if (!selectedRole) {
      await signOut(auth)
      alert('Please select a role to sign in.')
      return
    }

    // 3) Compare Firestore role vs selected role
    if (selectedRole !== actualRole) {
      await signOut(auth)
      alert(`Role mismatch: ${user.email} is '${actualRole}', not '${selectedRole}'.`)
      return
    }

    // 4) Persist minimal session state and navigate
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('role', actualRole)
    localStorage.setItem('email', user.email || '')

    alert(`Login successful as ${actualRole}!`)
    router.push('/') // or to a protected page like '/sports-events'
  } catch (err) {
    console.error('Login error:', err.code, err.message)
    alert(`Error: ${err.code}`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
