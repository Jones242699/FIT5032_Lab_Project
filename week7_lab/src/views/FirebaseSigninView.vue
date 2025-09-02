<template>
  <div class="container mt-5">
    <!-- choose roles -->
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

    <button class="btn btn-success w-100" @click="signin">
      Sign in via Firebase
    </button>

    <!-- register entrance-->
    <p class="text-center mt-3">
      Don't have an account?
      <router-link to="/FireRegister">Register here</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// form fields
const email = ref("");
const password = ref("");
const role = ref("user"); // default User

// router instance
const router = useRouter();
const auth = getAuth();

// sign-in function
const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;

      // Determine actual role 
      let actualRole = "user";
      if (user.email === "admin1@example.com") {
        actualRole = "admin";
      }

      // Compare selected role with actual role
      if (role.value !== actualRole) {
        alert(
          `Role mismatch! ${user.email} is not allowed to sign in as ${role.value}`
        );
        console.error("Role mismatch");
        return; // Stop here, don't continue to home
      }

      console.log("Firebase Sign-in Successful!", user.email);
      console.log("Selected Role:", role.value);
      console.log("Actual Role:", actualRole);
      console.log("Current User:", auth.currentUser);

      alert(`Login successful as ${actualRole}!`);
      router.push("/"); // Redirect to home page after login
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
