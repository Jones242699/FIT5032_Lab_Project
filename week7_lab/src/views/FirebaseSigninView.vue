<template>
  <div class="container mt-5">
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

    <button class="btn btn-success" @click="signin">
      Sign in via Firebase
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// fields of sign-in form
const email = ref("");
const password = ref("");

// router instance
const router = useRouter();

// Firebase Auth
const auth = getAuth();

// sign-in function
const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase Sign-in Successful!", userCredential.user.email);
      console.log("Current User:", auth.currentUser);
      alert("Login successful!");
      router.push("/"); // redirect to home page after login
    })
    .catch((error) => {
      console.error("Login error:", error.code, error.message);
      alert(`Error: ${error.code}`);
    });
};
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
