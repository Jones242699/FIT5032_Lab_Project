<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">User Information Form</h1>

        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="username" class="form-label">Username</label>
              <input id="username" type="text" class="form-control" v-model="formData.username" />
            </div>
            <div class="col-md-6">
              <label for="password" class="form-label">Password</label>
              <input id="password" type="password" class="form-control" v-model="formData.password" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <div class="form-check mt-4">
                <input id="isAustralian" class="form-check-input" type="checkbox" v-model="formData.isAustralian" />
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
            <div class="col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <select id="gender" class="form-select" v-model="formData.gender">
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea id="reason" class="form-control" rows="3" v-model="formData.reason"></textarea>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" 
                @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Our logic will go here
</script>

<style scoped>
/* Our styles will go here */
</style>
