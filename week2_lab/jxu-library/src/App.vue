<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import JSONView from './components/JSON.vue';
import { ref, computed } from 'vue';
import Form from './components/LoginForm.vue';
</script>

<template>
  <div class="main-layout">
    <!-- <header>
      <img alt="Vue logo" class="logo" src="./assets/libray_avatar_ai_generated.png" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="Welcome to JXUU's Library!" />
      </div>
    </header> -->

    <main>
      <Form />
      <!-- <JSONView /> -->
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
