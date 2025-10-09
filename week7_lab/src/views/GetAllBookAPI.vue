<template>
  <section class="wrap">
    <h1>GetAllBookAPI</h1>

    <div class="controls">
      <button @click="load" :disabled="loading">
        {{ loading ? 'Loading...' : 'Load All Books' }}
      </button>
      <span v-if="errorMsg" class="error">Error: {{ errorMsg }}</span>
    </div>

    <pre v-if="jsonText" class="json">{{ jsonText }}</pre>
    <p v-else class="hint">Click "Load All Books" to fetch JSON.</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(false)
const errorMsg = ref('')
const jsonText = ref('')

// Use deployed function URL via Vite env
const URL = import.meta.env.VITE_GET_ALL_BOOKS_URL || ''

async function load() {
  errorMsg.value = ''
  jsonText.value = ''
  loading.value = true
  try {
    if (!URL) throw new Error('Missing VITE_GET_ALL_BOOKS_URL')
    const res = await fetch(URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    jsonText.value = JSON.stringify(data, null, 2)
  } catch (e) {
    errorMsg.value = e.message || String(e)
  } finally {
    loading.value = false
  }
}

// (optional) auto-load on mount for quick screenshot
onMounted(() => { /* uncomment to auto load */ /* load() */ })
</script>

<style scoped>
.wrap { max-width: 900px; margin: 2rem auto; }
.controls { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
.json { background: #0b1020; color: #dfe7ff; padding: 1rem; border-radius: 8px; overflow: auto; }
.hint { color: #666; }
.error { color: #c62828; }
</style>
