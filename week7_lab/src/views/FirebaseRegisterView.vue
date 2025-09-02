<template>
  <div class="container mt-5">
    <h2>Create an Account</h2>

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

    <button class="btn btn-primary" @click="register">
      Register
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// fields of registration form
const email = ref("");
const password = ref("");

// router instance
const router = useRouter();

// Firebase Auth instance
const auth = getAuth();

// registration function
const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase Register Successful!", userCredential.user.email);
      alert("Registration successful!");
      router.push("/FireLogin"); // redirect to login page after registration
    })
    .catch((error) => {
      console.error("Registration error:", error.code, error.message);
      alert(`Error: ${error.code}`);
    });
};
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
