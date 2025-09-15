<template>
  <div class="container mt-5">
    <h2>Create an Account</h2>

    <!-- Email field -->
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Email"
        v-model="email"
      />
    </div>

    <!-- Password field -->
    <div class="mb-3">
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        v-model="password"
      />
    </div>

    <!-- Submit button -->
    <button class="btn btn-primary w-100" :disabled="loading" @click="register">
      {{ loading ? "Registering..." : "Register" }}
    </button>
  </div>
</template>

<script setup>
// Vue composition API
import { ref } from "vue";
import { useRouter } from "vue-router";

// Firebase imports
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import db from "../firebase/init"; // adjust path if needed

// Form fields
const email = ref("");
const password = ref("");
const loading = ref(false);

// Router + Auth instances
const router = useRouter();
const auth = getAuth();

/**
 * Registration flow:
 * 1) Create Firebase Auth account
 * 2) Create Firestore profile document in users/{uid}
 * 3) Set default role to "user"
 * 4) Redirect to login
 */
const register = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    // 1) Auth account creation
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // 2) Firestore profile with default role
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user", // default role for all new registrations
      createdAt: Date.now(),
    });

    console.log("Firebase Register Successful!", user.email);
    alert("Registration successful! You can now log in.");
    router.push("/FireLogin"); // redirect to login page
  } catch (error) {
    console.error("Registration error:", error.code, error.message);
    alert(`Error: ${error.code}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
