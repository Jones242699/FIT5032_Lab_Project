<script setup>
import BHeader from './components/BHeader.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showHeader = computed(() => {
  const n = String(route.name ?? '').toLowerCase()
  const p = String(route.path ?? '').toLowerCase()

  const isCountBookAPI = n.includes('countbookapi') || p.includes('countbookapi')
  return !isCountBookAPI
})
</script>

<template>
  <header v-if="showHeader">
    <BHeader />
  </header>

  <main class="container">
    <router-view></router-view>
  </main>
</template>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

</style>
